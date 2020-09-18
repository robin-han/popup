import Util from './util';
import Event from './event';

const event = new Event();
let isPopupOpened = false;
let againstRect = null;

const open = function (element, option) {
  if (isPopupOpened) {
    close();
    return;
  }
  const against = option.against;
  if (!against) {
    return;
  }
  againstRect = against.getBoundingClientRect();

  if (option.modal) {
    createBackdrop();
  }
  const popup = createPopup();
  Util.addClass(popup, 'open');
  if (option.modal) {
    Util.addClass(popup, 'c-modal');
  }
  if (option.popupClass) {
    Util.addClass(popup, option.popupClass);
  }
  popup.appendChild(element);

  if (option.close) {
    const closeBtn = Util.createElement('<span class="c-close-btn c-icon c-icon-close"></span>');
    popup.appendChild(closeBtn);
    event.on(closeBtn, 'click', () => {
      option.close.apply();
    });
  }
  if (option.ok) {
    const okText = option.okText || 'OK';
    const okBtn = Util.createElement(`<button class="c-btn c-ok-btn">${okText}</button>`);
    popup.appendChild(okBtn);
    event.on(okBtn, 'click', () => {
      option.ok.apply();
    });
  }
  if (option.cancel) {
    const cancelText = option.cancelText || 'Cancel';
    const cancelBtn = Util.createElement(`<button class="c-btn c-cancel-btn">${cancelText}</button>`);
    popup.appendChild(cancelBtn);
    event.on(cancelBtn, 'click', () => {
      option.cancel.apply();
    });
  }

  updatePosition(popup, {
    position: option.position,
    openRect: againstRect,
    offsetX: option.offsetX,
    offsetY: option.offsetY,
  });

  document.addEventListener('mousedown', documentMousedownHandler, true);
  event.on(window, 'resize', () => {
    close();
  });
  isPopupOpened = true;
};

const close = function () {
  document.removeEventListener('mousedown', documentMousedownHandler, true);
  event.off();

  const popup = getPopup();
  if (popup) {
    popup.className = 'c-popup';
    popup.innerHTML = '';
  }

  const backdrop = getBackdrop();
  if (backdrop) {
    backdrop.parentNode.removeChild(backdrop);
  }
  againstRect = null;
  isPopupOpened = false;
};

const createBackdrop = function () {
  let backdrop = getBackdrop();
  if (!backdrop) {
    backdrop = Util.createElement('<div class="c-modal-backdrop"></div>');
    document.body.appendChild(backdrop);
  }
};
const getBackdrop = function () {
  return document.querySelector('.c-modal-backdrop');
};

const createPopup = function () {
  let popup = getPopup();
  if (!popup) {
    popup = Util.createElement('<div class="c-popup"></div>');
    document.body.appendChild(popup);
  }

  let adorner = popup.querySelector('.c-adorner');
  if (!adorner) {
    adorner = Util.createElement('<div class="c-adorner"></div>');
    popup.appendChild(adorner);
  }
  return popup;
};
const getPopup = function () {
  return document.querySelector('.c-popup');
};

const isModalPopup = function () {
  const backdrop = getBackdrop();
  if (backdrop) {
    return window.getComputedStyle(backdrop).display !== 'none';
  }
  return false;
};

const isHitInPopup = function (evt) {
  const target = evt.target;
  const popup = getPopup();
  if (popup && popup.contains(target)) {
    return true;
  }
  return false;
};

const documentMousedownHandler = function (evt) {
  if (isModalPopup()) {
    return;
  }

  if (againstRect &&
    againstRect.x < evt.pageX && evt.pageX < againstRect.x + againstRect.width &&
    againstRect.y < evt.pageY && evt.pageY < againstRect.y + againstRect.height) {
    return;
  }

  if (!isHitInPopup(evt)) {
    close();
  }
};

const updatePosition = function (popup, option) {
  const offsetX = option.offsetX || 0;
  const offsetY = option.offsetY || 0;
  const position = option.position || 'bottom-right';
  const openRect = option.openRect;

  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight;
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  const isHorizontal = function (pos) {
    return (pos === 'left' || pos === 'right');
  };

  const isVertical = function (pos) {
    return (pos === 'top' || pos === 'bottom');
  };

  const normalizeHorizontal = function (pos, forVertical) {
    if (pos === 'left') {
      if (forVertical) {
        if ((openRect.left + offsetX + popupWidth > maxWidth) &&
          (openRect.left - offsetX + openRect.width - popupWidth >= 0)) {
          pos = 'right';
        }
      } else if ((openRect.left + offsetX - popupWidth < 0) &&
        (openRect.left - offsetX + openRect.width + popupWidth <= maxWidth)) {
        pos = 'right';
      }
    } else if (pos === 'right') {
      if (forVertical) {
        if (openRect.left + offsetX + openRect.width - popupWidth < 0 &&
          openRect.left - offsetX + popupWidth < maxWidth) {
          pos = 'left';
        }
      } else if (openRect.left + offsetX + openRect.width + popupWidth > maxWidth &&
        openRect.left - offsetX - popupWidth >= 0) {
        pos = 'left';
      }
    }
    return pos;
  };

  const getHorizontalOffset = function (originPos, forVertical) {
    const pos = normalizeHorizontal(originPos, forVertical);
    //
    let left = 0;
    if (pos === 'left') {
      if (forVertical) {
        left = openRect.x;
      } else {
        left = openRect.x - popupWidth;
      }
    } else if (pos === 'right') {
      if (forVertical) {
        left = openRect.x + openRect.width - popupWidth;
      } else {
        left = openRect.x + openRect.width;
      }
    }

    left = (pos === originPos ? left + offsetX : left + (-offsetX));
    left = Math.min(left, maxWidth - popupWidth);
    if (pos === 'left') {
      left = Math.max(left, 0);
    } else if (pos === 'right') {
      if (left < 0 && left + popupWidth <= maxWidth) {
        left = 0;
      }
    }

    return left;
  };

  const getVerticalOffset = function (pos, forHorizontal) {
    let top = 0;

    if (pos === 'top') {
      if (forHorizontal) {
        top = openRect.y;
      } else {
        top = openRect.y - popupHeight;
      }
    } else if (pos === 'bottom') {
      if (forHorizontal) {
        top = openRect.y;
      } else {
        top = openRect.y + openRect.height;
      }
    }

    top += offsetY;

    top = Math.min(top, maxHeight - popupHeight);
    top = Math.max(top, 0);

    return top;
  };

  const getArrowDirection = function (pos) {
    switch (pos) {
      case 'left':
        return 'arrow-right';
      case 'right':
        return 'arrow-left';
      case 'bottom':
        return 'arrow-up';
      case 'top':
        return 'arrow-down';
      default:
        return '';
    }
  };

  const updateAdorner = function () {
    const adorner = popup.querySelector('.c-adorner');
    const posParts = position.split('-');

    if (isHorizontal(posParts[0])) {
      Util.css(adorner, {
        top: openRect.height / 2 + offsetY,
      });
    } else if (isVertical(posParts[0])) {
      const hPos = normalizeHorizontal(posParts[1], true);
      let xValue = openRect.width / 2;
      xValue = (hPos === posParts[1] ? xValue - offsetX : xValue + offsetX);
      switch (hPos) {
        case 'left':
          Util.css(adorner, {
            left: xValue,
          });
          break;

        case 'right':
          Util.css(adorner, {
            right: xValue,
          });
          break;

        default:
          break;
      }
    }

    let pos = posParts[0];
    if (isHorizontal(pos)) {
      pos = normalizeHorizontal(pos, false);
    }
    const arrow = getArrowDirection(pos);
    adorner.className = `c-adorner ${arrow}`;
  };

  let left = popup.style.left;
  let top = popup.style.top;
  const posParts = position.split('-');
  if (isHorizontal(posParts[0])) {
    left = getHorizontalOffset(posParts[0], false);
    top = getVerticalOffset(posParts[1], true);
  } else if (isVertical(posParts[0])) {
    top = getVerticalOffset(posParts[0], false);
    left = getHorizontalOffset(posParts[1], true);
  }
  Util.css(popup, { left, top });

  updateAdorner();
};

export default { open, close };
