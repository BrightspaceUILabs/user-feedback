import './user-feedback-scale-item';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ArrowKeysMixin } from '@brightspace-ui/core/mixins/arrow-keys-mixin';
import { getComposedChildren } from '@brightspace-ui/core/helpers/dom';

const keyCodes = Object.freeze({
	TAB: 9
});

class UserFeedbackScale extends ArrowKeysMixin(LitElement) {

	static get properties() {
		return {
			selectedValue: { type: String },
			selectedIndex: { type: Number },
			selectedText: { type: Number },
			numoptions: { type: Number },
			_selectorTabIndex: { type: Number },
			prompt: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				z-index: 0;
				max-width: 100%;
				width: 100%;
				padding-bottom: 1rem;
			}

			:host([hidden]) {
				display: none;
			}

			label {
				z-index: 1;
			}

			.arrow-keys-container {
				display: flex;
				width: 100%;
				max-width: 100%;
				justify-content: space-between;
				position: relative;
			}

			.radio-container {
				padding-top: 1rem;
			}

			.back-line {
				height: 2px;
				width: 100%;
				background: var(--d2l-color-galena);
				display: block;
				position: absolute;
				top: 13.5px;
				right: 0;
			}

			::slotted(d2l-labs-user-feedback-scale-item),
			::slotted(d2l-labs-user-feedback-scale-item) {
				--user-feedback-scale-item-bg-spacer-display: none;
			}

			:host(:dir(rtl)) ::slotted(d2l-labs-user-feedback-scale-item:first-of-type) {
				--user-feedback-scale-item-bg-spacer-right: 0;
				--user-feedback-scale-item-bg-spacer-left: auto;
			}

			:host-context([dir="rtl"]) ::slotted(d2l-labs-user-feedback-scale-item:first-of-type) {
				--user-feedback-scale-item-bg-spacer-right: 0;
				--user-feedback-scale-item-bg-spacer-left: auto;
			}

			::slotted(d2l-labs-user-feedback-scale-item:first-of-type),
			::slotted(d2l-labs-user-feedback-scale-item:last-of-type) {
				--user-feedback-scale-item-bg-spacer-display: block;
			}

			::slotted(d2l-labs-user-feedback-scale-item:first-of-type) {
				--user-feedback-scale-item-bg-spacer-left: 0;
			}

			::slotted(d2l-labs-user-feedback-scale-item:last-of-type) {
				--user-feedback-scale-item-bg-spacer-right: 0;
			}

			:host-context([dir="rtl"]) ::slotted(d2l-labs-user-feedback-scale-item:last-of-type) {
				--user-feedback-scale-item-bg-spacer-left: 0;
				--user-feedback-scale-item-bg-spacer-right: auto;
			}

			:host(:dir(rtl)) ::slotted(d2l-labs-user-feedback-scale-item:last-of-type) {
				--user-feedback-scale-item-bg-spacer-left: 0;
				--user-feedback-scale-item-bg-spacer-right: auto;
			}

			input:checked {
				background: blue;
			}

			@media screen and (max-width: 767px) {
				.back-line {
					display: none;
				}

				.arrow-keys-container {
					flex-direction: column;
					align-items: flex-start;
				}
			}
		`;
	}

	constructor() {
		super();
		this._selectorTabIndex = 0;
		this._evaluateIsMobile = this._evaluateIsMobile.bind(this);
		this._evaluateIsMobile();
		window.addEventListener('resize', this._evaluateIsMobile); // TODO: remove at EOL
	}

	async arrowKeysFocusablesProvider() {
		return this._buttons;
	}

	_selectionChanged(e) {
		this._updateButtonSelectedAttribute(e.target.index);
		this.selectedIndex = e.target.index;
		this.selectedValue = e.target.value;
		this.selectedText = e.target.textContent.trim();
		this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-scale-change', { bubbles: true, composed: false, detail: { selectedtextprompt: e.target.selectedtextprompt } }));
	}

	_evaluateIsMobile() {
		const isMobile = window.innerWidth < 768;
		this.arrowKeysDirection = isMobile ? 'updown' : 'leftright';
	}

	_onKeyDown(e) {
		if (e.keyCode === keyCodes.TAB) {
			this._selectorTabIndex = -1;
		}
	}

	_onFocus(e) {
		if (e.srcElement.className !== 'radio-container') {
			return;
		}

		if (this._buttons) {
			this._buttons[this.selectedIndex || 0].focus();
		}
	}

	_onBlur() {
		setTimeout(() => { this._selectorTabIndex = 0; });
	}

	_slotChange() {
		this._handleDomChanges();
	}

	_getListOfAllButtons() {
		const childrenArray = getComposedChildren(this.shadowRoot.querySelector('slot'));
		this._buttons = childrenArray.filter((tag) => {
			return tag.nodeName === 'D2L-LABS-USER-FEEDBACK-SCALE-ITEM';
		}) || [];
		this.numoptions = this._buttons.length;
	}

	_setButtonProperties() {
		if (!this._buttons) {
			return;
		}

		for (let i = 0; i < this._buttons.length; i++) {
			const button = this._buttons[i];
			button.setAttribute('index', i);
		}
	}

	_updateButtonSelectedAttribute(selectedIndex) {
		if (!this._buttons) {
			return;
		}

		if (selectedIndex === undefined) {
			const selected = this._buttons.filter((button) => {
				return button.hasAttribute('checked');
			});
			if (selected.length > 0) {
				this.selectedIndex = selected[0].index;
				this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-scale-change', { bubbles: true, composed: false, detail: { selectedtextprompt: selected[0].selectedtextprompt } }));
				return;
			}
		}

		this._updateButtonsCheckedAttribute(selectedIndex);
	}

	_updateButtonsCheckedAttribute(selectedIndex) {
		for (let i = 0; i < this._buttons.length; i++) {
			this._toggleCheckedAttribute(this._buttons[i], i === selectedIndex);
		}
	}

	_toggleCheckedAttribute(button, checked) {
		button.toggleAttribute('checked', checked);
		button.setAttribute('aria-checked', checked.toString());
	}

	_handleDomChanges() {
		this._getListOfAllButtons();
		this._setButtonProperties();
		this._updateButtonSelectedAttribute();
	}

	serialize() {
		return {
			selectionPrompt: this.prompt,
			selection: this.selectedValue,
			selectedIndex: this.selectedIndex,
			selectedText: this.selectedText,
		};
	}

	hasAnyContent() {
		return !!this.selectedText;
	}

	clear() {
		this.selectedIndex = undefined;
		this.selectedValue = undefined;
		this.selectedText = undefined;
		this._updateButtonsCheckedAttribute(-1);
	}

	render() {
		const inner = html`
			<div class="back-line"></div>
			<slot></slot>`;

		const prompt = this.prompt ? html`<div>${this.prompt}</div>` : '';

		return html`
			${prompt}
			<div
				class="radio-container"
				role="radiogroup"
				tabindex="${this._selectorTabIndex}"
				@change="${this._selectionChanged}"
				@focus="${this._onFocus}"
				@blur="${this._onBlur}"
				@slotchange="${this._slotChange}"
				@keydown="${this._onKeyDown}"
			>
				${this.arrowKeysContainer(inner)}
			</div>
		`;
	}
}
customElements.define('d2l-labs-user-feedback-scale', UserFeedbackScale);
