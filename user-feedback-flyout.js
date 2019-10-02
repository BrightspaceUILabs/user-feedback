import { css, html, LitElement } from 'lit-element/lit-element.js';
import {
	getFirstFocusableDescendant,
	getLastFocusableDescendant,
	getNextFocusable,
	getPreviousFocusable,
} from '@brightspace-ui/core/helpers/focus';

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
			buttontext: { type: String, attribute: 'button-text' }
		};
	}

	static get styles() {
		return css`
			:host {
				position: relative;
			}

			.d2l-labs-user-feedback-flyout-container {
				width: 100vw;
				border-top: solid var(--d2l-color-celestine) 2px;
				bottom: var(--d2l-labs-user-feedback-bottom, 0);
				background: var(--d2l-color-regolith);
				display: block;
				max-height: 0;
				transition: max-height 0.5s;
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
				height: var(--d2l-labs-user-feedback-flyout-height, auto);
				max-height: 30rem;
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
	}

	focus() {
		this.shadowRoot.querySelector('input').focus();
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
		this.toggleAttribute('opened', true);
	}

	_toggleOff() {
		if (this.stopscroll) {
			document.body.style.overflow = 'auto';
		}
		this.toggleAttribute('opened', false);
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

	_onCancel() {
		this._toggleOff();
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

	_focusFirst() {
		getNextFocusable(getFirstFocusableDescendant(this.shadowRoot)).focus();
	}

	_focusLast() {
		getPreviousFocusable(getLastFocusableDescendant(this.shadowRoot)).focus();
	}

	_onShimClick() {
		this._toggleOff();
	}

	render() {
		if (this.hide || this.hideafterclose && !this.opened) {
			return html`<span></span>`;
		}

		const direction = this.opened ? 'down' : 'up';

		const button = this.hide ? '' :
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
			<div @keydown="${this._onKeyDown}">
				<div
					class="d2l-labs-user-feedback-flyout-first-focusable"
					tabindex="0"
					@focusin="${this._focusLast}"
				></div>
				${button}
				<div class="d2l-labs-user-feedback-flyout-container">
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
				<div class="flyout-shim" @click=${this._onShimClick}></div>
			</div>
		`;
	}

}
customElements.define('d2l-labs-user-feedback-flyout', UserFeedbackScaleItem);
