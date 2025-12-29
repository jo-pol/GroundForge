---
layout: default
title: patterns
javascript:
  - GroundForge-opt.js
  - panel.js
---

Pattern gallery
===============

TODO: show previews of _all_ variants with links to the pattern page to create another variant.

<style>
    .gf_panel {display: inline-block; margin: 4px;}
    .gf_panel > div {width: 98%; overflow: auto; resize:both; border: #ddd solid 1px; }
    .gf_panel > figcaption {width: 100%; height:2.5em; padding-bottom: 0.2em; padding-left:0.5em; margin-left:0; margin-bottom:0; box-sizing: border-box; display: flex; align-items: center; background-color: #ddd; }
    .gf_panel > figcaption img {margin-left: 0.5em;}
    .gf_panel > figcaption > input {margin-left: 0.5em; width: 3em;}
    .gf_panel > div > textarea { height: 4.5em; width: 100%}
    .gf_panel > div > input { width: calc(100% - 1px)}
    #tweak {resize: none;}
    #tweak input {width: calc(100% - 2.5em); margin-left: 2em; }
    #snow3 {resize: vertical;}
</style>
<script>
function setPattern(q){
    GF_panel.diagramSVG({id: 'previews', query: q, type: 'pair', steps: 0},document.getElementById('previews'));
}
GF_panel.load({caption: " ", id: "patterns", controls: ["resize"], size:{width:'480px', height: '300px'}}, document.getElementById('main-content'));
fetch('index.svg')
    .then(response => {
        return response.text();
    })
    .then(svg => {
        document.getElementById('patterns').insertAdjacentHTML('beforeend', svg);
        document.querySelectorAll("#patterns > svg a").forEach(el => {
            const link = (el.getAttribute('xlink:href'));
            if(link.includes('?')) {
                el.setAttribute('href', `javascript:setPattern('${link.split('?')[1]}')`);
            } else {
                el.setAttribute('href', link.replace(/.*io.GroundForge/ , '/GroundForge'));
            }
        })
    });
</script>
<div id="previews"> </div>