const GF_droste_mixer = {
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
    load(container) {
        let q = new URL(document.documentURI).search.slice(1);
        if (q === "" || !q.includes('shiftRows'))
            q = "patchWidth=3&patchHeight=7&c1=tc&d1=tctc&e1=tc&c2=tctc&e2=tctc&d3=tc&shiftColsSE=2&shiftRowsSE=2&shiftColsSW=-2&shiftRowsSW=2&footside=-5,B-,-2,b-,,&tile=831,4-7,-5-&headside=5-,-c,6-,-c&droste2=ctct,twist=ct"
        const pairWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('pair');GF_droste_mixer.setStitchEvents()";
        const threadWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('thread')";
        GF_panel.load({caption: "pair diagram", id: "pair_panel", wandHref: pairWandHref, controls: ["resize"]}, container);
        GF_panel.load({caption: "thread diagram", id: "thread_panel", wandHref: threadWandHref, controls: ["resize", "color"]}, container);
        GF_panel.load({caption: "advanced", id: "options", controls: ["resize"]}, container);
        const params = new URLSearchParams(q);
        document.getElementById('threadStep').value = 1;
        document.getElementById('options').innerHTML = `
          Specs collected from URL and clicks on pair diagrams:
          <input type="text" id="droste0" value="${q}">
          <textarea id="droste1" spellcheck="false" placeholder="droste step 1, default all: ctc">${params.get('droste2') || ''}</textarea>
          <textarea id="droste2" spellcheck="false" placeholder="droste step 3, default all: ctc">${params.get('droste3') || ''}</textarea>
          <textarea id="droste3" spellcheck="false" placeholder="droste step 3, default all: ctc">${params.get('droste4') || ''}</textarea>
        `;
        for (let type of ["pair", "thread"]) {
            document.querySelectorAll(`input[name="${type}Step"]`).forEach(function (elem) {
                elem.addEventListener('change', function () {
                    document.getElementById(type + '_panel').style.backgroundColor = "rgb(238, 238, 238)";
                });
            });
        }
    }
}