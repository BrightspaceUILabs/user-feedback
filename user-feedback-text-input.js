import 'd2l-inputs/d2l-input-textarea';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getComposedChildren } from '@brightspace-ui/core/helpers/dom';

class UserFeedbackTextInput extends LitElement {

	static get properties() {
		return {
			defaultlabeltext: { type: String },
			overridelabeltext: { type: String }, // for connecting to the scale element
			serializePrefix: { type: String },
			value: { type: String }
		};
	}

	static get styles() {
		return css`
			:host([hidden]) {
				display: none;
			}

			d2l-input-textarea {
				width: 100%;
				margin-top: 0.25rem;
			}
		`;
	}

	_onChange(e) {
		this.value = e.target.value;
		this._dispatchChangeEvent();
	}

	_onScaleChange(e) {
		if (e.detail.selectedtextprompt) {
			this.overridelabeltext = e.detail.selectedtextprompt;
		}
		this._dispatchChangeEvent();
		e.stopPropagation();
	}

	_dispatchChangeEvent() {
		this.dispatchEvent(new CustomEvent('d2l-labs-user-feedback-text-input-change', { bubbles: true, composed: false }));
	}

	_getInnerFeedbackScale() {
		const childrenArray = getComposedChildren(this.shadowRoot.querySelector('slot'));

		const scale = (childrenArray.filter((tag) => {
			return tag.nodeName === 'D2L-LABS-USER-FEEDBACK-SCALE';
		}) || [])[0];

		return scale;
	}

	serialize() {
		const prefix = this.serializePrefix || '';

		const serializedValue = {
			[`${prefix}textField`]: this.overridelabeltext || this.defaultlabeltext,
			[`${prefix}textFieldUserInput`]: this.value,
		};

		const scale = this._getInnerFeedbackScale();
		if (scale) {
			Object.assign(serializedValue, scale.serialize());
		}

		return serializedValue;
	}

	hasAnyContent() {
		if (this.value) {
			return true;
		}
		const scale = this._getInnerFeedbackScale();
		if (scale) {
			return scale.hasAnyContent();
		}

		return false;
	}

	clear() {
		this.value = '';
		const textArea = this.shadowRoot.querySelector('d2l-input-textarea');
		textArea.value = '';
		const scale = this._getInnerFeedbackScale();
		if (scale) {
			return scale.clear();
		}
	}

	render() {
		return html`
			<slot
				@d2l-labs-user-feedback-scale-change="${this._onScaleChange}"
				@d2l-labs-user-feedback-scale-init="${this._onScaleChange}"
			></slot>
			<label>
				${ this.overridelabeltext || this.defaultlabeltext }
				<d2l-input-textarea
					rows="3"
					@change="${this._onChange}"
					@keyup="${this._onChange}"
				></d2l-input-textarea>
			</label>
		`;
	}
}
customElements.define('d2l-labs-user-feedback-text-input', UserFeedbackTextInput);
