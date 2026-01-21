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

<label>Step number <input type="input", min="0" max="3" id="drosteStep" value="1"></label>

<script>
    console.log('================ Loading hybrid panels ================');
    document.getElementById("drosteStep")
        .addEventListener('change', e => {
            const step = Math.min(3, Math.max(1, parseInt(e.target.value)));
            document.getElementById("threadStep").value = step;
            document.getElementById("pairStep").value = step;
        });
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
    document.getElementById('basicStitchInput').previousSibling.remove(); // remove label
    const stitchesEl = document.getElementById('stitches').parentNode;
    stitchesEl.style.display = 'block'; // make visible, whichever gallery is visible by default
    stitchesEl.getElementsByTagName('select')[0].outerHTML = 'select stitch example'; // no choice for other galleries
    console.log('================ Loaded hybrid panels ================');
</script>