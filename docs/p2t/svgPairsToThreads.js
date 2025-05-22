function generateStitch(stitchInputValue, kissingPathColors) {
    let stitch = stitchInputValue
        .toLowerCase()
        .replace(/[^clrt]/g, '');
    const nrOfInitialPathNodes = stitch.length;
    const containerSize = 180 // width/height
    const nodeSpacing = containerSize / (nrOfInitialPathNodes + 1); // Vertical spacing between subnodes
    const pathSpacing = containerSize / 3; // Horizontal spacing between paths
    const edgeStartMap = {}; // Index for edges starting at nodes
    const edgeEndMap = {}; // Index for edges ending at nodes

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    document.body.appendChild(svg);
    svg.setAttribute("width", containerSize + "");
    svg.setAttribute("height", containerSize + "");
    svg.setAttribute("xmlns", svgNS);

    function drawLine(x, y) {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", (y - nodeSpacing) + '');
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "4");
        svg.appendChild(line);
        return line;
    }

    function drawCircle(x, y, id, description) {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x + '');
        circle.setAttribute("cy", y + '');
        circle.setAttribute("r", "7");
        circle.setAttribute("fill", "black");
        circle.setAttribute("opacity", "0.15");
        circle.setAttribute("id", id);
        circle.setAttribute("class", (description ? description : '').replace(/.* /g, ''));
        const title = document.createElementNS(svgNS, "title");
        title.textContent = `${description} - ${id}`;
        circle.appendChild(title);
        svg.appendChild(circle);
    }

    function mergeNodes(leftNodeId, rightNodeId, id, description) {
        const leftNode = svg.getElementById(leftNodeId);
        const rightNode = svg.getElementById(rightNodeId);

        if (!leftNode || !rightNode) {
            console.error("One or both nodes not found");
            return;
        }

        // Get the coordinates of the left and right nodes
        const leftX = parseFloat(leftNode.getAttribute("cx"));
        const leftY = parseFloat(leftNode.getAttribute("cy"));
        const rightX = parseFloat(rightNode.getAttribute("cx"));
        const rightY = parseFloat(rightNode.getAttribute("cy"));

        const midX = (leftX + rightX) / 2;
        const midY = (leftY + rightY) / 2;
        drawCircle(midX, midY, id, description);

        function updateEdge(nodeId, edgeMap, attrX, attrY, classPrefix) {
            const edge = edgeMap[nodeId];
            if (edge) {
                edge.setAttribute(attrX, midX);
                edge.setAttribute(attrY, midY);
                edge.classList.add(classPrefix + id);
                delete edgeMap[nodeId];
            }
            return edge;
        }

        const end = "white_end";
        const st = "white_start";
        const isCross = description === "cross";
        updateEdge(leftNodeId, edgeStartMap, "x1", "y1", "starts_left_at_").classList.add(isCross ? end : st);
        updateEdge(leftNodeId, edgeEndMap, "x2", "y2", "ends_left_at_").classList.add(isCross ? end : st);
        updateEdge(rightNodeId, edgeStartMap, "x1", "y1", "starts_right_at_").classList.add(isCross ? st : end);
        updateEdge(rightNodeId, edgeEndMap, "x2", "y2", "ends_right_at_").classList.add(isCross ? st : end);

        leftNode.remove();
        rightNode.remove();
    }

    function addToEdgeMap(nodeMap, pathMap, line, edgeMap) {
        const startNodeId = `${nodeMap}-${pathMap}`;
        if (!edgeMap[startNodeId]) edgeMap[startNodeId] = [];
        edgeMap[startNodeId] = line;
    }

    // Create 4 paths each with the number of subnodes needed by the stitch
    for (let pathMap = 0; pathMap < 4; pathMap++) {
        const x = (pathMap) * pathSpacing; // X-coordinate for the current path

        for (let nodeNr = 0; nodeNr < nrOfInitialPathNodes; nodeNr++) {
            const y = (nodeNr + 1) * nodeSpacing; // Y-coordinate for the current subnode
            drawCircle(x, y, nodeNr + '-' + pathMap);

            // Draw an edge to the node
            const line = drawLine(x, y);
            line.setAttribute("class", "kissing_path_" + pathMap);
            line.setAttribute("stroke", kissingPathColors[pathMap]);
            if (nodeNr > 0) addToEdgeMap(nodeNr - 1, pathMap, line, edgeStartMap);
            addToEdgeMap(nodeNr, pathMap, line, edgeEndMap);
        }
        // Draw an edge out of the last node
        const line = drawLine(x, (nrOfInitialPathNodes + 1) * nodeSpacing);
        line.setAttribute("class", "kissing_path_" + pathMap);
        addToEdgeMap(nrOfInitialPathNodes - 1, pathMap, line, edgeStartMap);
        line.setAttribute("stroke", kissingPathColors[pathMap]);
    }

    let j = 0
    for (let i = 0; i < nrOfInitialPathNodes; i++) {
        switch (stitch[i]) {
            case 'c':
                mergeNodes(i + '-1', i + '-2', ++j, 'cross');
                break;
            case 'l':
                mergeNodes(i + '-0', i + '-1', ++j, 'left twist');
                break;
            case 'r':
                mergeNodes(i + '-2', i + '-3', ++j, 'right twist');
                break;
            case 't':
                mergeNodes(i + '-0', i + '-1', ++j, 'left twist');
                mergeNodes(i + '-2', i + '-3', ++j, 'right twist');
                break;
            default:
                break
        }
    }

    // Cleanup of nodes that did not merge, join their links
    Object.keys(edgeStartMap).forEach(nodeId => {
        if (edgeStartMap[nodeId] && edgeEndMap[nodeId]) {
            const outEdge = edgeStartMap[nodeId];
            const inEdge = edgeEndMap[nodeId];

            // Merge the edges by connecting the start of inEdge to the end of outEdge
            outEdge.setAttribute("x1", inEdge.getAttribute("x1"));
            outEdge.setAttribute("y1", inEdge.getAttribute("y1"));
            inEdge.classList.forEach(className => {
                outEdge.classList.add(className);
            });
            svg.removeChild(inEdge);
            delete edgeStartMap[nodeId];
            delete edgeEndMap[nodeId];
            svg.getElementById(nodeId).remove();
        }
    });

    // Replace all line elements with path elements
    svg.querySelectorAll("line").forEach(line => {
        const x1 = line.getAttribute("x1") * 1;
        const y1 = line.getAttribute("y1") * 1;
        const x2 = line.getAttribute("x2") * 1;
        const y2 = line.getAttribute("y2") * 1;

        // Calculate the direction vector of the line segment
        let dx = (parseFloat(x2) - parseFloat(x1));
        let dy = (parseFloat(y2) - parseFloat(y1));
        const length = Math.sqrt(dx * dx + dy * dy);
        dx = dx / length;
        dy = dy / length;

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("stroke", line.getAttribute("stroke"));
        path.setAttribute("stroke-width", line.getAttribute("stroke-width"));
        path.setAttribute("opacity", line.getAttribute("opacity"));
        path.setAttribute("fill", "none");
        path.setAttribute("class", line.getAttribute("class"));

        const whiteStart = line.classList.contains("white_start");
        const whiteEnd = line.classList.contains("white_end");
        const gap = 8;
        const x1s = !whiteStart ? x1 : x1 + (dx * gap);
        const y1s = !whiteStart ? y1 : y1 + (dy * gap);
        const x2s = !whiteEnd ? x2 : x2 - (dx * gap);
        const y2s = !whiteEnd ? y2 : y2 - (dy * gap);
        path.setAttribute("d", `M ${x1s} ${y1s} L ${x2s} ${y2s}`);

        // bend the line if it is a repetition of the same type of stitch
        const classes = Array.from(line.classList).filter(className => className.includes('_at_'));
        if (classes.length > 1) {
            const id0 = classes[0].replace(/.*_/g, "");
            const id1 = classes[1].replace(/.*_/g, "");
            const n0 = svg.getElementById(id0).classList[0]
            const n1 = svg.getElementById(id1).classList[0]
            const startsLeft = classes[0].includes("starts_left");
            const startsRight = classes[0].includes("starts_right");
            if (n0 === n1 && (startsLeft || startsRight)) { // TODO seems to work but why?
                // Calculate the midpoint of the line segment
                const mx = (parseFloat(x1) + parseFloat(x2)) / 2;
                const my = (parseFloat(y1) + parseFloat(y2)) / 2;

                // Rotate the direction vector to get the perpendicular vector for the control point
                const px = dy * 20; // Perpendicular x (scaled by 20)
                const py = dx * 20;  // Perpendicular y (scaled by 20)

                // note the sings after mx/my
                const fraction = 0.4;
                if (startsLeft) {
                    const x1s = !whiteStart ? x1 : x1 + (mx - px - x1) * fraction;
                    const y1s = !whiteStart ? y1 : y1 + (my + py - y1) * fraction;
                    const x2s = !whiteEnd ? x2 : x2 + (mx - px - x2) * fraction;
                    const y2s = !whiteEnd ? y2 : y2 + (my + py - y2) * fraction;
                    path.setAttribute("d", `M ${x1s} ${y1s} Q ${(mx - px)} ${(my + py)} ${x2s} ${y2s}`);
                } else {
                    const x1s = !whiteStart ? x1 : x1 + (mx + px - x1) * fraction;
                    const y1s = !whiteStart ? y1 : y1 + (my - py - y1) * fraction;
                    const x2s = !whiteEnd ? x2 : x2 + (mx + px - x2) * fraction;
                    const y2s = !whiteEnd ? y2 : y2 + (my - py - y2) * fraction;
                    path.setAttribute("d", `M ${x1s} ${y1s} Q ${(mx + px)} ${(my - py)} ${x2s} ${y2s}`);
                }
            }
        }

        line.replaceWith(path);
    });
}