import '@brightspace-ui/core/components/backdrop/backdrop';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import {
	getFirstFocusableDescendant,
	getLastFocusableDescendant,
	getNextFocusable,
	getPreviousFocusable,
} from '@brightspace-ui/core/helpers/focus';
import { getComposedChildren } from '@brightspace-ui/core/helpers/dom';

const keyCodes = Object.freeze({
	ESC: 27
});

class UserFeedbackScaleItem extends LitElement {
	static get properties() {
		return {
			opened: { type: Boolean },
			hide: { type: Boolean },
			hideafterclose: { type: Boolean },
			stopscroll: { type: Boolean },
			buttontext: { type: String, attribute: 'button-text' },
			_restricted: { type: Boolean, attribute: false }
		};
	}

	static get styles() {
		return css`
			:host {
				position: relative;
			}

			.d2l-labs-user-feedback-flyout-container {
				width: 100vw;
				bottom: var(--d2l-labs-user-feedback-bottom, 0);
				border-top: solid transparent 0;
				background: var(--d2l-color-regolith);
				display: block;
				max-height: 0;
				transition: max-height 0.5s, border-top 0s linear 0.5s;
				overflow: hidden;
				--user-feedback-scale-item-bg-spacer-background: var(--d2l-color-regolith);
				z-index: 1000;
				position: relative;
			}

			:host([opened]) .flyout-shim {
				width: 100vw;
				height: 100vh;
				position: fixed;
				background-color: transparent;
				z-index: 999;
				top: 0;
				right: 0;
			}

			:host([opened]) .d2l-labs-user-feedback-flyout-container {
				border-top: solid var(--d2l-color-celestine) 2px;
				height: var(--d2l-labs-user-feedback-flyout-height, auto);
				max-height: 30rem;
				transition: max-height 0.5s;
			}

			.d2l-labs-user-feedback-flyout-content {
				max-width: var(--d2l-labs-user-feedback-flyout-max-width, 800px);
				padding: 1rem;
				margin-left: auto;
				margin-right: auto;
			}

			.d2l-labs-user-feedback-flyout-launch-button-container {
				height: 0;
				position: relative;
				width: 100%;
			}

			.d2l-labs-user-feedback-flyout-launch-button {
				width: 10rem;
				min-height: 3rem;
				color: #FFF;
				background-color: var(--d2l-color-celestine);
				padding: 0.3rem 0.6rem 0.6rem 0.6rem;
				cursor: pointer;
				border: none;
				border-radius: 1rem;
				border-top-left-radius: 12px;
				border-top-right-radius: 12px;
				border-bottom-left-radius: 0;
				border-bottom-right-radius: 0;
				z-index: 1000;
				position: absolute;
				right: 3rem;
				bottom: 0;
			}

			:host(:dir(rtl)) .d2l-labs-user-feedback-flyout-launch-button {
				left: 3rem;
				right: auto;
			}

			:host-context([dir="rtl"]) .d2l-labs-user-feedback-flyout-launch-button {
				left: 3rem;
				right: auto;
			}

			.d2l-labs-user-feedback-flyout-launch-button:focus,
			.d2l-labs-user-feedback-flyout-launch-button:hover {
				background-color: var(--d2l-color-celestine-minus-1)
			}

			.d2l-labs-user-feedback-flyout-launch-button > d2l-icon {
				color: #FFF;
				margin-right: auto;
				margin-left: auto;
				display: block;
				padding-bottom: 0.2rem;
			}

			.d2l-labs-user-feedback-flyout-container > button > d2l-icon {
				color: #000;
			}

			:host(:dir(rtl)) .d2l-labs-user-feedback-flyout-container > button {
				right: auto;
				left: 0;
			}

			:host-context([dir="rtl"]) .d2l-labs-user-feedback-flyout-container > button {
				right: auto;
				left: 0;
			}

			.d2l-labs-user-feedback-flyout-container > button {
				background: none;
				display: inline-block;
				border: none;
				right: 0;
				position: absolute;
			}
		`;
	}

	constructor() {
		super();
		this.opened = false;
		this._restricted = true;
	}

	focus() {
		this.shadowRoot.querySelector('.d2l-labs-user-feedback-scale-item-radio').focus();
	}

	_handleFocus() {
		this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: false }));
	}

	_handleBlur() {
		this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: false }));
	}

	_toggleOn() {
		if (this.stopscroll) {
			document.body.style.overflow = 'hidden';
		}
		this.setAttribute('opened', '');
	}

	_toggleOff() {
		if (this.stopscroll) {
			document.body.style.overflow = 'auto';
		}
		this.removeAttribute('opened');
		if (this.hide || this.hideafterclose) {
			const toFocus = getFirstFocusableDescendant(document.body);
			if (toFocus) {
				toFocus.focus();
			}
		} else {
			this.shadowRoot.querySelector('.d2l-labs-user-feedback-flyout-launch-button').focus();
		}
	}

	_onButtonClick() {
		if (this.opened) {
			this._toggleOff();
		} else {
			this._toggleOn();
		}
	}

	_filterFeedbackContainer(childrenArray) {
		const container = (childrenArray.filter(tag => {
			return tag.nodeName === 'D2L-LABS-USER-FEEDBACK-CONTAINER';
		}) || [])[0];
		return container;
	}

	_getChildrenFromSlot(elem) {
		if (!elem) { return []; }
		return getComposedChildren(elem.querySelector('slot'));
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

	_onCancel() {
		this._toggleOff();
		this._clear();
	}

	_onReject() {
		this.hide = true;
		this._toggleOff();
	}

	_onSubmit() {
		this.hideafterclose = true;
	}

	_onKeyDown(e) {
		if (e.keyCode === keyCodes.ESC) {
			this._toggleOff();
		}
	}

	_notRestrictedByOptOutOrRecentFeedback() {
		this._restricted = false;
	}

	_focusFirst() {
		getNextFocusable(getFirstFocusableDescendant(this.shadowRoot)).focus();
	}

	_focusLast() {
		getPreviousFocusable(getLastFocusableDescendant(this.shadowRoot)).focus();
	}

	render() {
		if (this.hide || this.hideafterclose && !this.opened) {
			return html`<span></span>`;
		}

		const direction = this.opened ? 'down' : 'up';

		const button = this.hide || this._restricted ? '' :
			html`<div class="d2l-labs-user-feedback-flyout-launch-button-container">
				<button
					class="d2l-labs-user-feedback-flyout-launch-button d2l-body-compact"
					@click="${this._onButtonClick}"
				>
					<d2l-icon icon="tier1:chevron-${direction}"></d2l-icon>
					${this.buttontext}
				</button>
			</div>`;

		return html`
			<div
				@keydown="${this._onKeyDown}"
				@d2l-labs-user-feedback-show-button="${this._notRestrictedByOptOutOrRecentFeedback}"
			>
				<div
					class="d2l-labs-user-feedback-flyout-first-focusable"
					tabindex="0"
					@focusin="${this._focusLast}"
				></div>
				${button}
				<div class="d2l-labs-user-feedback-flyout-container" id="d2l-labs-user-feedback-flyout-container">
					<div class="d2l-labs-user-feedback-flyout-content"
						@d2l-labs-user-feedback-container-cancel="${this._onCancel}"
						@d2l-labs-user-feedback-container-reject="${this._onReject}"
						@d2l-labs-user-feedback-container-submit="${this._onSubmit}"
					>
						<slot></slot>
						<span
							tabindex="0"
							class="d2l-labs-user-feedback-flyout-last-focusable"
							@focusin="${this._focusFirst}"
						></span>
					</div>
				</div>
				<d2l-backdrop ?shown=${this.opened} for-target="d2l-labs-user-feedback-flyout-container"></d2l-backdrop>
			</div>
		`;
	}

}
customElements.define('d2l-labs-user-feedback-flyout', UserFeedbackScaleItem);
