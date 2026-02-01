---
layout: default
title: Stitches and threads
javascript:
- d3.v4.min.js
- GroundForge-opt.js
- nudgePairs.js
- panel.js
- hybrid.js
css:
- hybrid.css
sidebar: stitches
---

Allows droste steps but starts with step 0 and the pair diagram rendered. Reveals specification panel once another step nummer is selected.

TO DO:
* Stitches gallery.
* Swatch size.
* Apply to all/ignored.
* Beep on invalid input (tweak, spinners, specs). When pasting a URL in the first specifications field: strip until question mark.
* Dynamic link to pattern page for the current pattern. For now, we only have a link to a changed pattern. 

<div id="stitches_panels"></div>
<script>
    GF_hybrid.loadStitches(document.getElementById('stitches_panels'));
</script>