import '@brightspace-ui/core/components/button/button';
import '@brightspace-ui/core/components/dialog/dialog';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getComposedChildren } from '@brightspace-ui/core/helpers/dom';
import { langResources } from './lang';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class UserFeedbackLauncher extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			prompt: { type: String },
			dialogtitle: { type: String },
			hide: { type: Boolean, value: false },
			_restricted: { type: Boolean },
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

			d2l-dialog {
				max-width: 100%;
				width: 30rem;
				position: absolute;
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
		this._restricted = true;
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
		this._clear();
	}

	_onReject() {
		this._toggleDialog(false);
		this.hide = true;
	}

	_onSubmit() {
		this.hide = true;
	}

	_filterFeedbackContainer(childrenArray) {
		const container = (childrenArray.filter(tag => {
			return tag.nodeName === 'D2L-LABS-USER-FEEDBACK-CONTAINER';
		}) || [])[0];
		return container;
	}

	_getChildrenFromSlot(elem) {
		if (!elem) { return []; }
		return getComposedChildren(elem.querySelector('d2l-dialog slot'));
	}

	_clear() {
		const childrenArray = this._getChildrenFromSlot(this.shadowRoot);
		let container = this._filterFeedbackContainer(childrenArray);

		if (!container) {
			const toCheckForNested = childrenArray[0];
			const nestedChildrenArray = getComposedChildren(toCheckForNested);
			container = this._filterFeedbackContainer(nestedChildrenArray);
		}

		if (container && container.clear) {
			container.clear();
		}
	}

	_notRestrictedByOptOutOrRecentFeedback() {
		this._restricted = false;
	}

	render() {
		const button = this.hide || this._restricted ? '' : html`
			<d2l-button
				@click="${this._onClick}"
				class="feedback-launcher"
				primary
			>
				<slot></slot>
			</d2l-button>`;

		return html`
			${button}
			<d2l-dialog
				width="700"
				title-text="${this.dialogtitle || this.localize('defaultTitle')}"
				@d2l-labs-user-feedback-container-cancel="${this._onCancel}"
				@d2l-labs-user-feedback-container-reject="${this._onReject}"
				@d2l-labs-user-feedback-container-submit="${this._onSubmit}"
				@d2l-labs-user-feedback-show-button="${this._notRestrictedByOptOutOrRecentFeedback}"
			>
				<slot name="dialog-content"></slot>
			</d2l-dialog>
		`;
	}
}
customElements.define('d2l-labs-user-feedback-launcher', UserFeedbackLauncher);
