const GF_droste_mixer = {
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
    },
    setStitchEvents() {
        function stitchHandler(event) {
            const newStitchValue = document.getElementById('basicStitchInput').value;
            const newDrosteStitches = document.getElementById('drosteStitches').value.split(/[,.]/);
            if(newStitchValue === '') return;

            const selectedText = event.currentTarget.textContent;
            let selectedStitchId = selectedText.replace(/.* /,"");

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
            if (newDrosteStitches.length !== newStitchValue.length) {
                // TODO beep
                return;
            }
            let extraSteps = ''
            for (let i = 0; i < newDrosteStitches.length; i++) {
                extraSteps += `\n${selectedStitchId}${i}=${newDrosteStitches[i]}`;
            }
            const elementId = 'droste'+ (drosteIndex + 1);
            document.getElementById(elementId).value += extraSteps;
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
                .replaceAll(/[^crlt]/g, '')
                .replace(/l/g, "R")
                .replace(/r/g, "L");
        }
        const n = document.getElementById('drosteStitches');
        n.value = flip(n);
        this.flipRadio(document.getElementById('basicStitchInput'));
        n.focus();
    },

    flip_b2p() {
        const n = document.getElementById('drosteStitches');
        n.value = n.value.toLowerCase()
            .replaceAll('.', ',')
            .replaceAll(/[^crlt,]/g, '')
            .split(",").reverse().join("");
        n.focus();
    },
    load(container) {
        const containerWidth = `'${container.style.width}'`;
        const pairWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('pair');GF_droste_mixer.setStitchEvents()";
        const threadWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('thread')";
        GF_panel.load({caption: "select (3/6-pair)", id: "snow3", controls: ["resize"], size:{width:'´98%', height: '50px'}}, container);
        GF_panel.load({caption: "tweak selected", id: "tweak", size:{width:'´98%', height: 'auto'}}, container);
        GF_panel.load({caption: "pairs", id: "pair_panel", wandHref: pairWandHref, controls: ["resize"]}, container);
        GF_panel.load({caption: "threads", id: "thread_panel", wandHref: threadWandHref, controls: ["resize", "color"]}, container);
        GF_panel.load({caption: "advanced", id: "specs", controls: ["resize"]}, container);
        document.getElementById('tweak').insertAdjacentHTML('beforeend',`<p>
            <label for="basicStitchInput">Basic stitch:</label>
            <input type="text" id="basicStitchInput" value="lclc" placeholder="Example: clct"/>
            <br>
            <label for="drosteStitches">Droste applied to basic stitch:</label>
            <input type="text" id="drosteStitches" value="tc,rclcrc,clcrcl,ct" placeholder="Example: cl,cr,tt; As many as clr actions in basic stitch (t=lr)" />
            Flip:
            <button onclick="GF_droste_mixer.flip_b2d()">&harr;</button>
            <button onclick="GF_droste_mixer.flip_b2p()">&varr;</button>
            <button onclick="GF_droste_mixer.flip_b2d();flip_b2p()">both</button>
        </p>`);
        document.getElementById('tweak').parentNode.style.width = '100%';
        const snow3Gallery = document.getElementById('snow3')
        for(let [img,basicStitch,droste] of GF_droste_mixer.snow3){
            snow3Gallery.insertAdjacentHTML('beforeend',
                `<a href="javascript:GF_droste_mixer.setRecipe('${basicStitch}','${droste}')"><img src="../mix4snow/${img}.png" alt="${img}"></a> `);

        }
        let q = new URL(document.documentURI).search.slice(1);
        if (q === "" || !q.includes('shiftRows')) {
            q = "patchWidth=7&patchHeight=7&footside=---x,---4,---x,---4&tile=5-,-5,5-,-5&headside=-,c,-,c,&shiftColsSW=0&shiftRowsSW=4&shiftColsSE=2&shiftRowsSE=2&e1=lclc&l2=llctt&f2=rcrc&d2=rrctt&e3=rcrc&l4=llctt&f4=lclc&d4=rrctt&droste2=e12=clcrcl,e13=ct,f42=ctcl,e32=f22=ctcr,e33=f43=lct,e31=f21=lctc,e11=rclcrc,f23=rct,f41=rctc,e10=tc,f20=tcl,e30=f40=tcr"
        }
        const params = new URLSearchParams(q);
        document.getElementById('threadStep').value = 1;
        document.getElementById('specs').innerHTML = `
          <a href="javascript:cleanupStitches('droste1');cleanupStitches('droste2');cleanupStitches('droste3')" title="Reduce panel content"><img src="/GroundForge/images/broom.png"></a>
          Specs collected from URL and clicks:
          <input type="text" id="droste0" value="${q}">
          <textarea id="droste1" spellcheck="false" placeholder="droste step 1, default all: ctc">${params.get('droste2') || ''}</textarea>
          <textarea id="droste2" spellcheck="false" placeholder="droste step 3, default all: ctc">${params.get('droste3') || ''}</textarea>
          <textarea id="droste3" spellcheck="false" placeholder="droste step 3, default all: ctc">${params.get('droste4') || ''}</textarea>
        `;
        document.getElementById('specs').style.height = "2px";
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
    }
}