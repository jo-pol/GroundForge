---
layout: default
title: wip
sidebar: mix4snow
javascript:
  - d3.v4.min.js
  - GroundForge-opt.js
  - nudgePairs.js
  - panel.js
---

Work in progress
================

TO DO: 
* Toggle between galleries (minimize all but one): [basic stitches](/API/stitch-gallery) and [4/8-pair snow](/GroundForge-help/snow-mix/droste/#48-pair-recipes).
  Maybe even some basic [pattern](/GroundForge-help/snow-mix/droste/#more-freedom)
  variations, finally linking to the catalogues (tesselace first).
* Apply to all (apply to ignored only for step-0?), beep on invalid input.
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
<script src="droste-mixer.js" type="text/javascript"></script>
<script>GF_droste_mixer.load(document.getElementById('main-content'))</script>