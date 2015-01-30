# SuperModal

A super modal UI.

## Markup

```html
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
var modal = new Modal(document.getElementById('the-modal'), isNotMobile);

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
