# Edogawa

Browser utility library to report uncaught errors of your app in the DOM with the help of exeption, event trails and user browser reports object. See an example of a report object below.

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

#### Initialize an Edogawa instance in your client entry code (or wherever you prefer)

```js
import { init } from '../src';

/* voila, you're done.
No further steps are needed.
The library will now listen to uncaught errors
and send the report to the given endpoint */
init({ endpoint = 'https://yourapp.com' });
```

#### Edogawa init API

Edogawa accepts parameters that could be helpful for your debugging

```js
init = (
  /* See Config object below */
  config: Config,
  /* for your custom client side callback */
  exceptionCallback?: (report: Report) => void,
  /* See DevConfig object below */
  devConfig?: DevConfig,
) => void;

// Config Object accepted in init
interface Config {
  /* Your server endpoint that accepts an Edogawa report.
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

#### Edogawa Report object

Edogawa returns a `Report` object when an exception is caught. The structure is:

```js
export type Report = {
  exception: {
    name?: string,
    stackTrace?: string,
    message?: string,
    source?: string,
    lineno?: number,
    colno?: number
  },
  userInfo?: UserInfo,
  /* See EventTrail object structure below */
  trail?: EventTrail[]
};

/* Taken from Parsed result of Bowser( https://github.com/lancedikson/bowser)*/
interface UserInfo {
  userInfo: {
    browser: { name: 'Chrome', version: '80.0.3987.149' },
    os: { name: 'macOS', version: '10.14.5', versionName: 'Mojave' },
    platform: { type: 'desktop', vendor: 'Apple' },
    engine: { name: 'Blink' }
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
    colno: 9
  },
  // user info (obv.)
  userInfo: {
    browser: { name: 'Chrome', version: '80.0.3987.149' },
    os: { name: 'macOS', version: '10.14.5', versionName: 'Mojave' },
    platform: { type: 'desktop', vendor: 'Apple' },
    engine: { name: 'Blink' }
  },
  // the events that happened before the exception
  trail: [
    {
      id: 'id-button-2',
      class: 'class-button-2',
      tag: 'BUTTON',
      type: 'click',
      partialInnerText: 'Click to throw an error'
    }
  ]
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
