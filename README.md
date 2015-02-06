# SuperModal

A super modal UI.

## Usage

```html
<!-- optional custom id -->
<div id="the-modal" class="supermodal-root">
  <div class="supermodal-backdrop"></div>
  <div class="supermodal-positioner">

    <!-- Any custom content, any size -->
    <div id="content">
      <input type="text">
    </div>
    <!-- END of Custom Content -->

    <button class="supermodal-close">&times;</button>
  </div>
</div>
```

```javascript
// use `isMobile` option to specify the mode of modal
// default to mobile mode
var modal = new SuperModal(document.getElementById('the-modal'), {
  isMobile: true // default value
});

modal.onHide(function () {
  alert('modal closed!');
});

modal.onHide(function () {
  alert('modal closed again!');
});

document.getElementById('open-modal').addEventListener('click', function () {
  modal.show();
});
```

## Universal Module Definition (UMD)

SuperModal supports UMD module definition, which means it supports loading using RequireJS (AMD), Browserify (CommonJS), or global variable.

- AMD:

```js
require('SuperModal', function (SuperModal) {
  var modal = new SuperModal();
});
```

- CommonJS:

```js
var SuperModal = require('SuperModal');
var modal = new SuperModal();
```

- Global variable

```js
var modal = new SuperModal();
```
