const URL_VALIDATOR = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;

export const isValidUrl = (url: string) => URL_VALIDATOR.test(url);
