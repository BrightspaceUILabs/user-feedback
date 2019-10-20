import './user-feedback-scale.js';
import './user-feedback-scale-item.js';
import './user-feedback-text-input.js';
import './user-feedback-container.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';

class UserFeedbackDifficultyDialog extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			prompt: { type: String }
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

	_tempGetToken() {
		return Promise.resolve('Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjliMTg5ZWJhLWZmNjYtNDM1ZC04OTViLWNjOWI3ZDc3ODUyZCJ9.eyJpc3MiOiJodHRwczovL2FwaS5icmlnaHRzcGFjZS5jb20vYXV0aCIsImF1ZCI6Imh0dHBzOi8vYXBpLmJyaWdodHNwYWNlLmNvbS9hdXRoL3Rva2VuIiwiZXhwIjoxNTcxNDUyNzE1LCJuYmYiOjE1NzE0NDkxMTUsInN1YiI6IjE2OSIsInRlbmFudGlkIjoiOTlkNmM4OGYtM2Y5ZS00NWU2LWI4MDQtOTg4YjFmNjhlNDYzIiwiYXpwIjoibG1zOjk5ZDZjODhmLTNmOWUtNDVlNi1iODA0LTk4OGIxZjY4ZTQ2MyIsInNjb3BlIjoiKjoqOioiLCJqdGkiOiI5ZmJhYjIyMS1hMDg3LTRlYTItOGRiNy1jYmU3MGUzNzA2YmQifQ.IzYgfbrQPyQyObPCOh9sqMLc4dnh3BRTGazYKi31k1JzsVl-ccMkTeLohXoAjodekXiXp7yzeyZYK4R0ArAMiSYh4h7Drz0bY5z-RmOPSKmbJ79fFEAnK3qP8thPaoAOb8KX-D63wpHefU6LtISv5tcZotlkJFEC51kOVdZ72YZBXfuTvML72ELDo8RBou5pTsetl0B7z7t2yU9CKg0y4-l9vj3iKZTgrqAnLFdbPiIIeGo9y4UrPsFufQXlzwd6_W9YP9yjhWD5FIH9FKDVIX-Jv7rI9kZxYBhxm2SdUKxT5evHhIJTmJiJKCJPGxXyuj0USNezA05KdeyUNM03WA  ');
	}

	render() {
		return html`
			<d2l-labs-user-feedback-container
				feedback-application="portfolio"
				feedback-type="portfolio-instructor-approval"
				feedback-version="1"
				feedback-href="https://99d6c88f-3f9e-45e6-b804-988b1f68e463.feedback.api.dev.brightspace.com"
				getToken="${this._tempGetToken}"
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
