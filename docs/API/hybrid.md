---
layout: default
title: wip
sidebar: mix4snow
javascript:
  - d3.v4.min.js
  - GroundForge-opt.js
  - nudgePairs.js
  - panel.js
  - hybrid.js
---

Work in progress
================

Inspired by [mix snow with two droste steps](/GroundForge-help/snow-mix/droste).
With a bit undressing the same script could also be used for a _stitches_ pagee or _droste_ page.

TO DO: 
* Add galleries for [basic stitches](/GroundForge/API/stitch-gallery) and [4/8-pair snow](/GroundForge-help/snow-mix/droste/#48-pair-recipes).
* Toggle between the galleries (minimize all but the last one opened).
* Apply to all (apply to ignored only for step-0)
* Beep on invalid input (tweak and spinners). When pasting a URL in the first specifications field: strip until question mark.
* Legend panel (should wrap nicely)
* Update sidebar subjects

<style>
    .gf_panel {display: inline-block; margin: 4px;}
    .gf_panel > div {width: 98%; overflow: auto; resize:both; border: #ddd solid 1px; }
    .gf_panel > figcaption {width: 100%; height:2.5em; padding-bottom: 0.2em; padding-left:0.5em; margin-left:0; margin-bottom:0; box-sizing: border-box; display: flex; align-items: center; background-color: #ddd; }
    .gf_panel > figcaption img {margin-left: 0.5em;}
    .gf_panel > figcaption > input {margin-left: 0.5em; width: 3em;}
    .gf_panel > div > textarea { height: 4.5em; width: 100%}
    .gf_panel > div > input { width: calc(100% - 1px)}
    #tweak {resize: none;}
    #tweak input {width: calc(100% - 2.5em); margin-left: 2em; }
    #snow3 {resize: vertical;}
</style>
<script src="../tileGallery/tile-gallery.js" type="text/javascript"></script>
<script>GF_hybrid.load(document.getElementById('main-content'))</script>