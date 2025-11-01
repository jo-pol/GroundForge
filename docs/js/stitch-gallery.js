const GF_stitches = {


    lastValidStitchValue: "",

    fixStitchValue(inputField) {
        const value = inputField.value.toLowerCase();
        inputField.value = value
        if (/^([-]|([tclr])*)$/.test(value)) {
            GF_stitches.lastValidStitchValue = value;
        } else {
            inputField.value = GF_stitches.lastValidStitchValue;
            if (typeof window.AudioContext !== "undefined") {
                const ctx = new window.AudioContext();
                const o = ctx.createOscillator();
                o.type = "sine";
                o.frequency.value = 440;
                o.connect(ctx.destination);
                o.start();
                o.stop(ctx.currentTime + 0.05);
            }
        }
    },


    loadStitchExamples() {
        var stitches = [
            "cllcrrcllcrrc",
            "ctctctc",
            "ct",
            "ctct",
            "crcllrrrc",
            "clcrclc",
            "ctctc",
            "ctclctc",
            "crclct",
            "ctclcrctc",
            "ctcttctc",
            "tctctllctctr",
        ]
        for (let stitch of stitches) {
            document.querySelector("#gallery").innerHTML += `
            <figure>
                <svg width="20" height="54">
                  <g transform="scale(2,2)">
                    <g transform="translate(5,6)">
                      ${PairSvg.shapes(stitch)}
                    </g>
                  </g>
                </svg>
                <img src="/GroundForge/images/stitches/${stitch}.png"
                     title="${stitch}">
                <figcaption>
                    <a href="javaScript:GF_stitches.setStitch('${stitch}')">${stitch}</a>&nbsp;
                </figcaption>
            </figure>`
        }
    },

    paintStitchValue() {
        return d3.select("#stitchDef").node().value.toLowerCase().replace(/[^ctlrp-]/g, '')
    },

    load(isDroste) {
        this.loadStitchExamples();
        this.loadStitchForm(isDroste);
        this.setColorCode();
    },

    loadStitchForm(isDroste) {
        let p = document.createElement("p")
        const ign = isDroste ? '' : `<a class="button" href="javascript:setIgnoredStitches()">assign to ignored</a>`
        const note = !isDroste ? '' : 'Out of date diagrams/stitches are highlighted.'
        p.innerHTML += `
            <span id="colorCode"></span>
            <input type="text" value="ct"
                   id="stitchDef" name="stitchDef"
                   onkeyup="GF_stitches.setColorCode()"
                   oninput="GF_stitches.fixStitchValue(this)"
                   onclick="return false" onsubmit="return false"
            >
            flip: 
            <a class="button" href="javascript:GF_stitches.flip2d()">&harr;</a>
            <a class="button" href="javascript:GF_stitches.flip2p()">&varr;</a>
            <a class="button" href="javascript:GF_stitches.flip2q()">both</a>`
        let element = document.querySelector("#gallery");
        element.parentNode.insertBefore(p, element.nextSibling)
        this.setStitch("ct")
    },

    flip2d() {
        var n = d3.select('#stitchDef').node()
        n.value = n.value.toLowerCase().replace(/l/g, "R").replace(/r/g, "L").toLowerCase()
        this.setColorCode()
        n.focus()
    },

    flip2p() {
        var n = d3.select('#stitchDef').node()
        n.value = n.value.toLowerCase().split("").reverse().join("")
        this.setColorCode()
        n.focus()
    },

    flip2q() {
        this.flip2d()
        this.flip2p()
    },

    setColorCode() {
        let node = d3.select("#stitchDef").node();
        if (node)
            document.querySelector('#colorCode').innerHTML = `
        <svg width="20px" height="25px">
          <g transform="scale(2,2)">
            <g transform="translate(5,6)">
              ${PairSvg.shapes(node.value.toLowerCase())}
            </g>
          </g>
        </svg>`
    },

    setStitch(stitch) {
        const n = document.querySelector("#stitchDef")
        n.value = stitch
        n.focus()
        this.setColorCode();
    }
}
