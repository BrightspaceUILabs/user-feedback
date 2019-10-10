import { css, html, LitElement } from 'lit-element/lit-element.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

class UserFeedbackScaleItem extends LitElement {

	static get properties() {
		return {
			value: { type: String, value: 'on', reflect: true },
			name: { type: String, reflect: true, value: '' },
			checked: { type: Boolean, value: false, reflect: true },
			index: { type: Number, reflect: true },
			mobile: { type: Boolean, reflect: true },
			selectedtextprompt: { type: String }
		};
	}

	static get styles() {
		return css`
			:host([hidden]) {
				display: none;
			}

			:host {
				flex: 1 0 0;
				padding: 0 0.6rem;
				text-align: center;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
				word-break: break-word;
			}

			.d2l-labs-user-feedback-scale-item-bg-spacer {
				height: 25px;
				width: 50%;
				background: var(--user-feedback-scale-item-bg-spacer-background, #FFF);
				content: "";
				display: var(--user-feedback-scale-item-bg-spacer-display, hidden);
				position: absolute;
				top: 0;
				left: var(--user-feedback-scale-item-bg-spacer-left, auto);
				right: var(--user-feedback-scale-item-bg-spacer-right, auto);
			}

			label {
				z-index: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				position: relative;
			}

			.d2l-labs-user-feedback-scale-item-radio {
				-webkit-appearance: none;
				-moz-appearance: none;
				appearance: none;
				height: 1.2rem;
				width: 1.2rem;
				min-width: 1.2rem;
				background-color: #FFF;
				border-radius: 50%;
				border: 3px solid var(--d2l-color-galena);
				position: relative;
				outline: none;
			}

			.d2l-labs-user-feedback-scale-item-radio:focus,
			.d2l-labs-user-feedback-scale-item-radio:hover {
				border-color: var(--d2l-color-celestine);
			}

			.d2l-labs-user-feedback-scale-item-radio[checked] {
				background: radial-gradient(circle, var(--d2l-color-ferrite) 0%, var(--d2l-color-ferrite) 35%, white 41%, white 100%);
			}

			@media screen and (max-width: 767px) {
				.d2l-labs-user-feedback-scale-item-bg-spacer {
					display: none;
				}

				label {
					flex-direction: row;
				}

				.d2l-labs-user-feedback-scale-item-text-area {
					margin: 0.25rem 0.5rem 0 0.5rem;
				}

				:host {
					text-align: initial;
				}
			}
		`;
	}

	render() {
		return html`
			<div class="d2l-labs-user-feedback-scale-item-bg-spacer"></div>
			<label class="d2l-labs-user-feedback-scale-item-radio-element">
				<div
					class="d2l-labs-user-feedback-scale-item-radio"
					.name="${this.name}"
					?checked="${this.checked}"
					.value="${this.value}"
					@click="${this._handleClick}"
					@focus="${this._handleFocus}"
					@blur="${this._handleBlur}"
					@keypress="${this._handleKeyPress}"
					tabindex="-1"
					role="radio"
				></div>
				<div class="d2l-labs-user-feedback-scale-item-text-area">
					<slot></slot>
				</div>
			</label>
		`;
	}

	focus() {
		this.shadowRoot.querySelector('.d2l-labs-user-feedback-scale-item-radio').focus();
	}

	_handleClick(e) {
		this.checked = true;
		this._handleChange();
		e.preventDefault();
		e.stopPropagation();
	}

	_handleChange() {
		this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: false }));
	}

	_handleFocus() {
		this.dispatchEvent(new CustomEvent('focus', { bubbles: true, composed: false }));
	}

	_handleBlur() {
		this.dispatchEvent(new CustomEvent('blur', { bubbles: true, composed: false }));
	}

	_handleKeyPress(e) {
		if (e.keyCode === keyCodes.ENTER || e.keyCode === keyCodes.SPACE) {
			this.checked = true;
			e.preventDefault();
			this._handleChange();
		}
	}
}
customElements.define('d2l-labs-user-feedback-scale-item', UserFeedbackScaleItem);
