import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/icons/icon';
import 'd2l-alert/d2l-alert';
import 'd2l-loading-spinner/d2l-loading-spinner';

import { css, html, LitElement } from 'lit-element/lit-element.js';

import { getComposedChildren } from '@brightspace-ui/core/helpers/dom';
import { HmInterface } from './user-feedback-hm-interface.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class UserFeedbackContainer extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			prompt: { type: String },
			feedbackVersion: { type: Number, attribute: 'feedback-version' },
			feedbackApplication: { type: String, attribute: 'feedback-application' },
			feedbackType: { type: String, attribute: 'feedback-type' },
			feedbackHref: { type: String, attribute: 'feedback-href' },
			_buttonDisabled: { type: Boolean },
			_submitted: { type: Boolean },
			active: { type: Boolean },
			_currentState: { type: Object }
		};
	}

	static get styles() {
		return css`
			:host([hidden]) {
				display: none;
			}

			:host {
				padding-bottom: 1rem;
			}

			.user-feedback-container-buttons {
				margin-top: 1rem;
			}

			d2l-button-subtle > d2l-icon,
			d2l-button-subtle > span {
				color: var(--d2l-color-celestine);
			}

			.user-feedback-submitted-container {
				display: flex;
				align-items: center;
				flex-direction: column;
			}

			.user-feedback-submitting-container {
				display: flex;
				align-items: center;
				justify-content: center;
				--d2l-loading-spinner-size: 5rem;
			}

			.user-feedback-submitted-icon {
				width: 3rem;
				height: 3rem;
				margin-bottom: 1rem;
				color: var(--d2l-color-celestine);
			}

			.user-feedback-submitted-title {
				color: var(--d2l-color-celestine);
				font-weight: 100;
				margin-bottom: 2rem;
			}

			.user-feedback-submitted-text {
				text-align: center;
				padding: 0 15%;
			}

			.user-feedback-submitted-text > a {
				color: var(--d2l-color-celestine);
			}
		`;
	}

	static async getLocalizeResources(langs) {
		const langResources = {
			'en': {
				'sendFeedback': 'Send Feedback',
				'dontWantToGiveFeedback': "I don't want to give feedback",
				'cancel': 'Cancel',
				'close': 'Close',
				'submittedTitle': 'Thank You!',
				'errorSubmitting': 'There was an error submitting your feedback, please try again later',
			}
		};

		for (let i = 0; i < langs.length; i++) {
			if (langResources[langs[i]]) {
				return {
					language: langs[i],
					resources: langResources[langs[i]]
				};
			}
		}

		return null;
	}

	constructor() {
		super();
		this._updateButtonDisabled();
		this._currentState = this.states.submitted;

		if (this.active) {
			this.hmInterface = new HmInterface({
				feedbackApplication: this.feedbackApplication,
				feedbackType: this.feedbackType,
				feedbackDomainRoot: this.feedbackHref,
				getToken: () => { // TODO: Alright if we use d2l-fetch, maybe look into that
					return Promise.resolve('Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjliMTg5ZWJhLWZmNjYtNDM1ZC04OTViLWNjOWI3ZDc3ODUyZCJ9.eyJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTcxNDUyNzE1LCJuYmYiOjE1NzE0NDkxMTUsInN1YiI6IjE2OSIsInRlbmFudGlkIjoiOTlkNmM4OGYtM2Y5ZS00NWU2LWI4MDQtOTg4YjFmNjhlNDYzIiwiYXpwIjoibG1zOjk5ZDZjODhmLTNmOWUtNDVlNi1iODA0LTk4OGIxZjY4ZTQ2MyIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiI5ZmJhYjIyMS1hMDg3LTRlYTItOGRiNy1jYmU3MGUzNzA2YmQifQ.IzYgfbrQPyQyObPCOh9sqMLc4dnh3BRTGazYKi31k1JzsVl-ccMkTeLohXoAjodekXiXp7yzeyZYK4R0ArAMiSYh4h7Drz0bY5z-RmOPSKmbJ79fFEAnK3qP8thPaoAOb8KX-D63wpHefU6LtISv5tcZotlkJFEC51kOVdZ72YZBXfuTvML72ELDo8RBou5pTsetl0B7z7t2yU9CKg0y4-l9vj3iKZTgrqAnLFdbPiIIeGo9y4UrPsFufQXlzwd6_W9YP9yjhWD5FIH9FKDVIX-Jv7rI9kZxYBhxm2SdUKxT5evHhIJTmJiJKCJPGxXyuj0USNezA05KdeyUNM03WA  ');
				}
			});

			this.hmInterface.shouldShow().then(
				result => {
					if (result === true) {
						this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-show-button', { bubbles: true, composed: true }));
					}
				}
			).error(console.error);
		}
	}

	get states() {
		return {
			enteringFeedback: { name: 'enteringFeedback', render: this._renderFeedbackView.bind(this) },
			submitting: { name: 'submitting', render: this._renderFeedbackSubmittingView.bind(this) },
			errorSubmitting: { name: 'errorSubmitting', render: this._renderErrorSubmittingView.bind(this) },
			// optingOut: 'optingOut',
			// errorOptingOut: 'errorOptingOut',
			submitted: { name: 'submitted', render: this._renderFeedbackSubmittedView.bind(this) }
		};
	}

	_isFeedbackComponent(tag) {
		return tag.nodeName === 'D2L-LABS-USER-FEEDBACK-SCALE' || tag.nodeName === 'D2L-LABS-USER-FEEDBACK-TEXT-INPUT';
	}

	_getInnerFeedbackComponents() {
		const childrenArray = getComposedChildren(this.shadowRoot.querySelector('slot')) || [];

		const scale = (childrenArray.filter(this._isFeedbackComponent) || []);

		return [...scale];
	}

	_updateButtonDisabled() {
		this._buttonDisabled = !this._getInnerFeedbackComponents().some(x => x.hasAnyContent && x.hasAnyContent());
	}

	clear() {
		this._getInnerFeedbackComponents().forEach(x => x.clear && x.clear());
	}

	async _onSubmit() {
		this._currentState = this.states.submitting;

		try {
			await this.hmInterface.sendFeedback(this.responseObject);
		} catch (e) {
			console.error(e);
			this._currentState = this.states.errorSubmitting;
		}

		this._dispatchSubmitEvent();
		this._currentState = this.states.submitted;
	}

	_onCancel() {
		this._dispatchCancelEvent();
	}

	async _onReject() {
		this._dispatchRejectEvent();
		/* await */this.hmInterface.optOut('temporary');
	}

	get responseObject() {
		const result =
			this._getInnerFeedbackComponents()
				.map(x => x.serialize())
				.reduce((prev, cur) => Object.assign(prev, cur));

		result.feedbackVersion = this.feedbackVersion || 1;
		return result;
	}

	_dispatchSubmitEvent() {
		this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-container-submit', { bubbles: true, composed: true }));
	}

	_dispatchCancelEvent() {
		this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-container-cancel', { bubbles: true, composed: true }));
	}

	_dispatchRejectEvent() {
		this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-container-reject', { bubbles: true, composed: true }));
	}

	_renderFeedbackSubmittingView() {
		return html`<div class="user-feedback-submitting-container">
			<d2l-loading-spinner></d2l-loading-spinner>
		</div>`;
	}

	_renderErrorSubmittingView() {
		return html`<div class="user-feedback-error-submitting-container">
			<d2l-alert type="error">
				${this.localize('errorSubmitting')}
			</d2l-alert>

			<div class="user-feedback-container-buttons">
				<d2l-button
					primary
					@click="${this._onCancel}"
				>
					<!-- Todo: verify that this also removes the button -->
					${this.localize('close')}
				</d2l-button>
			</div>
		</div>`;
	}

	_renderSubmittedText() {
		// PIE is in English only so don't translate it
		if (this.__pageLanguage && this.__pageLanguage.indexOf('en') === 0) {
			return html`
			<div class="user-feedback-submitted-text">
				You can also share ideas that would make our product even better on our <a href="https://community.brightspace.com/s/article/Product-Idea-Exchange-Overview">Product Idea Exchange</a>
			</div>`;
		}
		return '';
	}

	_renderFeedbackSubmittedView() {
		return html`<div class="user-feedback-submitted-container">
			<d2l-icon class="user-feedback-submitted-icon" icon="tier3:check-circle"></d2l-icon>
			<h1 class="user-feedback-submitted-title">${this.localize('submittedTitle')}</h1>
			${this._renderSubmittedText()}
			<div class="user-feedback-container-buttons">
				<d2l-button
					primary
					@click="${this._onCancel}"
				>
					${this.localize('close')}
				</d2l-button>
			</div>
		</div>`;
	}

	_renderFeedbackView() {
		return html`
			<div
				@d2l-labs-user-feedback-scale-change="${this._updateButtonDisabled}"
				@d2l-labs-user-feedback-scale-init="${this._updateButtonDisabled}"
				@d2l-labs-user-feedback-text-input-change="${this._updateButtonDisabled}"
			>
				<slot></slot>
			</div>
			<div class="user-feedback-container-buttons">
				<d2l-button
					primary
					@click="${this._onSubmit}"
					.disabled="${this._buttonDisabled}"
				>
					${this.localize('sendFeedback')}
				</d2l-button>
				<d2l-button
					@click="${this._onCancel}"
				>
					${this.localize('cancel')}
				</d2l-button>
				<d2l-button-subtle
					icon="tier1:blocked"
					@click="${this._onReject}"
				>
					<span>${this.localize('dontWantToGiveFeedback')}</span>
				</d2l-button-subtle>
			</div>
		`;

	}

	render() {
		return this._currentState.render();
	}
}
customElements.define('d2l-labs-user-feedback-container', UserFeedbackContainer);
