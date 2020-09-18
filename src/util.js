const rmsPrefix = /^-ms-/;
const rdashAlpha = /-([a-z])/g;

const fcamelCase = (all, letter) => {
  return letter.toUpperCase();
}

const camelCase = (string) => {
  return string.replace(rmsPrefix, 'ms-').replace(rdashAlpha, fcamelCase);
}

const cssNumber = {
  fillOpacity: true,
  fontWeight: true,
  lineHeight: true,
  opacity: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true,
};



const find = (array, callback) => {
  const index = this.findIndex(array, callback);
  if (index >= 0) {
    return array[index];
  }
  return null;
}

const findIndex = (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i)) {
      return i;
    }
  }
  return -1;
}

const empty = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

const createElement = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

const createElements = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  const children = div.children;
  const ret = [];
  for (let i = 0; i < children.length; i++) {
    ret.push(children[i]);
  }
  return ret;
}

const css = (element, cssObj) => {
  const style = element.style;
  const names = Object.keys(cssObj);

  for (let i = 0; i < names.length; i++) {
    const name = camelCase(names[i]);
    let value = cssObj[names[i]];
    if (typeof value === 'number' && !cssNumber[name]) {
      value += 'px';
    }
    style[name] = value;
  }
}

const hasClass = (element, name) => {
  if (element.classList) {
    return element.classList.contains(name);
  }
  const classNames = element.className.split(/\s+/);
  return classNames.indexOf(name) >= 0;
}

const addClass = (element, name) => {
  if (!this.hasClass(element, name)) {
    element.className += (element.className ? ` ${name}` : `${name}`);
  }
}

const removeClass = (element, name) => {
  const classNames = element.className.split(/\s+/);
  const index = classNames.indexOf(name);
  if (index >= 0) {
    classNames.splice(index, 1);
    element.className = classNames.join(' ');
  }
}


export default { find, findIndex, empty, createElement, createElements, css, hasClass, addClass, removeClass };
