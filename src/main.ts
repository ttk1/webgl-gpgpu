import demo01 from './demo01/main';
import demo02 from './demo02/main';
import demo03 from './demo03/main';
import demo04 from './demo04/main';
import demo05 from './demo05/main';
import demo06 from './demo06/main';

const pages = {
  'demo01': demo01,
  'demo02': demo02,
  'demo03': demo03,
  'demo04': demo04,
  'demo05': demo05,
  'demo06': demo06,
};

function index() {
  const ul = document.body.appendChild(document.createElement('ul'));
  for (const page in pages) {
    const a = ul.appendChild(document.createElement('li')).appendChild(document.createElement('a'));
    a.href = './index.html?page=' + page;
    a.textContent = page;
  }
}

window.onload = async () => {
  (pages[new URL(window.location.href).searchParams.get('page')] || index)();
};
