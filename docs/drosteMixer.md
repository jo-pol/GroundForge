---
layout: default
title: wip
sidebar: droste mixer
javascript:
  - d3.v4.min.js
  - GroundForge-opt.js
  - nudgePairs.js
  - panel.js
  - hybrid.js
css:
  - hybrid.css
---

Inspired by [mix snow with two droste steps](/GroundForge-help/snow-mix/droste) and the desire to develop scripts for reusable widgets.

TO DO: 
* Stitches gallery.
* Swatch size.
* Apply to all/ignored.
* Beep on invalid input (tweak, spinners, specs). When pasting a URL in the first specifications field: strip until question mark.
* Dynamic link to pattern page _inside the pattern gallery_.

<script src="tileGallery/tile-gallery.js" type="text/javascript"></script>
<script>
GF_hybrid.load(document.getElementById('main-content'));
</script>