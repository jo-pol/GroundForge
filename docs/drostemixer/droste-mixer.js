const GF_droste_mixer = {
    generateSelectedDiagram(diagramType) {
        const checkedStep = document.querySelector(`input[name="${diagramType}Step"]:checked`);
        const drosteIndex = parseInt(checkedStep.value, 10);
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
            const checkedDroste = document.querySelector('input[name="pairStep"]:checked');
            const drosteIndex = parseInt(checkedDroste.value, 10);
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
    stepRadiosControls(stepNr){
        return `
              <input type="radio" name="pairStep" value="${stepNr}" style="flex: 0 0 auto;" ${stepNr===0?'checked':''}>
              <input type="radio" name="threadStep" value="${stepNr}" style="flex: 0 0 auto;" ${stepNr===1?'checked':''}>
          `;
    },
    drosteControls(stepNr){
        return `
            <div style="display: flex; width: 100%;">${this.stepRadiosControls(stepNr)}
              <textarea id="droste${stepNr}" style="flex: 1 1 0; width: 0; min-width: 0;" placeholder="droste step ${stepNr}, default all: ctc"></textarea>
            </div>
          `;
    },
    load(container) {
        let q = new URL(document.documentURI).search.slice(1);
        if (q === "" || !q.includes('shiftRows'))
            q = "patchWidth=3&patchHeight=7&c1=tc&d1=tctc&e1=tc&c2=tctc&e2=tctc&d3=tc&shiftColsSE=2&shiftRowsSE=2&shiftColsSW=-2&shiftRowsSW=2&footside=-5,B-,-2,b-,,&tile=831,4-7,-5-&headside=5-,-c,6-,-c&droste2=ctct,twist=ct"
        const pairWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('pair');GF_droste_mixer.setStitchEvents()";
        const threadWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('thread')";
        GF_panel.load({caption: "pair diagram", id: "pair_panel", wandHref: pairWandHref, controls: ["resize"]}, container);
        GF_panel.load({caption: "thread diagram", id: "thread_panel", wandHref: threadWandHref, controls: ["resize", "color"]}, container);
        GF_panel.load({caption: "options", id: "options", controls: ["resize"]}, container);
        document.getElementById('options').innerHTML = `
        <div style="display: flex; width: 100%;">${this.stepRadiosControls(0)}
          <input type="text" id="droste0" value="${q}" style="flex: 1 1 0; width: 0; min-width: 0;">
        </div>${this.drosteControls(1)}${this.drosteControls(2)}${this.drosteControls(3)}
        `;
        for(let kv of q.split(/&/)){
            let eq = kv.indexOf('=');
            let key = eq === -1 ? kv : kv.slice(0, eq);
            let value = eq === -1 ? '' : kv.slice(eq + 1);
            if(key.startsWith('droste')) {
                const elementId = 'droste'+((key.slice(6)*1)-1);
                document.getElementById(elementId).value = value;
            }
        }
        document.querySelectorAll('input[name="droste"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.getElementById('pair_panel').style.backgroundColor = "rgb(238, 238, 238)";
                document.getElementById('thread_panel').style.backgroundColor = "rgb(238, 238, 238)";
            });
        });
    }
}