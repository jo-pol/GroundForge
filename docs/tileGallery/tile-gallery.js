GF_tiles = {
    content_home: '..',
    showPreview(clickedElement){
        const previewDiv = document.getElementById('previews');
        previewDiv.innerHTML = '';
        Array.from(clickedElement.parentElement.children)
            .filter(el => el.tagName.toLowerCase() === 'a')
            .forEach(element => {
                const q = element.getAttribute('xlink:href').split('?')[1];
                const panelId = `preview_${(element.textContent)}`;
                const caption = `<a href="${element.getAttribute('href')}">modify</a>: ${element.textContent}`;
                GF_panel.load({caption: caption, id: panelId, size:{width:'280px', height: '200px'}}, previewDiv);
                GF_panel.diagramSVG({id: panelId, query: q, type: 'pair'},previewDiv);
            })
        return false;
    },
    load(parent = document.body, jsAction = 'GF_tiles.showPreview(this)') {
        GF_panel.load({caption: " ", id: "patterns", controls: ["resize"], size:{width:'480px', height: '300px'}}, parent);
        parent.insertAdjacentHTML('beforeend', `<div id="previews"></div>`);
        const svg = `${this.content_home}/docs/tileGallery/index.svg`;
        fetch(svg)
            .then(response => response.text())
            .then(svg => {
                document.getElementById('patterns').insertAdjacentHTML('beforeend', svg);
                document.querySelectorAll("#patterns > svg a").forEach(el => {
                    const link = el.getAttribute('xlink:href');
                    if(link !== null) {
                        el.setAttribute('href', link.replace(/.*io.GroundForge/ , '/GroundForge'));
                        if(link.includes('?')) {
                            el.setAttribute('onclick', `javascript:${jsAction};return false;`);
                        }
                    }
                })
            });
    }
};
