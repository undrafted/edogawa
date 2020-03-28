const HEADER = [
  navigator.platform,
  navigator.userAgent,
  navigator.appVersion,
  navigator.vendor,
  window.opera,
];
const DATAOS = [
  { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
  { name: 'Windows', value: 'Win', version: 'NT' },
  { name: 'iPhone', value: 'iPhone', version: 'OS' },
  { name: 'iPad', value: 'iPad', version: 'OS' },
  { name: 'Kindle', value: 'Silk', version: 'Silk' },
  { name: 'Android', value: 'Android', version: 'Android' },
  { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
  { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
  { name: 'Macintosh', value: 'Mac', version: 'OS X' },
  { name: 'Linux', value: 'Linux', version: 'rv' },
  { name: 'Palm', value: 'Palm', version: 'PalmOS' },
];
const DATABROWSER = [
  { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
  { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
  { name: 'Safari', value: 'Safari', version: 'Version' },
  { name: 'Internet Explore', value: 'MSIE', version: 'MSIE' },
  { name: 'Opera', value: 'Opera', version: 'Opera' },
  { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
  { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' },
];

export default class UserInfo {
  public options = [];
  public readonly header = HEADER;
  public readonly dataos = DATAOS;
  public readonly databrowser = DATABROWSER;

  public init() {
    const agent = this.header.join(' ');
    const os = this.matchItem(agent, this.dataos).then(osInfo => osInfo);
    const browser = this.matchItem(agent, this.databrowser).then(browserInfo => browserInfo);

    return Promise.all([os, browser]);
  }

  private async matchItem(string, data) {
    let regex;
    let regexv;
    let match;
    let matches;
    let name;
    let version: string;

    await data.forEach(item => {
      name = item.name;
      regex = new RegExp(item.value, 'i');
      match = regex.test(string);
      if (match) {
        regexv = new RegExp(item.version + '[- /:;]([\\d._]+)', 'i');
        matches = string.match(regexv);
        version = '';
        if (matches) {
          if (matches[1]) {
            matches = matches[1];
          }
        }
        if (matches) {
          matches = matches.split(/[._]+/);
          matches.forEach((match, index) => {
            if (index === 0) {
              version += `${match}.`;
            } else {
              version += `${match}`;
            }
          });
        } else {
          version = '0';
        }
      }
    });

    return { name: name || 'unknown', version: parseFloat(version) || '0' };
  }
}
// let debug = '';

// debug += 'navigator.userAgent = ' + navigator.userAgent + '<br/>';
// debug += 'navigator.appVersion = ' + navigator.appVersion + '<br/>';
// debug += 'navigator.platform = ' + navigator.platform + '<br/>';
// debug += 'navigator.vendor = ' + navigator.vendor + '<br/>';
// debug += '<br/>';

// new UserInfo().init().then(([os, browser]) => {
//   debug += 'os.name = ' + os.name + '<br/>';
//   debug += 'os.version = ' + os.version + '<br/>';
//   debug += 'browser.name = ' + browser.name + '<br/>';
//   debug += 'browser.version = ' + browser.version + '<br/>';

//   document.getElementById('info').innerHTML = debug;
// });
