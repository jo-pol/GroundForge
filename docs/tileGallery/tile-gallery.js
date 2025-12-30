GF_tiles = {
    content_home: '/GroundForge',
    showPreviews(clickedElement){
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
    load(parent = document.body, jsAction) {
        GF_panel.load({caption: " ", id: "patterns", controls: ["resize"], size:{width:'310px', height: '300px'}}, parent);
        parent.insertAdjacentHTML('beforeend', `<div id="previews"></div>`);
        this.loadSvg(jsAction);
    },
    loadSvg(jsAction = 'GF_tiles.showPreviews(this)', containerId = 'patterns') {
        const svg = `${this.content_home}/tileGallery/index.svg`;
        fetch(svg)
            .then(response => response.text())
            .then(svg => {
                document.getElementById(containerId).insertAdjacentHTML('beforeend', svg);
                document.querySelectorAll(`#${containerId} > svg a`).forEach(el => {
                    const link = el.getAttribute('xlink:href');
                    if (link !== null) {
                        el.setAttribute('href', link.replace(/.*io.GroundForge/, '/GroundForge'));
                        if (link.includes('?')) {
                            el.setAttribute('onclick', `javascript:${jsAction};return false;`);
                        }
                    }
                })
                const svgEl = document.querySelector(`#${containerId} > svg`);
                const units = svgEl.getAttribute('width').replace(/[0-9]/g, '');
                const w = svgEl.getAttribute('width').replace(/[^0-9]/g, '');
                const h = svgEl.getAttribute('height').replace(/[^0-9]/g, '');
                // scale by changing page dimensions
                svgEl.setAttribute('width', (w*0.65)+units);
                svgEl.setAttribute('height', (h*0.65)+units)
            });
    }
};
