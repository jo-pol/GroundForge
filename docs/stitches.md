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
---

Stitches and threads
================

<script>
    console.log('================ Loading hybrid panels ================');
    GF_tiles = {loadGallery (namedArgs){ }}; // dummy to avoid errors
    GF_hybrid.snow3 = []; // clear for performance
    GF_hybrid.snow4 = []; // clear for performance
    GF_hybrid.load(document.getElementById('main-content'));
    for (let id of ['pairStep', 'threadStep']) {
        document.getElementsById(id).value = 0;
    }
    for (let id of ['specs', 'pattern', 'snow3', 'snow4', 'drosteStitches', 'pairStep', 'threadStep']) {
        document.getElementsById(id).parentNode.style.display = 'none';
    }
    document.getElementsById('stitches').parentNode.getElementsByTagName('selecti').outerHTML = 'stitches';
</script>