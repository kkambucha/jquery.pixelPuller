# Jquery pixel-puller

Jquery plugin for pulling metric-pixels.

# Details

Plugin for pull metrics-urls. 
For example to count users or something else events.

# Using

Add plugin and Jquery to project:
```html
<script
  src="https://code.jquery.com/jquery-3.3.1.min.js"
  integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="
  crossorigin="anonymous"></script>
<script src="jquery.pixelPuller.js"></script>
```

Add some class to observable elements for init plugin by class-name:

```html
<a href="https://google.ru" class="js-pixel-puller">Get pixel by click</a>
```

Add needed data-attributes:

```html
<a href="https://google.ru" class="js-pixel-puller" data-pixel-puller-onclick="https://google.ru?param=onClick">Get pixel by click</a>
```

In this case pixel will pull-up by click on link. After that browser reload window.location by original link in "href" attribute.

At the end just initialize plugin on elements with the right class-names.

```
$(document).ready(function() {
	$('.js-pixel-puller').pixelPuller();
});
```

# Options

Required data-attributes:
- data-pixel-puller-onclick  or/and  data-pixel-puller-onvisible  or/and  data-pixel-puller-ontrigger - urls of pixel

Optional data-attributes:
 - data-pixel-puller-repetition - For repeat get metrics by event. False by default, may be "onclick onvisible ontrigger" (or combination).


**data-pixel-puller-onclick** - url of metric-pixel. Pixel will pull when user clicked the element.
**data-pixel-puller-onvisible** - url of metric-pixel. Pixel will pull when element will be in the viewport
**pixel-puller-ontrigger** - url of metric-pixel. Pixel will pull by trigger event on the element from javascript code. For example in sliders-callbacks and other plugins.
**data-pixel-puller-repetition** - optional attribute. In this attribute may be string like "onclick onvisible" or "onclick" or something combinations. If this attribute has parameter (from that - onclick, onvisible, ontrigger) - pulling pixel will repeat on each event. False by default.

# Using from other plugins

You can triiger "pullPixel" event on element and pull metric-pixel from js. But for this you must use **pixel-puller-ontrigger** parameter with your pixel-url.

For example:

```
setInterval(function () {
	$('.js-pixel-puller').trigger('pullPixel');
}, 2000);
```