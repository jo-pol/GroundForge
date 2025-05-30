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
 along with this program. If not, see http://www.gnu.org/licenses/gpl.html
*/

package dibl

import dibl.Force.Point
import dibl.LinkProps.{ Path, WhiteEnd, WhiteEndLeft, WhiteEndRight, WhiteStart, WhiteStartLeft, WhiteStartRight }

import scala.scalajs.js.annotation.{ JSExport, JSExportTopLevel }

@JSExportTopLevel("DiagramSvg") object DiagramSvg {

  @JSExport
  def circle(r: Int): String = s"M $r,0 A $r,$r 0 0 1 0,$r $r,$r 0 0 1 -$r,0 $r,$r 0 0 1 0,-$r $r,$r 0 0 1 $r,0 Z"

  @JSExport
  val bobbin: String = "m 0,40" +
    " c -3.40759,0 -6.01351,3.60204 -1.63269,3.60204" +
    " l 0,19.82157" +
    " c -3.67432,-0.008 -1.7251,5.087 -1.32784,7.27458 0.76065,4.18864 1.01701,8.40176 0.3478,12.58551 -1.68869,10.55725 -2.31894,21.67593 1.25552,31.9161 0.2088,0.59819 0.68935,2.7631 1.40054,2.7636 0.71159,0 1.19169,-2.16521 1.40057,-2.7636" +
    " C 5.01838,104.95964 4.38954,93.84095 2.70085,83.2837 2.03164,79.09995 2.28656,74.88683 3.04721,70.69819 3.44447,68.51061 5.61865,63.44146 1.71951,63.42361" +
    " l 0,-19.82157" +
    " C 5.86853,43.60204 3.4855,39.99659 0,40" +
    " L 0,0"

  private val square = "M -18,-6 H 6 V 6 h -24 z"
  private val diamond = "M -5,0 0,8 5,0 0,-8 Z"
  private def shape(node: NodeProps) = // See https://www.w3.org/TR/SVG/paths.html#PathDataMovetoCommands
    if (node.pin) circle(4)
    else if (node.bobbin) bobbin
    else circle(9)

  @JSExport
  val markerDefinitions: String = {

    def threadMarker() = pairMarker("thread", square)

    def pairMarker(idSuffix: String = "pair", shape: String = diamond) =
      s"""<marker id="start-$idSuffix"
         | viewBox="-7 -7 14 14"
         | markerWidth="12"
         | markerHeight="12"
         | orient="auto"
         | markerUnits="userSpaceOnUse">
         | <path d="$shape"
         |  fill="#000"
         |  style="opacity: 0.5;"></path>
         |</marker>
         |""".stripMargin.stripLineEnd.replaceAll("[\n\r]", "")

    def twistMark(count: Int = 1) = {
      // another scale in PairSvg
      val xl = 4 * 1.2
      val xs = 2.5 * 1.2
      val d = if (count == 1) s"M 0,$xl 0,-$xl"
              else if (count == 2) s"M -1,$xl V -$xl M 1,$xl 1,-$xl"
                   else s"M -$xs,$xl V -$xl M $xs,$xl $xs,-$xl  M 0,$xl 0,-$xl"

      s"""<marker id="twist-$count"
         | viewBox="-3 -3 6 6"
         | markerWidth="6"
         | markerHeight="6"
         | orient="auto"
         | markerUnits="userSpaceOnUse">
         | <path d="$d"
         |  fill="#000"
         |  stroke="#000"
         |  stroke-width="1.5px"></path>
         |</marker>
         |""".stripMargin.stripLineEnd.replaceAll("[\n\r]", "")
    }
    s"""<defs>
       |  ${threadMarker()}
       |  ${pairMarker()}
       |  ${ twistMark(1) }
       |  ${ twistMark(2) }
       |  ${ twistMark(3) }
       |</defs>""".stripMargin.stripLineEnd
  }

  private def pathDescription(diagram: Diagram, link: LinkProps): String = {
    val source = diagram.nodes(link.source)
    val target = diagram.nodes(link.target)
    val sX = source.x
    val sY = source.y
    val tX = target.x
    val tY = target.y
    pathDescription(link, sX, sY, tX, tY)
  }


  @JSExport
  def linkPath(sectionType: String, sX: Double, sY: Double, tX: Double, tY: Double): String = {
    val simplePath = Path(Point(sX, sY), Point(tX, tY))

    def straight(threadSection: LinkProps) = {
      val Path(s, t, _) = threadSection.renderedPath(simplePath)
      s"M ${ s.x },${ s.y } ${ t.x },${ t.y }"
    }

    def curved(threadSection: LinkProps) = {
      val Path(s, t, Some(c)) = threadSection.renderedPath(simplePath)
      s"M ${ s.x },${ s.y } S ${ c.x},${c.y} ${ t.x },${ t.y }"
    }

    sectionType match {
      case "WhiteStart" => straight(WhiteStart(Map()))
      case "WhiteStartLeft" => curved(WhiteStartLeft(Map()))
      case "WhiteStartRight" => curved(WhiteStartRight(Map()))
      case "WhiteEnd" => straight(WhiteEnd(Map()))
      case "WhiteEndLeft" => curved(WhiteEndLeft(Map()))
      case "WhiteEndRight" => curved(WhiteEndRight(Map()))
      case _ =>
        val mX = sX + (tX - sX) / 2
        val mY = sY + (tY - sY) / 2
        s"M $sX,$sY $mX $mY $tX,$tY"
    }
  }

  @JSExport
  def pathDescription(link: LinkProps, sX: Double, sY: Double, tX: Double, tY: Double): String = {

    if (link.nrOfTwists > 0) {
      val mX = sX + (tX - sX) / 2
      val mY = sY + (tY - sY) / 2
      // a straight path with two sections allows a twistMark
      s"M $sX,$sY $mX,$mY $tX,$tY"
    }
    else link.renderedPath(Path(Point(sX, sY), Point(tX, tY)))match {
      case Path(s, t, None) => s"M ${ s.x },${ s.y } ${ t.x },${ t.y }"
      case Path(s, t, Some(c)) => s"M ${ s.x },${ s.y } S ${ c.x },${ c.y } ${ t.x },${ t.y }"
    }
  }

  private def renderLinks(diagram: Diagram,
                          strokeWidth: String,
                          markers: Boolean,
                          opacityOfHiddenObjects: Double = 0
                         ): String = diagram.links.map { link =>
    val opacity = if (link.border) opacityOfHiddenObjects else 1
    val pd = pathDescription(diagram, link)
    val markers = {
      val twists = {
        if (link.nrOfTwists > 3) 3
        else link.nrOfTwists
      }

      if (twists <= 0) ""
      else s"; marker-mid: url('#twist-$twists')"
    }
    val extraClass =  if (link.getClass.getSimpleName.startsWith("White")) link.getClass.getSimpleName else ""
    // TODO no stroke color/width would allow styling threads with CSS
    // what in turn allows changes without repeating the simulation
    // stand-alone SVG does require stroke details
    s"""<path
       | class="${link.cssClass} $extraClass"
       | id="n${link.source}-n${link.target}"
       | d="$pd"
       | style="stroke: rgb(0, 0, 0); stroke-width: $strokeWidth; fill: none; opacity: $opacity$markers"
       |></path>""".stripMargin
  }.mkString

  private def renderNodes(nodes: Seq[NodeProps],
                          opacityOfHiddenObjects: Double = 0
                         ): String = nodes.zipWithIndex.map { case(node, i) =>
    val opacity = if (node.bobbin || node.pin) 1 else opacityOfHiddenObjects
    val stroke = if (node.bobbin) "rgb(0, 0, 0); stroke-width: 2px" else "none"
    val title = if (node.bobbin) node.cssClasses.replaceAll(".*d", "thread ")
                else {
                  if (node.isLeftTwist) "left "
                  else if (node.isRightTwist) "right "
                       else ""

                } + node.title
    val extraClass = if (title.contains("cross") || title.contains("twist"))
                       " ct-" + node.id.substring(0, node.id.length - 1)
                     else ""
    val event = if (title.contains("cross") || title.contains("twist")) ""
                else if (title.contains("thread")) "onclick='clickedThread(event)'"
                else "onclick='clickedStitch(event)'"
    if (extraClass == "" && !title.contains("thread"))
      s"""<g $event
         | class="${ node.cssClasses }"
         | id="n$i"
         | transform="translate(${ node.x },${ node.y })"
         |><title>$title</title><g transform="scale(1.5)">${ PairSvg.shapes(title.replaceAll(" .*", "")) }</g></g>""".stripMargin
    else
    s"""<path $event
       | class="${node.cssClasses}$extraClass"
       | id="n$i"
       | d="${shape(node)}"
       | style="fill: rgb(0, 0, 0); stroke: $stroke; opacity: $opacity"
       | transform="translate(${node.x},${node.y})"
       |><title>$title</title></path>""".stripMargin
  }.mkString

  /** Prefix required when writing to an SVG file */
  val prolog = "<?xml version='1.0' encoding='UTF-8'?>"

  /** @param diagram     collections of nodes and links
    * @param strokeWidth recommended values: "1px" for pair diagrams, "2px" for thread diagrams
    *                    thicker lines improve zooming out
    *                    the color code width for pair diagram is slightly more than 1px
    *                    the gap for a thread behind another is about 7px
    * @param markers     if true color coding of pair diagrams is rendered
    *                    which can slow down animation significantly
    *                    and breaks animation on IE, see issue #52
    * @return an SVG document as String
    */
  @JSExport
  def render(diagram: Diagram,
             strokeWidth: String = "1px",
             markers: Boolean = true,
             width: Int = 744,
             height: Int = 1052,
             opacityOfHiddenObjects: Double = 0
            ): String =
  s"""
     |<svg
     | id="svg2"
     | version="1.1"
     | width="$width"
     | height="$height"
     | pointer-events="all"
     | xmlns="http://www.w3.org/2000/svg"
     | xmlns:svg="http://www.w3.org/2000/svg"
     | xmlns:xlink="http://www.w3.org/1999/xlink"
     |>
     |<g>
     |$markerDefinitions
     |${renderLinks(diagram, strokeWidth, markers, opacityOfHiddenObjects)}
     |${renderNodes(diagram.nodes, opacityOfHiddenObjects)}
     |</g>
     |</svg>""".stripMargin.stripLineEnd
}
