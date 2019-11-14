import '@brightspace-ui/core/components/dialog/dialog';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { langResources } from './lang';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class UserFeedbackLauncher extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			prompt: { type: String },
			dialogtitle: { type: String },
			hide: { type: Boolean, value: false }
		};
	}

	static get styles() {
		return css`
			:host([hidden]) {
				display: none;
			}

			:host {
				position: relative;
			}

			.feedback-launcher {
				width: 10rem;
				min-height: 3rem;
				color: #FFF;
				background-color: var(--d2l-color-celestine);
				padding: 0.5rem 1rem;
				cursor: pointer;
				border: none;
				border-radius: 1rem;
			}

			:host([type=bottom]) .feedback-launcher {
				border-top-left-radius: 12px;
				border-top-right-radius: 12px;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
			}

			:host([type=top]) .feedback-launcher {
				border-bottom-left-radius: 12px;
				border-bottom-right-radius: 12px;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}

			d2l-dialog {
				max-width: 100%;
				width: 30rem;
				position: absolute;
			}

			.feedback-launcher:hover,
			.feedback-launcher:focus {
				background-color: var(--d2l-color-celestine-minus-1);
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

	_toggleDialog(toggle) {
		const dialog = this.shadowRoot.querySelector('d2l-dialog');
		if (dialog) {
			dialog.opened = toggle;
		}
	}

	_onClick() {
		this._toggleDialog(true);
	}

	_onCancel() {
		this._toggleDialog(false);
	}

	_onReject() {
		this._toggleDialog(false);
		this.hide = true;
	}

	_onSubmit() {
		this.hide = true;
	}

	render() {
		const button = this.hide ? '' : html`
			<button @click="${this._onClick}" class="feedback-launcher">
				<slot></slot>
			</button>`;

		return html`
			${button}
			<d2l-dialog
				width="700"
				title-text="${this.dialogtitle || this.localize('defaultTitle')}"
				@d2l-labs-user-feedback-container-cancel="${this._onCancel}"
				@d2l-labs-user-feedback-container-reject="${this._onReject}"
				@d2l-labs-user-feedback-container-submit="${this._onSubmit}"
			>
				<slot name="dialog-content"></slot>
			</d2l-dialog>
		`;
	}
}
customElements.define('d2l-labs-user-feedback-launcher', UserFeedbackLauncher);
