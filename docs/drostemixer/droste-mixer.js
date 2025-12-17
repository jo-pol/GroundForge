const GF_droste_mixer = {
    generateSelectedDiagram(diagramType) {
        const checkedDroste = document.querySelector('input[name="droste"]:checked');
        const drosteIndex = parseInt(checkedDroste.value, 10);
        const stepValues = [];
        for (let i = 1; i <= drosteIndex; i++) {
            const textarea = document.getElementById('droste' + i);
            txt =  textarea && textarea.value.trim() ? textarea.value.trim() : "ct";
            stepValues.push(txt);
        }
        console.log(stepValues);
        GF_panel.diagramSVG({id: diagramType+ '_panel', query: q, type: diagramType, steps: stepValues});
        document.getElementById(diagramType+ '_panel').style.backgroundColor = "";
    },
    setStitchEvents() {
        function stitchHandler(event) {
            const targetText = event.currentTarget.textContent;
            const targetClass = '.'+targetText.replaceAll(/ /g, '');
            document.getElementById('pair_panel')
                .querySelectorAll('title')
                .forEach(title => {
                if (title.parentNode.textContent === targetText) {
                    title.parentNode.insertAdjacentHTML(
                        'beforeend',
                        '<circle cx="0" cy="0" r="9" fill="#000" style="opacity: 0.15;"></circle>'
                    );
                }
            });
            document.getElementById('thread_panel').querySelectorAll(targetClass).forEach(el => {
                el.append('<circle cx="0" cy="0" r="9" fill="#000" style="opacity: 0.15;"></circle>')
            })
        }

        Array.from(document
            .getElementById('pair_panel')
            .querySelectorAll('title')
        ).forEach(function (title) {
            if (!title.textContent.startsWith('Pair'))
                title.parentNode.addEventListener('click', stitchHandler)
        });
    },
    drosteControls(stepNr){
        return `
            <div style="display: flex; width: 100%;">
              <input type="radio" name="droste" value="${stepNr}" style="flex: 0 0 auto;">
              <textarea id="droste${stepNr}" style="flex: 1 1 0; width: 0; min-width: 0;" placeholder="droste step ${stepNr}, default all: ct"></textarea>
            </div>
          `;
    },
    load(container) {
        q = "patchWidth=3&patchHeight=7&c1=tc&d1=tctc&e1=tc&c2=tctc&e2=tctc&d3=tc&shiftColsSE=2&shiftRowsSE=2&shiftColsSW=-2&shiftRowsSW=2&footside=-5,B-,-2,b-,,&tile=831,4-7,-5-&headside=5-,-c,6-,-c"
        const pairWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('pair');GF_droste_mixer.setStitchEvents()";
        const threadWandHref = "javascript:GF_droste_mixer.generateSelectedDiagram('thread')";
        GF_panel.load({caption: "pair diagram", id: "pair_panel", wandHref: pairWandHref, controls: ["resize"]}, container);
        GF_panel.load({caption: "thread diagram", id: "thread_panel", wandHref: threadWandHref, controls: ["resize", "color"]}, container);
        GF_panel.load({caption: "options", id: "options", controls: ["resize"]}, container);
        document.getElementById('options').innerHTML = `
        <div style="display: flex; width: 100%;">
          <input type="radio" name="droste" value="0" checked style="flex: 0 0 auto;">
          <input type="text" id="droste0" value="${q}" style="flex: 1 1 0; width: 0; min-width: 0;">
        </div>${this.drosteControls(1)}${this.drosteControls(2)}${this.drosteControls(3)}
        `;
        document.querySelectorAll('input[name="droste"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.getElementById('pair_panel').style.backgroundColor = "rgb(238, 238, 238)";
                document.getElementById('thread_panel').style.backgroundColor = "rgb(238, 238, 238)";
            });
        });
    }
}