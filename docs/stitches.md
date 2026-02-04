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

[W.I.P.](https://github.com/d-bl/GroundForge/issues/259)

<div id="stitches_panels"></div>
<script>
    GF_hybrid.loadStitches(document.getElementById('stitches_panels'));
</script>