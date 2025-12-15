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
* Galleries that can initialize the following two text fields 
* Dressing-up
* Assigning stitches

See [recipe sections](/GroundForge-help/snow-mix/droste/) for the droste input field for now.
If the droste field is not empty, a reloaded thread diagram will be one step further than the pair diagram checked in the options panel.

---

<label for="basicStitchInput">Basic stitch:</label>
<input type="text" id="basicStitchInput" placeholder="Example: clct" />

<label for="drosteStitches">Droste applied together with basic stitch:</label>
<input type="text" id="drosteStitches" placeholder="Example: cl,cr,tt; As many as clr actions in basic stitch (t=lr)" />

---

<style>
    .gf_panel {display: inline-block; margin: 4px;}
    .gf_panel > div {width: 100%; overflow: auto; resize:both; border: #ddd solid 1px; }
    .gf_panel > figcaption {width: 100%; box-sizing: border-box; background-color: #ddd; }
    .gf_panel > figcaption img, .gf_panel > figcaption > input {margin-left: 0.5em;}
    #drosteStitches {width: 100%}
</style>
<script src="droste-mixer.js" type="text/javascript"></script>
<script>GF_droste_mixer.load(document.getElementById('main-content'))</script>