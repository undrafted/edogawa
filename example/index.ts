import * as edogawa from '../src';
import { Report } from '../src/types';

const fakeEndpoint = 'http://http://localhost:8080';
const exceptionCb = (report: Report) => {
  console.log('%cReport object generated by the library ↓', 'font-size:18px;color:green;');
  console.log('=================');
  console.log(report);
  console.log('=================');
};

edogawa.createReporter({ endpoint: fakeEndpoint }, exceptionCb, { clientSideDebug: true });

let app = document.getElementById('app') as HTMLElement;

const button = document.createElement('button');
button.setAttribute('id', 'id-button-1');
button.setAttribute('class', 'class-button-1');
button.innerHTML = 'Click to push events to the trail';

const button2 = document.createElement('button');
button2.setAttribute('id', 'id-button-2');
button2.setAttribute('class', 'class-button-2');
button2.innerHTML = 'Click to throw an error';
button2.addEventListener('click', () => {
  throw new Error('custom error');
});

app.appendChild(button);
app.appendChild(button2);
