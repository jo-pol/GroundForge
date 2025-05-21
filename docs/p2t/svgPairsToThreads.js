function generateStitch(stitchInputValue) {
    let stitch = stitchInputValue
        .toLowerCase()
        .replace(/[^clrt]/g, '');
    const n = stitch.length; // Number of nodes on each of the 4 paths
    const size = 180 // width/heigth of the container
    const nodeSpacing = size / (n + 1); // Vertical spacing between subnodes
    const pathSpacing = size / 3; // Horizontal spacing between paths
    const edgeStartIndex = {}; // Index for edges starting at nodes
    const edgeEndIndex = {}; // Index for edges ending at nodes

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    document.body.appendChild(svg);
    svg.setAttribute("width", size + "");
    svg.setAttribute("height", size + "");
    svg.setAttribute("xmlns", svgNS);

    function drawLine(x, y) {
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", x);
        line.setAttribute("y1", (y - nodeSpacing) + '');
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "black");
        line.setAttribute("stroke-width", "4");
        line.setAttribute("opacity", "0.3");
        svg.appendChild(line);
        return line;
    }

    function drawCircle(x, y, id, description) {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x + '');
        circle.setAttribute("cy", y + '');
        circle.setAttribute("r", "8");
        circle.setAttribute("fill", "blue");
        circle.setAttribute("opacity", "0.3");
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

        function updateEdges(nodeId, edgeIndex, attrX, attrY, classPrefix) {
            if (edgeIndex[nodeId]) {
                edgeIndex[nodeId].forEach(edge => {
                    edge.setAttribute(attrX, midX);
                    edge.setAttribute(attrY, midY);
                    edge.classList.add(classPrefix + id);
                });
                delete edgeIndex[nodeId]; // Remove old node from index
            }
        }

        // TODO add white-start/end dependnig on description.replace(/.* /,´' ), if possible even bend-left/right
        updateEdges(leftNodeId, edgeStartIndex, "x1", "y1", "starts_left_at_");
        updateEdges(leftNodeId, edgeEndIndex, "x2", "y2", "ends_left_at_");
        updateEdges(rightNodeId, edgeStartIndex, "x1", "y1", "starts_right_at_");
        updateEdges(rightNodeId, edgeEndIndex, "x2", "y2", "ends_right_at_");

        leftNode.remove();
        rightNode.remove();
    }

    function addToEdgeIndex(nodeIndex, pathIndex, line, edgeIndex) {
        const startNodeId = `${nodeIndex}-${pathIndex}`;
        if (!edgeIndex[startNodeId]) edgeIndex[startNodeId] = [];
        edgeIndex[startNodeId].push(line);
    }

    // Create 4 paths each with the number of subnodes needed by the stitch
    for (let pathIndex = 0; pathIndex < 4; pathIndex++) {
        const x = (pathIndex) * pathSpacing; // X-coordinate for the current path

        for (let nodeIndex = 0; nodeIndex < n; nodeIndex++) {
            const y = (nodeIndex + 1) * nodeSpacing; // Y-coordinate for the current subnode
            drawCircle(x, y, nodeIndex + '-' + pathIndex);

            // Draw an edge to the node
            const line = drawLine(x, y);
            line.setAttribute("class", "kissing_path_" + pathIndex);
            if (nodeIndex > 0) addToEdgeIndex(nodeIndex - 1, pathIndex, line, edgeStartIndex);
            addToEdgeIndex(nodeIndex, pathIndex, line, edgeEndIndex);
        }
        // Draw an edge out of the last node
        const line = drawLine(x, (n + 1) * nodeSpacing);
        line.setAttribute("class", "kissing_path_" + pathIndex);
        addToEdgeIndex(n - 1, pathIndex, line, edgeStartIndex);
    }

    let j = 0
    for (let i = 0; i < n; i++) {
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
    Object.keys(edgeStartIndex).forEach(nodeId => {
        if (edgeStartIndex[nodeId] && edgeEndIndex[nodeId]) {
            const outgoingEdges = edgeStartIndex[nodeId];
            const incomingEdges = edgeEndIndex[nodeId];

            incomingEdges.forEach(inEdge => {
                outgoingEdges.forEach(outEdge => {
                    // Merge the edges by connecting the start of inEdge to the end of outEdge
                    outEdge.setAttribute("x1", inEdge.getAttribute("x1"));
                    outEdge.setAttribute("y1", inEdge.getAttribute("y1"));
                    inEdge.classList.forEach(className => {
                        outEdge.classList.add(className);
                    });
                    inEdge.remove()
                });
            });
            delete edgeStartIndex[nodeId];
            delete edgeEndIndex[nodeId];
            svg.getElementById(nodeId).remove();
        }
    });

    // Replace all line elements with path elements
    svg.querySelectorAll("line").forEach(line => {
        // TODO apply white-start/end once these classes are assigned
        const x1 = line.getAttribute("x1");
        const y1 = line.getAttribute("y1");
        const x2 = line.getAttribute("x2");
        const y2 = line.getAttribute("y2");

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
        path.setAttribute("stroke", line.getAttribute("stroke"));
        path.setAttribute("stroke-width", line.getAttribute("stroke-width"));
        path.setAttribute("opacity", line.getAttribute("opacity"));
        path.setAttribute("fill", "none");
        path.setAttribute("class", line.getAttribute("class"));

        // bend the line if it is a repetition of the same type of stitch
        const classes = Array.from(line.classList);
        if (classes.length > 2) {
            // we skip the first class, which ends with the path number, the others are starts/ends_at_<nodeId>
            const id0 = classes[1].replace(/.*_/g, "");
            const id1 = classes[2].replace(/.*_/g, "");
            const n0 = svg.getElementById(id0).classList[0]
            const n1 = svg.getElementById(id1).classList[0]
            if (n0 === n1 && classes[1].includes("starts_left")) { // TODO seems to work but why?
                // Calculate the midpoint of the line segment
                const mx = (parseFloat(x1) + parseFloat(x2)) / 2;
                const my = (parseFloat(y1) + parseFloat(y2)) / 2;

                // Calculate the direction vector of the line segment
                const dx = parseFloat(x2) - parseFloat(x1);
                const dy = parseFloat(y2) - parseFloat(y1);

                // Normalize and rotate the direction vector to get the perpendicular vector
                const length = Math.sqrt(dx * dx + dy * dy);
                const px = dy / length * 20; // Perpendicular x (scaled by 20)
                const py = dx / length * 20;  // Perpendicular y (scaled by 20)

                // Adjust the control point by the perpendicular offset TODO switch +/- for other direction
                const cx = mx + px;
                const cy = my - py;

                path.setAttribute("d", `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
            }
        }

        line.replaceWith(path);
    });
}