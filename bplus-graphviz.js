// @ts-nocheck
const { readFileSync } = require("fs");

function genGraph(data) {
  const q = data.q;
  const root = data.root;
  const cellWidth = data.cellWidth || 40;
  const cellHeight = data.cellHeight || 35;

  if (q === undefined || q === 0 || root === undefined) {
    throw new Error("Missing value for q or root");
  }

  const leaves = [];
  return `digraph BTree {
    rankdir = TB;
    ranksep = ${Math.round(((q / 3) * cellWidth) / 40)};
    nodesep = 0.3;
    ${recurse(root, 0, leaves, q, cellWidth, cellHeight)[0]}
    /* Attatch leaf nodes */
    ${leaves.reduce((acc, [curr, minlen], idx, arr) => {
      if (idx !== arr.length - 1) {
        acc += `${curr}:${2 * q} -> ${arr[idx + 1][0]}:0${
          minlen ? ` [minlen=${minlen}]` : ""
        };\n    `;
      }
      return acc;
    }, "")}
    /* Make sure the leaf nodes are aligned vertically */
    {rank = same; ${leaves.map(([name]) => name).join("; ")}}
}`;
}

function main() {
  const path = process.argv[2];
  if (!path || path === "-") {
    const chunks = [];
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (data) => {
      chunks.push(data);
    });

    process.stdin.on("end", () => {
      try {
        console.log(genGraph(JSON.parse(chunks.join(""))));
      } catch (e) {
        console.error("Error while generating graph:");
        console.error(e);
      }
    });
  } else {
    try {
      console.log(
        genGraph(JSON.parse(readFileSync(path, { encoding: "utf8" })))
      );
    } catch (e) {
      console.error("Error while generating graph:");
      console.error(e);
    }
  }
}

function recurse(node, nodeCount, leaves, q, cellWidth, cellHeight) {
  const nodeName = `node${nodeCount}`;

  let ret = `
    ${nodeName} [shape=none, fontsize=18, margin=0, label=<
      <TABLE BORDER="0" COLOR="${
        node.highlight ? "red" : "black"
      }" CELLBORDER="1" CELLSPACING="0" CELLPADDING="4">
        <TR>
          <TD PORT="0" BGCOLOR="lightgrey"></TD>
${[...node.items, ...Array(q - node.items.length).fill(null)]
  .map(
    (item, idx) =>
      `          <TD WIDTH="${cellWidth}" HEIGHT="${cellHeight}" FIXEDSIZE="TRUE" PORT="${
        2 * idx + 1
      }">${
        item && typeof item === "object" && item.highlight
          ? '<FONT COLOR="red">'
          : ""
      }${item && typeof item === "object" ? item.value : item || ""}${
        item && typeof item === "object" && item.highlight ? "</FONT>" : ""
      }</TD>\n          <TD PORT="${2 * idx + 2}" BGCOLOR="lightgrey"></TD>`
  )
  .join("\n")}
        </TR>
      </TABLE>
    >];
`;

  if (node.children && node.children.length > 0) {
    const currNodeNum = nodeCount;
    node.children.forEach((childNode, i) => {
      const [newNode, newNodeCount] = recurse(
        childNode,
        ++nodeCount,
        leaves,
        q,
        cellWidth,
        cellHeight
      );
      ret += newNode;
      ret += `\n    node${currNodeNum}:${i * 2} -> node${nodeCount}:${q};\n`;
      nodeCount = newNodeCount;
    });
  } else {
    leaves.push([nodeName, node.minlen]);
  }

  return [ret, nodeCount];
}

main();
