---
layout: default
title: tile gallery demo
---

<script>
fetch('index.svg')
  .then(response => response.text())
  .then(svg => {
    document.body.insertAdjacentHTML('beforeend', svg);
  });
</script>