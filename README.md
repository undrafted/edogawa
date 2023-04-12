# Edogawa

Browser utility library to report uncaught errors in your app in the DOM. The library creates a Report object that contains the exception, event trails and the user browser. See an [example of a report object here](https://github.com/undrafted/edogawa#sample-report-object).

## Installation

#### npm

```
npm install edogawa
```

#### yarn

```
yarn add edogawa
```

## Usage

#### Initialize an instance in your client entry code (or wherever you prefer)

```js
import { createReporter } from 'edogawa';

createReporter({ endpoint: 'https://yourapp.com/reports' });
```

Voila, you're done.
No further steps are needed on the client. The library will now listen to uncaught errors and send the report to the given endpoint.

You can setup your server endpoint as you like - to accept the [report object](https://github.com/undrafted/edogawa#sample-report-object).

### API

#### createReporter

`createReporter` to initialize a reporter instance. It also accepts parameters that could be helpful for your debugging.

```js
createReporter = (
  /* See Config object below */
  config: Config,
  /* for your custom client side callback */
  exceptionCallback?: (report: Report) => void,
  /* See DevConfig object below */
  devConfig?: DevConfig,
) => void;

// Config Object accepted in init
interface Config {
  /* Your server endpoint that accepts an error report.
  See the structure of the report below */
  endpoint: string;

   /* Endpoint rest token, if needed */
  restToken?: string;

  /* maximum size of the trail size array */
  maxTrailSize?: number;

  /* you might want to ignore some common errors that are caused by browser extensions, etc. */
  ignore?: RegExp[];

  additionalInfo?: {
    [key in string]: any;
  };
}

// DevConfig Object accepted in init
export interface DevConfig {
  /* mostly for development,
  this just skips the part of sending a push to the endpoint */
  clientSideDebug?: boolean;
}
```

#### captureException

A `captureException` function is exposed for custom error capturing. Use it after initiazing the reporter object.

```js
import { captureException } from 'edogawa';

try {
  ...
} catch (e){
  captureException(new Error('...'))
}
```

#### destroy

Call `destroy` to delete the instance of the reporter.

#### Report object

A `Report` object is created when an exception is caught. See example generated report [below](https://github.com/undrafted/edogawa#sample-report-object). The structure is:

```js
export type Report = {
  exception: {
    name?: string,
    stackTrace?: string,
    message?: string,
    source?: string,
    lineno?: number,
    colno?: number,
  },
  userInfo?: UserInfo,
  /* See EventTrail object structure below */
  trail?: EventTrail[],
};

/* Taken from Parsed result of Bowser( https://github.com/lancedikson/bowser)*/
interface UserInfo {
  userInfo: {
    browser: { name: string, version: string },
    os: { name: string, version: string, versionName: string },
    platform: { type: string, vendor: string },
    engine: { name: string },
  };
}

/* EventTrail object:
- basically properties of an Element in an event that happened before the exception
- plus the event type */
interface EventTrail {
  tag: string;
  id: string;
  class: string;
  type: string;
  partialInnerText: string;
}
```

#### Sample Report Object

```js
const report: Report = {
  // the uncaught exception (obv.)
  exception: {
    message: 'Uncaught Error: custom error',
    name: 'Error',
    stackTrace:
      'Error: custom error↵    at HTMLButtonElement.<anonymous> (http://yourapp.com/app.77de5100.js)',
    source: 'http://yourapp.com/app.77de5100.js',
    lineno: 468,
    colno: 9,
  },
  // user info (obv.)
  userInfo: {
    browser: { name: 'Chrome', version: '80.0.3987.149' },
    os: { name: 'macOS', version: '10.14.5', versionName: 'Mojave' },
    platform: { type: 'desktop', vendor: 'Apple' },
    engine: { name: 'Blink' },
  },
  // the events that happened before the exception
  trail: [
    {
      id: 'id-button-2',
      class: 'class-button-2',
      tag: 'BUTTON',
      type: 'click',
      partialInnerText: 'Click to throw an error',
    },
  ],
};
```

### Example

See the [example](https://github.com/undrafted/edogawa/tree/master/example). To run it locally, clone this repo. Then:

```
yarn && yarn start
```

### Inspiration

This library is heavily influenced by most error reporting apps available in the market. My aim here is to provide a basic client-side error reporting API that can be used in any logging service you desire.

### License

MIT
