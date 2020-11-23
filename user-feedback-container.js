import '@brightspace-ui/core/components/alert/alert.js';
import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/icons/icon';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';

import { getComposedChildren } from '@brightspace-ui/core/helpers/dom';
import { HmInterface } from './user-feedback-hm-interface.js';
import { langResources } from './lang';
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
			_currentState: { type: Object },
			token: { type: String },
			optOutType: { type: String, attribute: 'opt-out-type' },
			additionalFields: { type: Object, attribute: 'additional-fields' }
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
		this._currentState = this.states.enteringFeedback;
		this.optOutType = 'permanent';
		this.additionalFields = {};
	}

	connectedCallback() {
		super.connectedCallback();

		this.hmInterface = new HmInterface({
			feedbackApplication: this.feedbackApplication,
			feedbackType: this.feedbackType,
			feedbackDomainRoot: this.feedbackHref,
			token: this.token,
			optOutType: this.optOutType
		});
		this.showButtonAfterShouldShowCheck();
	}

	async showButtonAfterShouldShowCheck() {
		const result = await this.hmInterface.shouldShow();
		if (result === true) {
			this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-show-button', { bubbles: true, composed: true }));
		}
	}

	get states() {
		return {
			enteringFeedback: { name: 'enteringFeedback', render: this._renderFeedbackView.bind(this) },
			submitting: { name: 'submitting', render: this._renderFeedbackSubmittingView.bind(this) },
			errorSubmitting: { name: 'errorSubmitting', render: this._renderErrorSubmittingView.bind(this) },
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
		this._updateButtonDisabled();
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
		await this.hmInterface.optOut();
	}

	get responseObject() {
		let result =
			this._getInnerFeedbackComponents()
				.map(x => x.serialize())
				.reduce((prev, cur) => Object.assign(prev, cur));

		const additionalFields  = this.additionalFields || {};
		result = Object.assign({ feedbackVersion: this.feedbackVersion || 1 }, additionalFields, result);

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
					${this.localize('close')}
				</d2l-button>
			</div>
		</div>`;
	}

	_renderPIESuggestionForEnglishOnly() {
		// PIE is in English only so don't translate it
		if (this.__language && this.__language.indexOf('en') === 0) {
			return html`
			<div class="user-feedback-submitted-text">
				You can also share ideas that would make our product even better on our
				<a href="https://community.brightspace.com/s/article/Product-Idea-Exchange-Overview" target="_top">
					Product Idea Exchange
				</a>
			</div>`;
		}
		return '';
	}

	_renderFeedbackSubmittedView() {
		return html`<div class="user-feedback-submitted-container">
			<d2l-icon class="user-feedback-submitted-icon" icon="tier3:check-circle"></d2l-icon>
			<h1 class="user-feedback-submitted-title">${this.localize('submittedTitle')}</h1>
			${this._renderPIESuggestionForEnglishOnly()}
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
