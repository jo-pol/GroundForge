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

[W.I.P](https://github.com/d-bl/GroundForge/issues/259)

<div id="droste_panels"></div>
<script>
    GF_hybrid.loadDroste(document.getElementById('droste_panels'));
</script>