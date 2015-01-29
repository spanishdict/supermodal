# SuperModal

A super modal UI.

## Markup

```html
<div class="o-popin" id="the-modal">
  <div class="o-popin-backdrop js-popin-backdrop"></div>
  <div class="o-popin-positioner js-popin-positioner">
    <!-- Can be anything, any size -->
    <div id="content">
      <input type="text">
    </div>
    <!-- End of customized content -->
  </div>
</div>
```

```javascript
var modal = new Modal(document.getElementById('the-modal'), isNotMobile);

document.getElementById('open-modal').addEventListener('click', function () {
  modal.show();
});
```
