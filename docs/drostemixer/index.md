---
layout: default
title: GF - Droste mixer
javascript:
  - d3.v4.min.js
  - GroundForge-opt.js
  - nudgePairs.js
  - panel.js
---

Droste mixer? Under development.
================================

**TODO**: 
* Galleries: [basic stitches](/API/stitch-gallery) and recipes for snow with
  [two droste steps](/GroundForge-help/snow-mix/droste/), maybe even
  some [patterns](https://jo-pol.github.io/GroundForge-help/snow-mix/droste/#more-freedom).
* Flip buttons, apply to all (ignored only for step-0?).
* Radios -> twisters in diagram captions
* Rename rest of _options_ to _advanced_, maybe even initialy minimized (values collected from URL and pair diagram interactions)
* Legend panel (should wrap nicely)

---

<label for="basicStitchInput">Basic stitch:</label>
<input type="text" id="basicStitchInput" placeholder="Example: clct" />

<label for="drosteStitches">Droste applied to basic stitch:</label>
<input type="text" id="drosteStitches" placeholder="Example: cl,cr,tt; As many as clr actions in basic stitch (t=lr)" />

<style>
    .gf_panel {display: inline-block; margin: 4px;}
    .gf_panel > div {width: 100%; overflow: auto; resize:both; border: #ddd solid 1px; }
    .gf_panel > figcaption {width: 100%; box-sizing: border-box; background-color: #ddd; }
    .gf_panel > figcaption img, .gf_panel > figcaption > input {margin-left: 0.5em;}
    #drosteStitches {width: 100%}
</style>
<script src="droste-mixer.js" type="text/javascript"></script>
<script>GF_droste_mixer.load(document.getElementById('main-content'))</script>