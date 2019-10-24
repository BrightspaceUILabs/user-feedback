import './user-feedback-scale.js';
import './user-feedback-scale-item.js';
import './user-feedback-text-input.js';
import './user-feedback-container.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class UserFeedbackDifficultyDialog extends LocalizeMixin(LitElement) {
	static get properties() {
		return {
			prompt: { type: String },
			feedbackVersion: { type: Number, attribute: 'feedback-version' },
			feedbackApplication: { type: String, attribute: 'feedback-application' },
			feedbackType: { type: String, attribute: 'feedback-type' },
			feedbackHref: { type: String, attribute: 'feedback-href' },
			optOutType: { type: String, attribute: 'opt-out-type' },
			token: { type: String },
		};
	}

	static get styles() {
		return css`
			:host([hidden]) {
				display: none;
			}

			d2l-labs-user-feedback-scale {
				padding: 1.5rem 0;
			}
		`;
	}

	static async getLocalizeResources(langs) {
		const langResources = {
			'en': {
				'noSelectionPrompt': 'What would you like us to know?',
				'lvl1ScaleItem': 'Very Difficult',
				'lvl1TextPrompt': 'What can we do better?',
				'lvl2ScaleItem': 'Somewhat Difficult',
				'lvl2TextPrompt': 'What can we do better?',
				'lvl3ScaleItem': 'Neither Easy Nor Difficult',
				'lvl3TextPrompt': 'What would you like us to know?',
				'lvl4ScaleItem': 'Somewhat Easy',
				'lvl4TextPrompt': 'How can we make it even easier?',
				'lvl5ScaleItem': 'Very Easy',
				'lvl5TextPrompt': 'Great! What did you like the most?',

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

	render() {
		return html`
			<d2l-labs-user-feedback-container
				feedback-application="${this.feedbackApplication}"
				feedback-type="${this.feedbackType}"
				feedback-version="${this.feedbackVersion}"
				feedback-href="${this.feedbackHref}"
				.token="${this.token}"
				.opt-out-type="${this.optOutType}"
			>
				<d2l-labs-user-feedback-text-input
					defaultlabeltext="${this.localize('noSelectionPrompt')}"
				>
					<d2l-labs-user-feedback-scale prompt="${this.prompt}">
						<d2l-labs-user-feedback-scale-item
							value="1"
							selectedtextprompt="${this.localize('lvl1TextPrompt')}"
						>
							${this.localize('lvl1ScaleItem')}
						</d2l-labs-user-feedback-scale-item>
						<d2l-labs-user-feedback-scale-item
							value="2"
							selectedtextprompt="${this.localize('lvl2TextPrompt')}"
						>
							${this.localize('lvl2ScaleItem')}
						</d2l-labs-user-feedback-scale-item>
						<d2l-labs-user-feedback-scale-item
							value="3"
							selectedtextprompt="${this.localize('lvl3TextPrompt')}"
						>
							${this.localize('lvl3ScaleItem')}
						</d2l-labs-user-feedback-scale-item>
						<d2l-labs-user-feedback-scale-item
							value="4"
							selectedtextprompt="${this.localize('lvl4TextPrompt')}"
						>
							${this.localize('lvl4ScaleItem')}
						</d2l-labs-user-feedback-scale-item>
						<d2l-labs-user-feedback-scale-item
							value="5"
							selectedtextprompt="${this.localize('lvl5TextPrompt')}"
						>
							${this.localize('lvl5ScaleItem')}
						</d2l-labs-user-feedback-scale-item>
					</d2l-labs-user-feedback-scale>
				</d2l-labs-user-feedback-text-input>
			</d2l-labs-user-feedback-container>
		`;
	}
}
customElements.define('d2l-labs-user-feedback-difficulty-dialog', UserFeedbackDifficultyDialog);
