import { Rels, Classes, Actions } from 'd2l-hypermedia-constants/index';
import SirenParse from 'siren-parser';
const RESPONSE_FREQUENCY_NEVER_RESHOW = -1;

export class HmInterface {
	constructor({
		feedbackApplication,
		feedbackType,
		feedbackDomainRoot,
		token,
		responseFrequency = RESPONSE_FREQUENCY_NEVER_RESHOW
	}) {
		this.feedbackApplication = feedbackApplication;
		this.feedbackType = feedbackType;
		this.feedbackDomainRoot = feedbackDomainRoot;
		this.token = token;
		this.responseFrequency = responseFrequency;
		this.setupPromise = this.setup();
	}

	checkForRequiredParams() {
		if (!this.feedbackApplication) {
			throw new Error('no feedbackApplication provided');
		}
		if (!this.feedbackType) {
			throw new Error('no feedbackType provided');
		}
		if (!this.feedbackDomainRoot) {
			throw new Error('no feedbackDomainRoot provided');
		}
		if (!this.token) {
			throw new Error('no token provided');
		}
	}

	async setup() {
		this.token = await this.getToken();
		this.checkForRequiredParams();

		const domainRootEntity = await this.makeCall(this.feedbackDomainRoot);
		const applicationsHref = domainRootEntity.getLinkByRel(Rels.Feedback.applications).href;
		const applicationsEntity = await this.makeCall(applicationsHref);
		const applicationsSubEntities =
			applicationsEntity.getSubEntitiesByClass(Classes.feedback.feedbackApplication)
				.filter(x => console.log(x) || x.title === this.feedbackApplication);
		if (!applicationsSubEntities || !applicationsSubEntities.length) {
			throw new Error(`can't find the ${this.feedbackApplication} application`);
		}
		const applicationLinkHref = applicationsSubEntities[0].href;
		const applicationEntity = await this.makeCall(applicationLinkHref);
		const applicationTypeEntities = applicationEntity.getSubEntitiesByClass(Classes.feedback.feedbackType)
			.filter(x => x.title === this.feedbackType);
		if (!applicationTypeEntities || !applicationTypeEntities.length) {
			throw new Error(`can't find the ${this.feedbackType} type`);
		}
		this.applicationTypeEntity = await this.makeCall(applicationTypeEntities[0].href);
		console.log('applicationTypeEntity', this.applicationTypeEntity);
		this.feedbackSubmissions = this.applicationTypeEntity.getSubEntitiesByRel(Rels.feedbackSubmission);
		console.log('feedback submissions', this.feedbackSubmissions);
		this.optOutAction = this.applicationTypeEntity.getActionByName(Actions.feedback.optOut);
		this.sendFeedbackAction = this.applicationTypeEntity.getActionByName(Actions.feedback.submit);
	}

	async shouldShow() {
		await this.setupPromise;
		return !(await this.isOptedOut() || await this.hasRespondedRecently());
	}

	async isOptedOut() {
		await this.setupPromise;
		const properties = this.applicationsEntity.properties;

		if (properties.OptOut === 'permanent') {
			return true;
		}

		if (properties.OptOut === 'temporary' && !this.shouldShowAgain(properties.optOutTimeMs)) {
			return true;
		}

		return false;
	}

	shouldShowAgain(timeToCheckMs) {
		if (this.responseFrequency === RESPONSE_FREQUENCY_NEVER_RESHOW) {
			return false;
		}

		return timeToCheckMs > new Date().getMilliseconds() - this.responseFrequency;
	}

	async getMostRecentFeedbackSubmissionTime() {
		await this.setupPromise;
		return (this.feedbackSubmissions && this.feedbackSubmissions.length > 0) ? this.feedbackSubmissions[0].submittedMs : -1;
	}

	async hasRespondedRecently() {
		await this.setupPromise;
		return !this.shouldShowAgain(await this.getMostRecentFeedbackSubmissionTime());
	}

	async optionExistsOnField(field, option) {
		return field.value.filter(o => o.value === option).length > 0;
	}

	async optOut(optOutType) {
		await this.setupPromise;

		if (!this.optOutAction || !this.optOutAction.hasFieldByName('optOutState')) {
			throw new Error('Problem with opt-opt action');
		}
		if (!await this.optOutStateFieldOptionExists(this.optOutAction, this.optOutAction.getFieldByName('optOutState'))) {
			throw new Error(`Invalid opt-out parameter ${optOutType}`);
		}
		const result = await this.makeCall(this.optOutAction.href, {
			method: this.optOutAction.method,
			body: { optOutState: optOutType }
		});
		console.log('OPT OUT RESULT', result);
	}

	async sendFeedback(feedbackObject) {
		await this.setupPromise;

		const result = await this.makeCall(this.sendFeedbackAction.href, {
			method: this.sendFeedbackAction.method,
			body: feedbackObject
		});
		console.log('SUBMIT RESULT', result);
	}

	async makeCall(href, { method = 'GET', body } = {}) {
		if (!href) {
			throw new Error('no href provided');
		}
		if (typeof body === 'object') {
			body = JSON.stringify(body);
		}
		const response = await window.fetch(href, {
			method,
			body: body,
			headers: {
				Authorization: this.token
			}
		});
		if (!response.ok || !this.isSuccessResponse(response)) {
			throw new Error(`${href} call was not successful, status: ${response.status}, ok: ${response.ok}`);
		}
		const deserializedResponse = SirenParse(await response.json());
		console.log('deserializedResponse', deserializedResponse);
		return deserializedResponse;
	}

	isSuccessResponse(response) {
		return Math.floor(response.status / 100) === 2;
	}
}