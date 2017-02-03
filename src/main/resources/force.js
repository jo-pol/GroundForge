/*
 Copyright 2017 Jo Pol
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program. If not, see http://www.gnu.org/licenses/gpl.html dibl
*/

// converts x/y of Diagram.nodes to https://github.com/d3/d3-force/#simulation_nodes
function nodesToJS(arrayOfMaps) {
  var result = new Array(arrayOfMaps.size())
  for ( i = arrayOfMaps.size() ; i-- > 0 ; ){
    map = arrayOfMaps.apply(i)
    result[i] = {
      x: (map.get('x').getClass().getName()=="scala.None$") ? 0 : map.get('x').get(),
      y: (map.get('y').getClass().getName()=="scala.None$") ? 0 : map.get('y').get()
    }
  }
  return result
}

// converts Diagram.links for https://github.com/d3/d3-force/#links
function linksToJS(arrayOfMaps) {
  var result = new Array(arrayOfMaps.size())
  for ( i = arrayOfMaps.size() ; i-- > 0 ; ){
    map = arrayOfMaps.apply(i)
    result[i] = {
      source: map.get('source').get(),
      target: map.get('target').get(),
      weak: (map.get('weak').getClass().getName()=="scala.None$") ? false : map.get('weak').get()
    }
  }
  return result
}

function strength(link){
  return link.weak? 5 : 50
}

function applyForce(center, data) {
  var nodes = nodesToJS(data.nodes())
  var links = linksToJS(data.links())
  // print("== nodes == "+JSON.stringify(nodes))
  // print("== links == "+JSON.stringify(links))
  var sim = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("link", d3.forceLink(links).strength(strength).distance(12).iterations(30))
    .force("center", d3.forceCenter(center.x(), center.y()))
    .alpha(0.0035)
    .on("end", function() { onEnd(nodes) })
}
