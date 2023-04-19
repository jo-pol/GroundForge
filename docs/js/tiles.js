var valueFilter = /[^a-zA-Z0-9,-=]/g
var isMobile = /iPad|iPhone|iPod|Mobi/.test(navigator.userAgent)
function resetStitch(event) {
  // called by events on pattern diagram
  var id = event.currentTarget.dataset.formid
  var el = document.getElementById(id)
  el.focus()
}
function buildLegend(query) {

   return PairDiagram.legend(query.replace(/paintStitches=[a-zA-Z]*&/,"")).replace(/\n/g,"<br>")
}
function setStitch(stitchValue) {
  // called by events on pair diagram
  d3.select('#paintStitches').node().value=stitchValue
  return false;
}
function paintStitchValue () {

  return d3.select("#paintStitches").node().value
}
function flipStitch() {
  var n = d3.select('#paintStitches').node()
  n.value=n.value.toLowerCase().replace(/l/g,"R").replace(/r/g,"l").replace(/R/g,"r")
  return false;
}
function clickedStitch(event) {

  var id = event.currentTarget.getElementsByTagName("title")[0].innerHTML.replace(/.* /,"")
  d3.select('#'+id).attr("value", paintStitchValue())
  showProto()
}
function clearStitches() {

  d3.selectAll("svg input").attr("value",paintStitchValue())
  showProto()
}
function toKeyValueString (formField) {
    var n = formField.name
    var v = formField.value
    return !n || !v ? '' : n + '=' +  v.replace(/\n/g,",").replace(valueFilter,"")
}
function isKeyValue (formField) {

    return formField.name && formField.value
}
function submitQuery() {

  return d3.selectAll('input, textarea')
    .nodes()
    .filter(isKeyValue)
    .map(toKeyValueString)
    .join("&")
}
function tesselace(query){

  // keep tesselace reference as long as tile definition is unchanged
  var tesselace = ""
  if (window.location.search.substr(1).includes("tesselace=")) {
    // obtain tile definition from url
    var urlTile = window.location.search.replace(/(.*[?&])?tile=/, "").replace(/&.*/, "")
    // obtain new tile definition from user interface
    var configTile = query.replace(/(.*[?&])?tile=/, "").replace(/&.*/, "")
    // compare to tile definition from user interface
    if (urlTile == configTile) {
        // formulate tesselace reference
        tesselace = window.location.search.replace(/(.*[?&])?tesselace=/, "tesselace=").replace(/&.*/, "&")
    }
  }
  return tesselace
}
function pocRef (q) {
  return "" +
    q.replace(       /.*(tile=[^&]+).*/,"\$1") + "&" +
    q.replace( /.*(patchWidth=[^&]+).*/,"\$1") + "&" +
    q.replace(/.*(patchHeight=[^&]+).*/,"\$1") + "&" +
    q.replace(/.*(shiftColsSE=[^&]+).*/,"\$1") + "&" +
    q.replace(/.*(shiftRowsSE=[^&]+).*/,"\$1") + "&" +
    q.replace(/.*(shiftColsSW=[^&]+).*/,"\$1") + "&" +
    q.replace(/.*(shiftRowsSW=[^&]+).*/,"\$1") + "&" +
    ""
}
function showProto(q) {

  console.log("start showProto")
  var config = TilesConfig(q ? q : submitQuery())
  d3.select("#prototype").html(PrototypeDiagram.create(config))

  // new form fields may have been added what changes the query
  var query = submitQuery()

  clear2()
  console.log("cleared")
  var svg = PairSvg.legend(TilesConfig(query).getItemMatrix)
  var encoded = encodeURIComponent('<!--?xml version="1.0" encoding="UTF-8"?-->' + svg)
  var l = document.getElementById("pairLegend")
  l.setAttribute('href', 'data:image/svg+xml,' + encoded)
  l.setAttribute('download', 'legend.svg')
  console.log("done legend")
  var hrefQ = tesselace(query) + query
  d3.select("#link").node().href = "?" + hrefQ
  d3.select("#print").node().href = "print?" + hrefQ
  d3.select("#poc").node().href = "poc?" + pocRef(query)
  d3.select("#threadDiagram").html("")
  d3.select("#pairDiagram").html(pairRender(config))
  d3.selectAll("#pattern textarea").attr("rows", config.maxTileRows + 1)
  d3.select("#footside").attr("cols", config.leftMatrixCols + 2)
  d3.select("#tile"    ).attr("cols", config.centerMatrixCols + 2)
  d3.select("#headside").attr("cols", config.rightMatrixCols + 2)
  console.log("done showProto")

  return config
}
function pairRender(config){

    if(config.totalRows>35 || config.totalCols>28) {
        console.log('A2')
        return PairSvg.render(config.getItemMatrix, 1488, 2104, 1.9)
    } else {
        console.log('A4')
        return PairSvg.render(config.getItemMatrix, 744, 1052, 1.9)
    }
}
function showColorCode(id) {
    const n = d3.select(id + " .colorCode")
    const d = n.style("display")
    n.style("display", d == "block" ? "none" : "block")
}
function toggleCheatSheet(imgElement) {
  var value = imgElement.dataset.img;
  if (imgElement.src && imgElement.src.includes("extended")) {
    imgElement.src = "images/matrix-template.png";
    imgElement.title="click to show additional symbols";
  } else {
    imgElement.src = "images/matrix-template-extended.png";
    imgElement.title="click to only show basic symbols";
  }
}
function flip(){
  var left = d3.select("#footside").node().value
  console.log(Matrix.flip)
  d3.select("#headside").node().value = Matrix.flip(left)
  showProto()
}
function scrollIntoViewIfPossible(container) {
  // despite w3Schools documentation not available for IE / Edge(?)
  // see also https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15534521/
  if (container.scrollIntoView) {
    container.scrollIntoView({ block: "start", behavior: 'smooth' })
  }
}
function scrollToIfPossible(container, x, y) {
  if (container.scrollTop !== undefined && container.scrollLeft !== undefined) {
    container.scrollTop = y
    container.scrollLeft = x
  }
}
function showDiagrams(config) {
  var pairContainer = d3.select("#pairDiagram")
  if (!config)
      config = TilesConfig(submitQuery())
  pairContainer.html(pairRender(config))
  scrollToIfPossible(pairContainer.node(),0,0)
  if (pairContainer.select(".node").length <= 1) return

  setThreadDiagram("#threadDiagram", ThreadDiagram.create(NewPairDiagram.create(config)))
}
function animateDiagram(container, forceCenterX, forceCenterY) {
  if(!container) {
    // workaround for chrome
    container = d3.select("#pairDiagram")
    d3.select("#draggable").node().focus()
  }
  var diagram = container.node().data
  var nodeDefs = diagram.jsNodes()
  var linkDefs = diagram.jsLinks()//can't inline
  scrollToIfPossible(container.node(), 220, 400)
  var links = container.selectAll(".link").data(linkDefs)
  var nodes = container.selectAll(".node").data(nodeDefs)

  function moveNode(jsNode) {
      return 'translate('+jsNode.x+','+jsNode.y+')'
  }
  function drawPath(jsLink) {
      var s = jsLink.source
      var t = jsLink.target
      var l = diagram.link(jsLink.index)
      return  DiagramSvg.pathDescription(l, s.x, s.y, t.x, t.y)
  }
  var tickCounter = 0
  function onTick() {
      if ( 0 != (tickCounter++ % 5)) return // skip rendering
      //if (tickCounter++ >=0) terminateAnimation()
      links.attr("d", drawPath)
      nodes.attr("transform", moveNode)
  }

  // read 'weak' as 'invisible'
  function strength(link){ return link.weak ? link.withPin ? 40 : 10 : 50 }
  // https://github.com/d3/d3/releases/tag/v4.4.0
  // https://github.com/d3/d3-force/tree/v1.0.4#api-reference
  var forceLink = d3
    .forceLink(linkDefs)
    .strength(strength)
    .distance(12)
    .iterations(30)
  var sim = d3.forceSimulation(nodeDefs)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", forceLink)
    .force("center", d3.forceCenter(forceCenterX, forceCenterY))
    .alpha(0.0035)
    .on("tick", onTick)

  if (d3.select("#draggable").node().checked) {
    nodes.call(d3.drag()
                   .on("start", dragstarted)
                   .on("drag", dragged)
                   .on("end", dragended))
    function dragstarted(d) {
      if (!d3.event.active) sim.alpha(0.005).restart()
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      step = 0
      if (!d3.event.active) sim.alpha(0.005).restart()
      d.fx = null;
      d.fy = null;
    }
  }
}
function getInkscapeTemplate() {
  var s = InkscapeTemplate.fromUrl(submitQuery())
  return 'data:text/plain,' + encodeURIComponent(s)
}
function setField (keyValueString) {

    var k = keyValueString.replace(/=.*/,"").trim().replace(/[^a-zA-Z0-9]/g,"")
    var v = keyValueString.replace(/[^=]+=/,"").trim().replace(valueFilter,"").replace(/,/g,"\n")
    if (k) d3.select('#'+k).property("value", v)
}
function whiting (kv) {
    var k = kv.trim().replace(/[^a-zA-Z0-9]/g,"")
    if (!kv.startsWith("whiting")) return false
    // side effect: add whiting link
    var pageNr = kv.split("P")[1]
    var cellNr = kv.split("_")[0].split("=")[1]
    d3.select('#whiting').node().innerHTML =
        "<img src='/gw-lace-to-gf/w/page" + pageNr + "a.gif' title='"+cellNr+"'>"+
        " Page <a href='http://www.theedkins.co.uk/jo/lace/whiting/page" + pageNr + ".htm'>" + pageNr + "</a> "+
        "of '<em>A Lace Guide for Makers and Collectors</em>' by Gertrude Whiting; 1920."
    return true
}
function load() {

  var q = window.location.search.substr(1)
  var keyValueStrings = q.split("&")
  keyValueStrings.forEach(setField)
  var config = showProto(q) // this creates a dynamic part of the form
  keyValueStrings.forEach(setField) // fill the form fields again
  var threads1 = ThreadDiagram.create(NewPairDiagram.create(config))
  setThreadDiagram("#threadDiagram", threads1)
  keyValueStrings.find(whiting)
  // TODO dispatch the rest in a background thread, N.B. somehow share threads1
  // TODO perhaps alternatively start all animations at the end
  if (!q.includes("droste2=") && !q.includes("droste3=")) return
  var pairs2 = PairDiagram.create(stitches = d3.select("#droste2").node().value, threads1)
  var threads2 = ThreadDiagram.create(pairs2)
  setPairDiagram("#drostePair2", pairs2)
  setThreadDiagram("#drosteThread2", threads2)
  if (!q.includes("droste3=")) return
  var pairs3 = PairDiagram.create(stitches = d3.select("#droste3").node().value, threads1)
  var threads3 = ThreadDiagram.create(pairs3)
  setPairDiagram("#drostePair3", pairs3)
  setThreadDiagram("#drosteThread3", threads3)
}
function getMatrixLines() {

  return d3.select('#tile').node().value.toUpperCase().trim().split(/[^-A-Z0-9]+/)
}
function asSimple() {

  var matrixLines = getMatrixLines()
  var rows = matrixLines.length
  var cols = matrixLines[0].length
  d3.select('#shiftRowsSE').property("value", rows)
  d3.select('#shiftColsSE').property("value", cols)
  d3.select('#shiftRowsSW').property("value", rows)
  d3.select('#shiftColsSW').property("value", 0)
  showProto()
}
function asHorBricks() {

  var matrixLines = getMatrixLines()
  var rows = matrixLines.length
  var cols = matrixLines[0].length
  d3.select('#shiftRowsSE').property("value", rows)
  d3.select('#shiftColsSE').property("value", cols - Math.round(cols/2))
  d3.select('#shiftRowsSW').property("value", rows)
  d3.select('#shiftColsSW').property("value", - Math.round(cols/2))
  showProto()
}
function asVerBricks() {

  var matrixLines = getMatrixLines()
  var rows = matrixLines.length
  var cols = matrixLines[0].length
  d3.select('#shiftRowsSE').property("value", Math.round(rows/2))
  d3.select('#shiftColsSE').property("value", cols)
  d3.select('#shiftRowsSW').property("value", rows)
  d3.select('#shiftColsSW').property("value", 0)
  showProto()
}
function asCornerToCorner() {

  var matrixLines = getMatrixLines()
  var rows = matrixLines.length
  var cols = matrixLines[0].length
  d3.select('#shiftRowsSE').property("value", rows)
  d3.select('#shiftColsSE').property("value", cols)
  d3.select('#shiftRowsSW').property("value", rows)
  d3.select('#shiftColsSW').property("value", - cols)
  showProto()
}
function brickToLeft() {

  d3.select('#shiftColsSE').node().value--
  d3.select('#shiftColsSW').node().value--
  showProto()
}
function brickToRight() {

  d3.select('#shiftColsSE').node().value++
  d3.select('#shiftColsSW').node().value++
  showProto()
}
function brickUp() {

  d3.select('#shiftRowsSE').node().value--
  showProto()
}
function brickDown() {

  d3.select('#shiftRowsSE').node().value++
  showProto()
}
function seToLeft() {

  d3.select('#shiftColsSE').node().value--
  showProto()
}
function seUp() {

  d3.select('#shiftRowsSE').node().value--
  showProto()
}
function seToRight() {

  d3.select('#shiftColsSE').node().value++
  showProto()
}
function seDown() {

  d3.select('#shiftRowsSE').node().value++
  showProto()
}
function swToRight() {

  d3.select('#shiftColsSW').node().value++
  showProto()
}
function swUp() {

  d3.select('#shiftRowsSW').node().value--
  showProto()
}
function swToLeft() {

  d3.select('#shiftColsSW').node().value--
  showProto()
}
function swDown() {

  d3.select('#shiftRowsSW').node().value++
  showProto()
}
function resizeBoth(selector, scaleValue) {

  resize(d3.select(selector), 'width', scaleValue)
  resize(d3.select(selector), 'height', scaleValue)
}
function resize(container, orientation, scaleValue) {
  var oldValue = container.style(orientation)
  var units = oldValue.replace(/[0-9]/g,'')
  var newValue = Math.round(oldValue.replace(/[^0-9]/g,'') * scaleValue)
  container.style(orientation, newValue + units)
}
function clear2() {
  d3.selectAll("#drostePair2, #drosteThread2, #drostePair3, #drosteThread3").html("")
  d3.selectAll(".colorCode").style("display", "none")
  d3.selectAll("#drostePair2DownloadLink, #drosteThread2DownloadLink, #drostePair3DownloadLink, #drosteThread3DownloadLink")
    .attr("href", "#?pleasePrepareFirst")
    .style("display", "none")
  return false
}
function clear3() {
  d3.selectAll("#drostePair3, #drosteThread3").html("")
  d3.selectAll(".colorCode").style("display", "none")
  d3.selectAll("#drostePair3DownloadLink, #drosteThread3DownloadLink")
    .attr("href", "#?pleasePrepareFirst")
    .style("display", "none")
  return false
}
function showDroste(level) {
  d3.select("#drosteFields" + level).style("display", "block")
  var el = d3.select("#drosteThread" + level).node().firstElementChild
  if (el && el.id.startsWith("svg")) return


  var s = d3.select("#droste" + level).node().value
  var l = PairDiagram.drosteLegend(s)
  d3.select("#drosteFields" + level + " .colorCode").node().innerHTML = l

  var q = submitQuery()
  d3.select("#link").node().href = "?" + q
  var drosteThreads1 = ThreadDiagram.create(NewPairDiagram.create( TilesConfig(q)))
  var drostePairs2 = PairDiagram.create(stitches = d3.select("#droste2").node().value, drosteThreads1)
  var drosteThreads2 = ThreadDiagram.create(drostePairs2)
  // TODO the diagrams above may have been calculated before

  if (level == 2) {
    setPairDiagram("#drostePair2", drostePairs2)
    setThreadDiagram("#drosteThread2", drosteThreads2)
  } else if (level == 3) {
    var drostePairs3 = PairDiagram.create(stitches = d3.select("#droste3").node().value, drosteThreads2)
    setPairDiagram("#drostePair3", drostePairs3)
    setThreadDiagram("#drosteThread3", ThreadDiagram.create(drostePairs3))
  }
  return false
}
function setPairDiagram(containerID, diagram) {
  var container = d3.select(containerID)
  container.node().data = diagram
  container.html(DiagramSvg.render(diagram, "1px", markers = true, 744, 1052, 0.0))
  animateDiagram(container, 350, 526)
}
function setThreadDiagram(containerID, diagram) {
  var container = d3.select(containerID)
  container.node().data = diagram
  container.html(DiagramSvg.render(diagram, "2px", markers = true, 744, 1052, 0.0).replace("<g>","<g transform='scale(0.5,0.5)'>"))
  animateDiagram(container, 744, 1052)
  container.selectAll(".threadStart").on("click", paintThreadByStart)
  container.selectAll(".bobbin").on("click", paintThreadByBobbin)
}
function paintThreadByStart() {
  // firstChild == <title>
  var eventTarget = d3.event.target
  paintThread(eventTarget, eventTarget.firstChild.innerHTML.replace(" ", ""))
}
function paintThreadByBobbin() {
  var eventTarget = d3.event.target
  paintThread(eventTarget, eventTarget.attributes["class"].value.replace(/.* /,""))
}
function paintThread(eventTarget, className) {

  var containerID = eventTarget.parentNode.parentNode.parentNode.id
  var segments = d3.selectAll(" ." + className)
  var old = segments.style("stroke")+""
  //       prototype              logo                issue #166
  var c1 = "rgb(255, 0, 0)"    // "rgb(202, 47, 42)"  "rgb(155, 2, 25)" //dark magenta
  var c3 = "rgb(204, 51, 255)" // "rgb(38, 138, 36)"  "rgb(2, 152, 7)" //deep green
  var c2 = "rgb(0, 136, 0)"    // "rgb(135, 17, 187)" "rgb(131, 75, 206)" //blue violet
  var c4 = "rgb(0, 0, 0)"
  var newColor = old == c1 ? c2 : (old == c2 ? c3 : (old == c3 ? c4 : c1))
  segments.style("stroke", newColor)
  segments.filter(".node").style("fill", newColor)
}
