# B+ Tree GraphViz Generator

Generate GraphViz programs for B+ Trees.

## Usage
Read input from a file
```
node bplus-gviz.js graph.json | dot -Tpng > output.png
```
Pipe input to STDIN
```
cat graph.json | node bplus-gviz.js | dot -Tpng > output.png
```

### Input format
#### Tree
##### `q` (number, required)
The number of elements per node
##### `root` (Node, required)
The root node of the tree

#### Node
##### `items` (array, required)
The elements of the node. Each element can be a number, boolean, string, or object of the
form `{"value": <val>, "highlight": <boolean>}`

##### `children` (array of Nodes, optional)
The child nodes
##### `highlight` (boolean, optional)
Whether to highlight this node
##### `minlen` (number, optional)
Minimum length of the edge connecting this node to the next leaf (only valid if the node
is a leaf node)

## Examples

### Simple ([source](/examples/1-simple.json))
![Simple](/examples/1-simple.png)

### Custom Edge Length ([source](/examples/2-edge-length.json))
![Custom Edge Length](/examples/2-edge-length.png)

### Highlight Information ([source](/examples/3-highlight.json))
![Highlight Information](/examples/3-highlight.png)

### Custom Cell Dimensions ([source](/examples/4-width-height.json))
![Custom Cell Dimensions](/examples/4-width-height.png)
