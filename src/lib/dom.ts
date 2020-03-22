export const SCRIPT_ERROR_MESSAGE =
  'Script Error: See Browser Console for Detail. This happens when an error occurs in a script, loaded from a different origin, the details of the error are not reported to prevent leaking information';

// to isolate script errors
//When an error occurs in a script, loaded from a different origin, the details of the error are not reported to prevent leaking information
//the error detail is only viewable in the browser console and not accessible via JavaScript.
export const isSriptError = (msg: string) => msg.toLowerCase().indexOf('script error') > -1;
