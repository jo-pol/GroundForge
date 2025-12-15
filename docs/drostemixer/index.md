---
layout: default
title: GF - Droste mixer
javascript:
  - d3.v4.min.js
  - GroundForge-opt.js
  - nudgePairs.js
  - panel.js        \<dans\-java\-utils\.version\>2\.5\.0\<\/dans\-java\-utils\.version\>\n
---

Droste mixer? Under development.
================================

**TODO**: 
* Galleries that can initialize the following two text fields 
* Dressing-up
* Assigning stitches

See [recipe sections](/GroundForge-help/snow-mix/droste/) for the droste input field for now.
If the droste field is not empty, a reloaded thread diagram will be one step further than the pair diagram checked in the options panel.

---

<label for="basicStitchInput">Basic stitch:</label>
<input type="text" id="basicStitchInput" placeholder="Example: clct" />

<label for="drosteStitches">Droste applied together with basic stitch:</label>
<input type="text" id="drosteStitches" style="width:40em" placeholder="Example: cl,cr,tt; As many as clr actions in basic stitch (t=lr)" />

---

<script src="droste-mixer.js" type="text/javascript"></script>
<script>GF_droste_mixer.load(document.getElementById('main-content'))</script>