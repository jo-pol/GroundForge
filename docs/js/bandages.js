function radioValue (name) {
    var radios = document.getElementsByName(name);
    for (var i = 0, length = radios.length; i < length; i++)
        if (radios[i].checked)
            return radios[i].value
     return ""
}
function go() {
  var rows = document.getElementById("rows").value * 1
  var cols = document.getElementById("cols").value * 1
  var grid = radioValue("grid")
  var tiling = radioValue("tiling")

  var tile = grid == 'torchon'
           ? ("5-".repeat((cols+1)/2) + "," + "-5".repeat((cols+1)/2) + ",").repeat((rows+1)/2)
           : ("8".repeat(cols) + "," + "1".repeat(cols) + ",").repeat((rows+1)/2)
  var shifts = tiling == "checker"
             ? `shiftColsSW=-${cols}&shiftRowsSW=${rows}&shiftColsSE=${cols}&shiftRowsSE=${rows}`
             : (tiling == 'horBricks'
               ? `shiftColsSW=-${Math.floor(cols/2)}&shiftRowsSW=${rows}&shiftColsSE=${Math.floor(cols/2)}&shiftRowsSE=${rows}`
               : `shiftColsSW=-${cols}&shiftRowsSW=${Math.floor(rows/2)}&shiftColsSE=${cols}&shiftRowsSE=${Math.floor(rows/2)}`
               )
  var location = `https://d-bl.github.io/GroundForge/tiles.html?patchWidth=${3*cols}&patchHeight=${3*rows}&tile=${tile}&${shifts}`
  console.log(`rows=${rows}, cols=${cols}, grid=${grid}, tiling=${tiling}; ${location}`)
  window.location.assign(location)
}

