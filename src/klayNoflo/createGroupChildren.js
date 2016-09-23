import { cleanArray } from '../utils'

// Encode groups

export default function createGroupChildren(kGraph) {
  return (graph, options, countIdx, idx, currentChildren) => {
    let countGroups = 0
    // Mark the nodes already in groups to avoid the same node in many groups
    const nodesInGroups = []

    return graph.groups.map((group) => {
      // Create a node to use as a subgraph
      const node = {
        id: `group${countGroups}`,
        children: [],
        edges: []
      }
      // Build the node/subgraph
      group.nodes.map((n) => {
        const nodeT = kGraph.children[idx[n]]
        if (nodeT === null) {
          return
        }
        if (nodesInGroups.indexOf(nodeT) >= 0) {
          return
        }
        nodesInGroups.push(nodeT)
        node.children.push(nodeT)
        node.edges.push(kGraph.edges.filter((edge) => {
          if (edge) {
            if ((edge.source === n) || (edge.target === n)) {
              return edge
            }
          }
        })[0])
        node.edges = cleanArray(node.edges)

        // Mark nodes inside the group to be removed from the graph
        currentChildren[idx[n]] = null
      })

      // Mark edges too
      node.edges.map((edge) => {
        if (edge) {
          kGraph.edges[parseInt(edge.id.substr(1), 10)] = null
        }
      })

      countGroups += 1

      // Add node/subgraph to the graph
      return node
    })
  }
}
