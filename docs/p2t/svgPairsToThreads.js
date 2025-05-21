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
    const mergedNodes = {}; // Index for merged nodes

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

    function drawCircle(x, y, id, decription) {
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", x + '');
        circle.setAttribute("cy", y + '');
        circle.setAttribute("r", "8");
        circle.setAttribute("fill", "blue");
        circle.setAttribute("opacity", "0.3");
        circle.setAttribute("id", id);
        circle.setAttribute("class", decription);
        const title = document.createElementNS(svgNS, "title");
        title.textContent = `${decription} - ${id}`;
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
        const x1 = line.getAttribute("x1");
        const y1 = line.getAttribute("y1");
        const x2 = line.getAttribute("x2");
        const y2 = line.getAttribute("y2");
        // TODO create white start/ends depending on line and node classes

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
        path.setAttribute("stroke", line.getAttribute("stroke"));
        path.setAttribute("stroke-width", line.getAttribute("stroke-width"));
        path.setAttribute("opacity", line.getAttribute("opacity"));
        path.setAttribute("class", line.getAttribute("class"));

        line.replaceWith(path);
    });
}