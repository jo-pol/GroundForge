---
layout: default
title: Pair diagrams from thread diagrams
javascript:
- d3.v4.min.js
- GroundForge-opt.js
- nudgePairs.js
- panel.js
- hybrid.js
css:
- hybrid.css
sidebar: droste
---

Starts with step 1 unless a URL argument specifies a higher number. Always reveal specification panel but initially closed.

TO DO:
* Stitches gallery.
* Swatch size.
* Apply to all/ignored.
* Beep on invalid input (tweak, spinners, specs). When pasting a URL in the first specifications field: strip until question mark.
* Dynamic link to pattern page for the current pattern. For now, we only have a link to a changed pattern.

<div id="droste_panels"></div>
<script>
    GF_hybrid.loadDroste(document.getElementById('droste_panels'));
</script>