# Typescript to ES5 Template

## Introduction

This template provides a simple starter for transpiling modern ES6+ Typescript to browser compatible ES5 JavaScript. 

It includes the following features:

- Linting with the `ts-standard` plugin
- Testing with `mocha` and `chai`
- Bundling to ES5 via webpack

## Installation

Run `npm install` to install depedencies.

## Development

In order to use the project use `src/index.ts` as your entry file. To make your code testable - you should keep `src/index.ts` as small as possible and store other functionality outside this file which you export/import as needed. This will allow you to import these functions for use in unit testing.

## Testing

This project comes pre-configured with `mocha` and `chai` although feel free to add whatever you'd like alongside this - all tests should go in the `tests` folder at the root of the project.

You can run tests with `npm run test`

## Linting

You can lint the project by running `npm run lint` and you can lint plus automatically fix any issues by running `npm run lint:fix`

We recommend that you install a `ts-standard` compatible plugin to your IDE. Our recommendation is VS Code - where you can find a StandardJS plugin in the plugin library. If you install that plugin and then the below to your VS Code `settings.json` you will automatically get warnings and errors whilst typing.

## Building

When you're ready to transpile the project, use the `npm run build` command. This will output an ES5 bundle of the TypeScript into the `dist` folder. You can then rename this and add it to the relevant place in our CDN or serve it directly via your app if appropriate.

**NB:** You can rename the output file from `bundle.js` by updating `output.filename` in `webpack.config.js` 
