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
css:
  - hybrid.css
---

Work in progress
================

Inspired by [mix snow with two droste steps](/GroundForge-help/snow-mix/droste) and the desire to develop scripts for reusable widgets.

Usage: see sources
for .md of [this]({{ site.github.repository_url}}/blob/master/docs/API/hybrid.md)
and [stitches]({{ site.github.repository_url}}/blob/master/docs/stitches.md).
and [.html]({{ site.github.repository_url}}/blob/master/test-docs/hybrid.html).
Note the different locations of the scripts, mark down front matter expects them in docs/js.

TO DO: 
* Apply to all (apply to ignored only for step-0)
* Beep on invalid input (tweak, spinners, specs). When pasting a URL in the first specifications field: strip until question mark.
* Update sidebar subjects
* Undress for droste is slightly more complicated than stitches:
  step values should be adjustable but the same for both diagrams,
  perhaps show a single step field outside the diagram captions.
  Note that specs should not be hidden.

<script src="../tileGallery/tile-gallery.js" type="text/javascript"></script>
<script>GF_hybrid.load(document.getElementById('main-content'))</script>