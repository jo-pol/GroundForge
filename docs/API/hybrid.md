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
With a bit undressing the same script(s) could replace current pages:
* _stitches_: only stitches gallery; step values zero and hidden.
* _droste_: only stitches gallery; step values adjustable but the same for both diagrams,
  perhaps show a single step field outside the diagram captions.

Usage: see sources
for [.md]({{ site.github.repository_url}}/docs/API/hybrid.md)
and [.html]({{ site.github.repository_url}}/test-docs/hybrid.html).
Note the different locations of the scripts, mark down front matter expects them in docs/js.

TO DO: 
* Apply to all (apply to ignored only for step-0)
* Beep on invalid input (tweak, spinners, specs). When pasting a URL in the first specifications field: strip until question mark.
* Update sidebar subjects

<script src="../tileGallery/tile-gallery.js" type="text/javascript"></script>
<script>GF_hybrid.load(document.getElementById('main-content'))</script>