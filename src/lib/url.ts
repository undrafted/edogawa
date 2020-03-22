const URL_VALIDATOR = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

export const isValidUrl = (url: string) => URL_VALIDATOR.test(url);
