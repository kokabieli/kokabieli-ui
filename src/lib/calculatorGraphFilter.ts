import type { Graph, Node } from './Graph';
import { globalGraph, searchParams, selectedGraph } from './store';
import type { SearchParams } from './Search';


let fullData: Graph = {
    nodes: [],
    links: []
};
let search: SearchParams = {
    labels: [],
    from: [], to: [], filtered: false, includeNeighbours: true,
    text: [], triggersOnly: false
};

globalGraph.subscribe((s) => {
    fullData = s;
    selectedGraph.set(rebuildFilteredGraph(fullData, search));
});

searchParams.subscribe((s) => {
    search = s;
    selectedGraph.set(rebuildFilteredGraph(fullData, search));
});

function rebuildFilteredGraph(fullData: Graph, parsedQuery: SearchParams): Graph {
    let matchedNodes: Node[] = [];
    for (let n of fullData.nodes) {
        n.selected = false;
        n.matched = '';
        n.includeSources = false;
        n.includeTargets = false;
        if (matchNode(parsedQuery, n) && matchLabels(parsedQuery, n)) {
            n.selected = true;
            matchedNodes.push(n);
        } else if (!parsedQuery.filtered) {
            matchedNodes.push(n);
        }
    }
    //console.log('matched nodes: ' + matchedNodes.length);
    let foundNew = false;
    let iteration = 0;
    do {
        foundNew = false;
        iteration++;
        for (let i = 0; i < matchedNodes.length; i++) {
            let matchedNode = matchedNodes[i];
            if (matchedNode.includeSources) {
                for (let link of fullData.links) {
                    if (link.target == matchedNode.id) {
                        if (!search.triggersOnly || (search.triggersOnly && link.trigger)) {
                            let items = fullData.nodes.find(n => n.id == link.source);
                            if (items != null) {
                                if (!items.includeSources) {
                                    items.includeSources = true;
                                    foundNew = true;
                                }
                                if (matchedNodes.find(n => n.id == link.source) == null) {
                                    matchedNodes.push(items);
                                }
                            }
                        }
                    }
                }
            }
            if (matchedNode.includeTargets) {
                for (let link of fullData.links) {
                    if (link.source == matchedNode.id) {
                        if (!search.triggersOnly || (search.triggersOnly && link.trigger)) {
                            let items = fullData.nodes.find(n => n.id == link.target);
                            if (items != null) {
                                if (!items.includeTargets) {
                                    items.includeTargets = true;
                                    foundNew = true;
                                }
                                if (matchedNodes.find(n => n.id == link.target) == null) {
                                    matchedNodes.push(items);
                                }
                            }
                        }
                    }
                }
            }
        }
        //console.log(iteration + ' iteration ' + matchedNodes.length + ' matched nodes');
    }
    while (foundNew && iteration < 100) ;

    //console.log('selected nodes: ' + matchedNodes.length);
    return buildSelected(matchedNodes, search.includeNeighbours);
}


function matchLabels(params: SearchParams, node: Node, defaultMatch: boolean = true) {
    if (params.labels.length > 0) {
        for (let label of params.labels) {
            let split = label.split('=');
            if (split.length == 2) {
                if (node.labels.find(l => l.key == split[0] && l.value == split[1])) {
                    node.matched = node.matched + ' label full';
                    return true;
                }
            } else {
                if (node.labels.find(l => l.key == split[0])) {
                    node.matched = node.matched + ' label';
                    return true;
                }
            }
        }
        return false;
    }
    return defaultMatch;
}

function matchNode(param: SearchParams, node: Node) {
    if (param.text.length > 0) {
        for (let f of param.text) {
            if ((`${node.id}|${node.name}|${node.description}`.toLowerCase()).toLowerCase().includes(f.toLowerCase())) {
                node.matched = 'text';
                return true;
            }
        }
        return false;
    }
    if (param.from.length > 0) {
        for (let f of param.from) {
            if (node.id.toLowerCase() == f.toLowerCase()) {
                node.includeTargets = true;
                node.matched = 'from';
                return true;
            }
        }
        return false;
    }
    if (param.to.length > 0) {
        for (let t of param.to) {
            if (node.id.toLowerCase() == t.toLowerCase()) {
                node.includeSources = true;
                node.matched = 'to';
                return true;
            }
        }
        return false;
    }
    return matchLabels(param, node, false);
}

function buildSelected(matchedNodes: Node[], includeNeighbours: boolean): Graph {
    let searchNodes = [...matchedNodes];
    let searchLinks = [];
    if (includeNeighbours) {
        for (let n of matchedNodes) {
            for (let l of fullData.links) {
                if (l.source === n.id) {
                    if (searchNodes.find(n => n.id === l.target) == null) {
                        let s = fullData.nodes.find(n => n.id === l.target);
                        if (s != null) {
                            searchNodes.push(s);
                        }
                    }
                    if (searchLinks.find(ll => l.source === ll.source && l.target === ll.target) == null) {
                        searchLinks.push(l);
                    }
                }
                if (l.target === n.id) {
                    if (searchNodes.find(n => n.id === l.source) == null) {
                        let s = fullData.nodes.find(n => n.id === l.source);
                        if (s != null) {
                            searchNodes.push(s);
                        }
                    }
                    if (searchLinks.find(ll => l.source === ll.source && l.target === ll.target) == null) {
                        searchLinks.push(l);
                    }
                }
            }
        }
    } else {
        for (let n of matchedNodes) {
            for (let l of fullData.links) {
                if (l.source === n.id && matchedNodes.find(n => n.id === l.target) != null) {
                    if (searchLinks.find(l => l.source === n.id && l.target === n.id) == null) {
                        searchLinks.push(l);
                    }
                }
                if (l.target === n.id && matchedNodes.find(n => n.id === l.source) != null) {
                    if (searchLinks.find(l => l.source === n.id && l.target === n.id) == null) {
                        searchLinks.push(l);
                    }
                }
            }
        }
    }
    return { nodes: searchNodes, links: searchLinks };
}