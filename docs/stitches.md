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

<script>
    console.log('================ Loading hybrid panels ================');
    GF_tiles = {loadGallery (namedArgs){ }}; // dummy to avoid errors
    GF_hybrid.snow3 = []; // clear for performance
    GF_hybrid.snow4 = []; // clear for performance
    GF_hybrid.load(document.getElementById('main-content'));
    for (let id of ['pairStep', 'threadStep']) {
        document.getElementById(id).value = 0;
    }
    for (let id of ['specs', 'drosteStitches', 'pairStep', 'threadStep', 'snow3']) {
        document.getElementById(id).parentNode.style.display = 'none';
    }
    document.getElementById('stitches').style.width = 'auto';
    const stitchesEl = document.getElementById('stitches').parentNode;
    stitchesEl.style.display = 'block';
    stitchesEl.style.width = 'auto';
    stitchesEl.textContent = '';
    stitchesEl.getElementsByTagName('select')[0].outerHTML = 'stitches';
    console.log('================ Loaded hybrid panels ================');
</script>