/**
 * GroundForge page component generator.
 *
 * The surrounding page should take care of the house style like headers footers and menu's with help pages..
 *
 * Requires: d3.v4.min.js - GroundForge-opt.js - nudgePairs.js (nudgeDiagram) - panel.js - hybrid.css
 * @namespace
 */
const GF_hybrid = {
    content_home: '.',
    snow4:[
        // screenshots taken at 50% zoom level
        // ndb: patterns from "naar de bron" by Nora Andries
        ['ndb-9Z.png','rctcr','x0=cl,x1=llclcr,x2=llclcrclcll,x3=crclcrcl,x4=clcrll,x5=c','x00=x70=c,x80=x81=x90=x91=tt '],
        ['ndb-10N.png','clctcrct','x0=x7=c,x1=rclcr,x2=crc,x3=rctc,x4=ctcl,x5=clcr,x6=crcl,x8=x9=tt','x00=,x70=c,x80=x81=x90=x91=tt '],
        ['spider-1-ring.png','ctct','x1=x2=ctctc,x4=x5=tt'],
        ['spider-2-rings.png','ctct','x1=ctcrctc,x2=ctclctc,x4=x5=tt'],
        ['spider-3-rings.png','ctcctct','x3=ctcctc,x8=x9=tt','x33=ctcctc,x80=x81=x90=x91=tt']
    ],
    snow3: [
        ['123-a',   'rcrcrc','crc,crclctc,ctcrc,rcl,c,c'],
        ['123-b',   'lclclc','rcl,ctc,crcllc,crrclcr,ctc,cl'],
        ['132-a',   'crcrc','ctc,ctc,ctc,ctc,ctc'],
        ['312-a',   'lclc','tctc,rctcl,ctcl,ctct'],
        ['321-a',   'lclc','tc,rclcrc,clcrcl,ct'],
        ['321-b',   'rcrc','tcr,lctc,ctcr,lct'],
        ['321-c',   'rcrc','tcl,lctc,ctcr,rct'],
        ['321-d',   'rcrc','t,lctc,ctcr,ctct'],
        ['126453-a','clclc','c,ctctc,ctctc,ctctc,c'],
        ['153426-a','lclclc','t,rc,ctc,rclcr,ctcl,ct'],
        ['154326-a','lclc','t,rctc,ctctcl,ctct'],
        ['156423-a','crcrc','cr,crcl,clcrclcr,rcrcl,c'],
        ['234561-a','lclclc','cr,crcl,clcr,crcl,clcr,c'],
        ['263451-a','crcrc','cr,crcl,clcr,crcl,cl'],
        ['321546-a','clclc','cl,ctcl,crcrcr,rcr,c'],
        ['321654-a','clclclc','lc,crc,clcrc,clcr,c,crc,cl'],
        ['321654-b','crcrc','cr,ctcr,clclc,lcl,c'],
        ['354612-a','rcrcrc','ctct,ct,ct,ct,cl,ctc'],
        ['426153-a','rcrc','lc,crclclc,crcrclc,cr'],
        ['426153-b','rcrcrc','cr,ctcl,ctcr,ctcl,ctc,c'],
        ['456123-a','rcrc','r,lrc,ctcr,lct'],
        ['456123-b','rcrcrcrc','c,ctc,rclc,ctc,rc,rcl,ctc,c'],
        ['462513-a','lclc','rc,clcrc,clctc,rcl'],
        ['564312-a','rcrc','lcrc,clcrc,clcrc,clcr'],
        ['563412-a','crcrc','c,ctctc,clcr,rctc,c'],
        ['623451-a','lclclclc','r,c,crc,ctc,lcrcl,ctc,crc,cl'],
        ['623541-a','clclc','ctc,ct,crc,ctc,ctc'],
        ['623541-b','crcrc','cl,ctctcr,ct,ctc,c']
    ],
    generateSelectedDiagram(diagramType) {
        const drosteIndex = parseInt(document.getElementById(`${diagramType}Step`).value, 10);
        const steps = [];
        for (let i = 1; i <= drosteIndex; i++) {
            const textarea = document.getElementById(`droste${i}`);
            txt = textarea && textarea.value.trim() ? textarea.value.trim() : "ctc";
            steps.push(txt);
        }
        const q = document.getElementById('droste0').value;
        GF_panel.diagramSVG({id: diagramType+ '_panel', query: q, type: diagramType, steps: steps});
        document.getElementById(diagramType+ '_panel').style.backgroundColor = "";
        if(diagramType==='pair')
            this.generateLegend();
    },
    setStitchEvents() {
        function stitchHandler(event) {
            const newStitchValue = document.getElementById('basicStitchInput').value;
            const drosteValue = document.getElementById('drosteStitches').value;
            if(newStitchValue === '') return;

            const selectedText = event.currentTarget.textContent;
            const selectedStitchId = selectedText.replace(/.* /,"");

            const pairPanel = document.getElementById('pair_panel');
            for (let title of pairPanel.getElementsByTagName('title')) {
                if (title.innerHTML === selectedText) {
                    title.parentNode.insertAdjacentHTML(
                        'beforeend',
                        '<circle cx="0" cy="0" r="9" fill="#000" style="opacity: 0.15;"></circle>'
                    );
                }
            }
            const threadPanel = document.getElementById('thread_panel');
            for (let path of threadPanel.getElementsByTagName('path')) {
                if (path.textContent.includes(' - '+selectedStitchId)) {
                    path.style.opacity = 0.5;
                }
            }
            const drosteIndex = parseInt(document.getElementById("pairStep").value);
            const drosteInput = document.getElementById('droste'+ drosteIndex);
            if (drosteIndex===0){
                for(let kv of drosteInput.value.split(/&/)){
                    let [key, value] = kv.split('=');
                    if(key === selectedStitchId){
                        drosteInput.value = drosteInput.value.replace(kv, `${selectedStitchId}=${newStitchValue}`);
                        break;
                    }
                }
            } else {
                drosteInput.value += `\n${selectedStitchId}=${newStitchValue}`;
            }
            if (drosteValue.trim() === '') {
                return;
            }
            let extraSteps = ''
            if (drosteValue.includes('=')) {
                const count = newStitchValue.replaceAll(/t/g, 'lr').length;
                for (let i = 0; i < count; i++) {
                    // make sure not to inherit previous definitions
                    // TODO more complicated for a second droste step
                    extraSteps += `${selectedStitchId}${i}=`;
                }
                extraSteps += 'ctc\n';
                extraSteps += drosteValue.replaceAll(/x/g,selectedStitchId);
            } else {
                const newDrosteStitches = drosteValue.split(/[,.]/);
                for (let i = 0; i < newDrosteStitches.length; i++) {
                    extraSteps += `\n${selectedStitchId}${i}=${newDrosteStitches[i]}`;
                }
            }
            const drosteId = 'droste'+ (drosteIndex + 1);
            const droste0 = document.getElementById('droste0');
            const params = new URLSearchParams(droste0.value);
            params.set(selectedStitchId, newStitchValue);
            params.set("pairStep", document.getElementById('pairStep').value);
            params.set("threadStep", document.getElementById('threadStep').value);
            params.set(drosteId, extraSteps.replaceAll('\n',',').trim());
            droste0.value = decodeURIComponent(params.toString());
            document.getElementById(drosteId).value += extraSteps + '\n';
            document.getElementById('selfRef').href = '?'+droste0.value
            document.getElementById('selfRef').style.display = 'inline';
        }

        Array.from(document
            .getElementById('pair_panel')
            .querySelectorAll('title')
        ).forEach(function (title) {
            if (!title.textContent.startsWith('Pair'))
                title.parentNode.addEventListener('click', stitchHandler)
        });
    },
    flip_b2d() {
        function flip(n) {
            return n.value.toLowerCase()
                .replaceAll(/[^crlt,.]/g, '')
                .replace(/l/g, "R")
                .replace(/r/g, "L")
                .toLowerCase();
        }
        const n = document.getElementById('drosteStitches');
        n.value = flip(n);
        const n2 = document.getElementById('basicStitchInput');
        n2.value = flip(n2);
    },
    scrollIfTooLittleIsVisible(elementId) {
        const threadPanel = document.getElementById(elementId);
        const rect = threadPanel.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        const visibleHeight = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
        if (visibleHeight / rect.height < 0.3) {
            threadPanel.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    },
    setPattern(element) {
        let q = element.getAttribute('xlink:href').split('?')[1];
        document.getElementById('pairStep').value = 0;
        document.getElementById('droste0').value = q;
        document.getElementById('droste1').value = '';
        document.getElementById('droste2').value = '';
        document.getElementById('droste3').value = '';
        this.generateSelectedDiagram('pair');
        GF_hybrid.setStitchEvents();
        document.getElementById('selfRef').style.display = 'none';
        document.getElementById('thread_panel').innerHTML = '';
        GF_panel.scrollIfTooLittleIsVisible(document.getElementById('pair_panel'));
    },
    flip_b2p() {
        const n = document.getElementById('drosteStitches');
        n.value = n.value.toLowerCase()
            .replaceAll('.', ',')
            .replaceAll(/[^crlt,.]/g, '')
            .split(/[,.]/).reverse().join(",");
        n.focus();
    },
    otherGallery(chooser, initialIndex){
        chooser.parentNode.parentNode.style.display = 'none';
        document.getElementById(chooser.value).parentNode.style.display = 'block';
        chooser.options[initialIndex].disabled = false;
        chooser.selectedIndex = initialIndex;
        chooser.options[initialIndex].disabled = true;
    },
    generateLegend(){
        const dict = {};
        Array.from(document.getElementById('pair_panel')
            .querySelectorAll('.node'))
            .forEach(node => {
                const text = node.textContent.toLowerCase();
                if (!text.startsWith('pair')) {
                    const minorKey = text.split(' ')[0];
                    const majorKey = minorKey
                        .replace(/^[tlr]+/g, '')
                        .replace(/[tlr]+$/g, '');
                    const value = text.substring(text.lastIndexOf(' ') + 1);
                    if (!dict[majorKey]) dict[majorKey] = {};
                    if (!dict[majorKey][minorKey]) {
                        dict[majorKey][minorKey] = new Set();
                    }
                    dict[majorKey][minorKey].add(value);
                }
            });
        const target = document.getElementById('legend_panel');
        target.innerHTML = '';
        Object.keys(dict).sort().forEach(key => {
            target.insertAdjacentHTML('beforeend',`
                  <svg width="25px" height="25px">
                      <g transform="scale(3,3)">
                        <g transform="translate(4,4)">
                          ${PairSvg.shapes(key)}
                        </g>
                      </g>
                    </svg><br>
                    ${Object.entries(dict[key]).sort()
                            .map(([k, v]) => `${k}: ${Array.from(v).join(', ')}`)
                            .join('<br>')
                    }
                <br>`)
        });
    },
    /**
     * Loads all components required for the droste mixer.
     * @function
     * @memberof GF_hybrid
     * @param {!HTMLElement} container receives the generated components
     */
    load(container) {
        function twister(type){
            return `${type}s<label>, step: <input type='number' min='0' max='2' value='0' id='${type}Step' name='${type}Step' title='droste step' ></label>`;
        }
        function galleryPanels() {
            const galleries = {
                'pattern': {caption: 'Pattern gallery', height: '150px'},
                'snow3': {caption: '3/6 pair snow gallery', height: '50px'},
                'snow4': {caption: '4/8 pair snow gallery', height: '65px'},
                'stitches': {caption: 'Stitches gallery', height: '4em'}
            };
            const galleryKeys = Object.keys(galleries);
            for(i = 0; i<galleryKeys.length; i++){
                const key1 = galleryKeys[i];
                let options = ''
                galleryKeys.forEach(function (key2) {
                    if (key2 === key1) {
                        options += `<option value='${key2}' disabled selected>${galleries[key2]['caption']}</option>`;
                    } else {
                        options += `<option value='${key2}'>${galleries[key2]['caption']}</option>`;
                    }
                });
                const chooser = `<select onchange="GF_hybrid.otherGallery(this, ${i});">${options}</select>`;
                const sizeOptions = {width:'100%', height: galleries[key1]['height']};
                GF_panel.load({caption: chooser, id: key1, controls: ["resize"], size: sizeOptions, parent: container});
                if (key1 === 'snow3') {
                    document.getElementById(key1).parentNode.style.display = 'block';
                } else {
                    document.getElementById(key1).parentNode.style.display = 'none';
                }
            }
            GF_tiles.loadGallery({jsAction: 'GF_hybrid.setPattern(this);return false;', containerId: 'pattern'});
            const snow3Gallery = document.getElementById('snow3')
            for(let [img,basicStitch,droste] of GF_hybrid.snow3){
                snow3Gallery.insertAdjacentHTML('beforeend', `
                    <a href="javascript:GF_hybrid.setRecipe('${basicStitch}','${droste}')">
                    <img src="${GF_hybrid.content_home}/mix4snow/${img}.png" alt="${img}">
                    </a>
                `);
            }
            const snow4Gallery = document.getElementById('snow4')
            for(let [img,basicStitch,droste1, droste2] of GF_hybrid.snow4){
                snow4Gallery.insertAdjacentHTML('beforeend', `
                    <a href="javascript:GF_hybrid.setRecipe('${basicStitch}','${droste1}','${droste2}')">
                    <img src="${GF_hybrid.content_home}/images/4-8-legs/${img}" alt="${img}">
                    </a> 
                `);
            }
            document.getElementById('stitches').innerHTML = `
                W.I.P. For now: just type a <em>basic stitch</em> and clear <em>droste applied to basic stitch</em>. 
                Then click a stitch in the pair diagram to apply.
                For ideas see this <a href="${GF_hybrid.content_home}/API/stitch-gallery">page</a>.
            `;
        }
        const pairWandHref = "javascript:GF_hybrid.generateSelectedDiagram('pair');GF_hybrid.setStitchEvents()";
        const threadWandHref = "javascript:GF_hybrid.generateSelectedDiagram('thread')";
        const legendWandHref = "javascript:GF_hybrid.generateLegend()";
        let q = new URL(document.documentURI).search.slice(1)
            .replaceAll(/[^a-zA-Z0-9=,.-]/g,'');
        if (q === "" || !q.includes('shiftRows')) {
            q = "patchWidth=7&patchHeight=7&footside=---x,---4,---x,---4&tile=5-,-5,5-,-5&headside=-,c,-,c,&shiftColsSW=0&shiftRowsSW=4&shiftColsSE=2&shiftRowsSE=2&e1=lclc&l2=llctt&f2=rcrc&d2=rrctt&e3=rcrc&l4=llctt&f4=lclc&d4=rrctt&droste2=e12=clcrcl,e13=ct,f42=ctcl,e32=f22=ctcr,e33=f43=lct,e31=f21=lctc,e11=rclcrc,f23=rct,f41=rctc,e10=tc,f20=tcl,e30=f40=tcr"
        }
        galleryPanels();
        GF_panel.load({caption: "tweak selected stitch", id: "tweak", size:{width:'´98%', height: 'auto'}, parent: container});
        container.insertAdjacentHTML('beforeend',`<p><a href="?${q}" id="selfRef" style="display:none;">Updated pattern</a></p>`);
        GF_panel.load({caption: twister("pair"), id: "pair_panel", wandHref: pairWandHref, controls: ["resize"], parent: container});
        GF_panel.load({caption: twister("thread"), id: "thread_panel", wandHref: threadWandHref, controls: ["resize", "color"], parent: container});
        GF_panel.load({caption: 'stitch enumeration', id: "legend_panel", controls: ["resize"], parent: container});
        GF_panel.load({caption: "specifications", id: "specs", controls: ["resize"], size:{width: '100%', height: '300px'}, parent: container});
        document.getElementById('tweak').insertAdjacentHTML('beforeend',`
            <p>
            <label>Basic stitch:
                <input type="text" id="basicStitchInput" value="lclc" placeholder="Example: clct"/>
            </label>
            <br>
            <label>Droste applied to basic stitch:
                <input type="text" id="drosteStitches" value="tc,rclcrc,clcrcl,ct" placeholder="Example: cl,cr,tt; As many as clr actions in basic stitch (t=lr)" />
            </label>
            </p><p>Flip:
            <button onclick="GF_hybrid.flip_b2d()">&harr;</button>
            <button onclick="GF_hybrid.flip_b2p()">&varr;</button>
            <button onclick="GF_hybrid.flip_b2d();GF_hybrid.flip_b2p()">both</button>
            </p>
        `);
        const params = new URLSearchParams(q);
        document.getElementById('tweak').parentNode.style = `width: calc(100% - 7px)`;
        document.getElementById('pairStep').value = params.get('pairStep') || 0;
        document.getElementById('threadStep').value = params.get('threadStep') || 1;
        const specsPanelContent = document.getElementById('specs');
        specsPanelContent.innerHTML = `
          <a href="javascript:['droste1','droste2','droste3'].forEach(GF_panel.cleanupStitches)" title="Reduce panel content"><img src="${this.content_home}/images/broom.png"></a>
          Specs collected from URL and clicks:
          <input type="text" id="droste0" value="${q}">
          <textarea id="droste1" spellcheck="false" placeholder="droste step 1, default all: ctc">${(params.get('droste2')||'').replaceAll(',','\n') || ''}</textarea>
          <textarea id="droste2" spellcheck="false" placeholder="droste step 2, default all: ctc">${(params.get('droste3')||'').replaceAll(',','\n') || ''}</textarea>
          <textarea id="droste3" spellcheck="false" placeholder="droste step 3, default all: ctc">${(params.get('droste4')||'').replaceAll(',','\n') || ''}</textarea>
        `;
        specsPanelContent.parentNode.style.display = "block";
        specsPanelContent.style.width = "100%";
        specsPanelContent.style.height = "2px";
        for (let type of ["pair", "thread"]) {
            document.querySelectorAll(`input[name="${type}Step"]`).forEach(function (elem) {
                elem.addEventListener('change', function () {
                    document.getElementById(type + '_panel').style.backgroundColor = "rgb(238, 238, 238)";
                });
            });
        }
    },
    setRecipe(basicStitch, drosteStitches) {
        document.getElementById('basicStitchInput').value = basicStitch;
        document.getElementById('drosteStitches').value = drosteStitches;
        // TODO: second step of droste stitches, requires more intelligence in resetting previously assigned stitches
    },
    /**
     * Load components for the droste page.
     * @function
     * @memberof GF_hybrid
     * @param {!HTMLElement} container receives the generated components
     * @param {!number} initialStep default: 1, 0 for a combination of the stitches page and droste page
     */
    loadDroste(container, initialStep = 1){
        container.insertAdjacentHTML("beforeend",`
            <label for=""><strong>Droste step number</strong></label>
            <input type="number" min="0" max="3" id="drosteStep" value="1">
        `);
        document.getElementById("drosteStep")
            .addEventListener('change', e => {
                const val = parseInt(e.target.value, 10);
                const step = isNaN(val) ? initialStep : Math.min(3, Math.max(initialStep, val));
                document.getElementById("drosteStep").value = step;
                document.getElementById("threadStep").value = step;
                document.getElementById("pairStep").value = step;
            });
        this.loadSimple(container, initialStep, ['drosteStitches', 'pairStep', 'threadStep', 'snow3'] );
    },
    /**
     * Load components for the stitches page.
     * @function
     * @memberof GF_hybrid
     * @param {!HTMLElement} container receives the generated components
     * */
    loadStitches(container){
        this.loadSimple(container, 0, ['drosteStitches', 'pairStep', 'threadStep', 'snow3', 'specs'] );
    },
    /**
     * Common code for loadStitches and loadDroste, hiding some components generated by load.
     * @Ignore
     */
    loadSimple(container, initialStep, hiddenElements){
        console.log('================ Loading panels ================');
        GF_tiles = {loadGallery (namedArgs){ }}; // dummy to avoid errors
        this.snow3 = []; // clear for performance
        this.snow4 = []; // clear for performance
        this.load(container);
        for (let id of ['pairStep', 'threadStep']) {
            document.getElementById(id).value = initialStep;
        }
        for (let id of hiddenElements) {
            document.getElementById(id).parentNode.style.display = 'none';
        }
        document.getElementById('basicStitchInput').previousSibling.remove(); // remove label
        const stitchesEl = document.getElementById('stitches').parentNode;
        stitchesEl.style.display = 'block'; // make visible, whichever gallery is visible by default
        stitchesEl.getElementsByTagName('select')[0].outerHTML = 'select stitch example'; // no choice for other galleries
        console.log('================ Loaded panels ================');
    }
}