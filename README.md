# d2l-labs-user-feedback

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui-labs/user-feedback.svg)](https://www.npmjs.org/package/@brightspace-ui-labs/user-feedback)
![Build status](https://github.com/BrightspaceUILabs/user-feedback/workflows/CI/badge.svg)

> Note: this is a ["labs" component](https://github.com/BrightspaceUI/guide/wiki/Component-Tiers). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [ ] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture)
> - [ ] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [ ] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#cross-browser-testing-with-sauce-labs)
> - [ ] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [ ] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [ ] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [ ] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [x] Demo page
> - [ ] README documentation

Elements for acquiring user feedback on our products

## Installation

To install from NPM:

```shell
npm install @brightspace-ui-labs/user-feedback
```

## Localization

This repo uses [Serge](https://docs.dev.d2l/index.php/Serge-Localize) for localization. On any changes to langterm data files (eg. due to adding new lang terms, or merging an automated PR that provides updated translations), you must run
```
npm run localize
```
to generate new modules with the updated data.

## Usage

### d2l-labs-user-feedback-container
The wrapper for your feedback elements, this adds submit, cancel, and opt-out buttons and also handles the different states after the user submits.

#### Attributes
- `feedback-version`: Starts at 1, increment this each time you change the feedback interior for versioning
- `feedback-application`: The name of the application you want to provide feedback for, must be set up as an lms plugin
- `feedback-type`: The type of the feedback you want to provide for the application, must be set up as an lms plugin
- `feedback-href`: The root of the feedback hm domain
- `token`: A token to use for the api calls
- `additional-fields`: An object containing any other key/value pairs you would like to add to the feedback payload

```html
	<d2l-labs-user-feedback-container prompt="Container Prompt"
		feedback-version="1"
		feedback-application="name-of-application"
		feedback-type="type-of-feedback"
		feedback-href="href-of-feedback-hm-domain-root"
		token="token"
	>
		<!-- slotted d2l-labs-user-feedback-text-input and d2l-labs-user-feedback-scale elements -->
	</d2l-labs-user-feedback-container>
```

### d2l-labs-user-feedback-scale
A component where a user can select from a group of items on how they feel about something.

#### Attributes
- `prompt`: The text prompt to list above the scale
- `serializeprefix`: A prefix to prepend to the values when serializing

When the container submits, the scale will add these properties to the submitted post request
```
[serializeprefix]prompt
[serializeprefix]scaleValue
[serializeprefix]scaleOutOfValue
[serializeprefix]scaleText
```

```html
<d2l-labs-user-feedback-scale prompt="How do you like using our product?">
	<!-- slotted scale items -->
</d2l-labs-user-feedback-scale>
```

### d2l-labs-user-feedback-text-input

#### Attributes
- `defaultlabeltext`: the default prompt for the text

```html
<d2l-labs-user-feedback-text-input defaultlabeltext="Type something here"></d2l-labs-user-feedback-text-input>
```

#### Slotting in a feedback scale

This will cause a feedback scale to render on top of the text input, when the user selects an item, the item's `selectedtextprompt` value will be used as the prompt for the text input.

```html
<d2l-labs-user-feedback-text-input defaultlabeltext="Type something here">
	<d2l-labs-user-feedback-scale prompt="How do you like using our product?">
		<d2l-labs-user-feedback-scale-item value="1" selectedtextprompt="Why don't you like it?">I don't like it</d2l-labs-user-feedback-scale-item>
		<d2l-labs-user-feedback-scale-item value="2" selectedtextprompt="What could be better?">It's alright</d2l-labs-user-feedback-scale-item>
		<d2l-labs-user-feedback-scale-item value="3" selectedtextprompt="Why do you like it?">It's good</d2l-labs-user-feedback-scale-item>
	</d2l-labs-user-feedback-scale>
</d2l-labs-user-feedback-text-input>
```

When the container submits, the text-input will add these properties to the submitted post request
```
[serializeprefix]textField
[serializeprefix]textFieldUserInput
(and the serialized result of a nested scale, if any)
```

### d2l-labs-user-feedback-flyout
A component for placing your feedback items in a flyout tray that opens from the bottom of the screen. Will only appear after the container loads the hypermedia entities for submitting to the api, after the user has submitted feedback and closed the flyout, it disappears

```html
<d2l-labs-user-feedback-flyout button-text="launch the feedback component">
	<!-- slotted d2l-labs-user-feedback-container -->
</d2l-labs-user-feedback-flyout>
```

#### Attributes
- `button-text`: the text that you want to place on the button

### d2l-labs-user-feedback-launcher
A component for placing your feedback items in a d2l-dialog that opens when the user clicks the button. Will only appear after the container loads the hypermedia entities for submitting to the api, after the user has submitted feedback and closed the dialog, it disappears

```html
<d2l-labs-user-feedback-launcher
	button-text="launch the feedback component"
>
	<!-- slotted d2l-labs-user-feedback-container -->
</d2l-labs-user-feedback-launcher>
```

#### Attributes
- `button-text`: the text that you want to place on the button
- `dialog-title`: set this to override the default dialog title

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

If you don't have it already, install the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) globally:

```shell
npm install -g polymer-cli
```

### Running the demos

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

### Testing

To lint ([eslint](http://eslint.org/) and [Polymer lint](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#lint)):

```shell
npm run lint
```

To run unit tests locally using [Polymer test](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#tests):

```shell
npm run test:polymer:local
```

To lint AND run local unit tests:

```shell
npm test
```

[ci-url]: https://travis-ci.org/BrightspaceUILabs/user-feedback
[ci-image]: https://travis-ci.org/BrightspaceUILabs/user-feedback.svg?branch=master

### Running the demos

To start a [local web server](https://www.polymer-project.org/3.0/docs/tools/polymer-cli-commands#serve) that hosts the demo page and tests:

```shell
polymer serve
```

### Testing

To lint:

```shell
npm run lint
```

To run local unit tests:

```shell
npm run test:local
```

To run a subset of local unit tests, modify your local [index.html](https://github.com/BrightspaceUILabs/user-feedback/blob/master/test/index.html), or start the dev server and navigate to the desired test page.

To run linting and unit tests:

```shell
npm test
```

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Releases use the [semantic-release](https://semantic-release.gitbook.io/) tooling and the [angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular) for commit message syntax. Upon release, the version in `package.json` is updated, a tag and GitHub release is created and a new package will be deployed to NPM.

Commits prefixed with `feat` will trigger a minor release, while `fix` or `perf` will trigger a patch release. A commit containing `BREAKING CHANGE` will cause a major release to occur.

Other useful prefixes that will not trigger a release: `build`, `ci`, `docs`, `refactor`, `style` and `test`. More details in the [Angular Contribution Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type).
