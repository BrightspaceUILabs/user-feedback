import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/button/button-subtle';
import '@brightspace-ui/core/components/icons/icon';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getComposedChildren } from '@brightspace-ui/core/helpers/dom';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class UserFeedbackContainer extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			prompt: { type: String },
			_buttonDisabled: { type: Boolean },
			_submitted: { type: Boolean }
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
				'submittedText': 'You can also share ideas that would make our product even better on our Product Idea Exchange'
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

	_onSubmit() {
		this._craftResponseObject();
		this._dispatchSubmitEvent();
		this._submitted = true;
	}

	_onCancel() {
		this._dispatchCancelEvent();
	}

	_onReject() {
		this._dispatchRejectEvent();
	}

	_craftResponseObject() {
		console.log(this._getInnerFeedbackComponents().map(x => x.serialize()));
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

	_renderFeedbackSubmittedView() {
		return html`<div class="user-feedback-submitted-container">
			<d2l-icon class="user-feedback-submitted-icon" icon="tier3:check-circle"></d2l-icon>
			<h1 class="user-feedback-submitted-title">${this.localize('submittedTitle')}</h1>
			<div class="user-feedback-submitted-text">${this.localize('submittedText')}</div>
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
		return this._submitted ? this._renderFeedbackSubmittedView() : this._renderFeedbackView();
	}
}
customElements.define('d2l-labs-user-feedback-container', UserFeedbackContainer);
