## Config
Usage:

```js
Popup.open(dialog,
      {
        modal: true,
        against: element,
        position: 'bottom-left',
        offsetX: -10,
        offsetY: 10,
        popupClass: 'my-popup',
        ok: () => {},
        okText: 'OK',
        cancel: () => { Popup.close(); },
        close: () => { Popup.close(); },
      });
  }
```
