---
layout: default
title: wip
javascript:
  - d3.v4.min.js
  - GroundForge-opt.js
  - nudgePairs.js
  - panel.js
---

Work in progress
================

TO DO: 
* Galleries: [basic stitches](/API/stitch-gallery) and recipes for snow with
  [two droste steps](/GroundForge-help/snow-mix/droste/), maybe even
  some [patterns](https://jo-pol.github.io/GroundForge-help/snow-mix/droste/#more-freedom)
* Flip buttons, apply to all (ignored only for step-0?)
* Maybe show _advanced_ initially minimized
* Legend panel (should wrap nicely)
* Link to changed pattern, add step numbers to URL

---

<label for="basicStitchInput">Basic stitch:</label>
<input type="text" id="basicStitchInput" value="lclc" placeholder="Example: clct" />

<label for="drosteStitches">Droste applied to basic stitch:</label>
<input type="text" id="drosteStitches" value="tc,rclcrc,clcrcl,ct" placeholder="Example: cl,cr,tt; As many as clr actions in basic stitch (t=lr)" />

<style>
    .gf_panel {display: inline-block; margin: 4px;}
    .gf_panel > div {width: 100%; overflow: auto; resize:both; border: #ddd solid 1px; }
    .gf_panel > figcaption {width: 100%; height:2.5em; padding-bottom: 0.2em; box-sizing: border-box; display: flex; align-items: flex-end; background-color: #ddd; }
    .gf_panel > figcaption img, .gf_panel > figcaption > input {margin-left: 0.5em;}
    .gf_panel > div > div > textarea { height: 5.5em;}
    .gf_panel > div > div > input[type="radio"] { margin-right: 0.5em;}
    #drosteStitches {width: 100%}
</style>
<script src="droste-mixer.js" type="text/javascript"></script>
<script>GF_droste_mixer.load(document.getElementById('main-content'))</script>