import { globalGraph, rawData } from './store';
import type { Constellation } from './Constellation';
import type { Graph, Link, Node } from './Graph';

rawData.subscribe((s) => {
    globalGraph.set(buildGraph(s));
});

function buildShortName(shortName: string | undefined, name: string): string {
    if (shortName != null && shortName != '' && typeof shortName != 'undefined') {
        return shortName;
    }
    if (name.length > 21) {
        return name.substring(0, 9) + '...' + name.substring(name.length - 9);
    }
    return name;

}

// converts the Constellation to a Graph
function buildGraph(data: Constellation): Graph {
    let nodes: Node[] = [];
    let links: Link[] = [];

    for (let int of data.interfaces) {
        let icon = 'API--1';
        if (int.type == 'topic') {
            icon = 'query-queue';
        } else if (int.type == 'db') {
            icon = 'data--base';
        } else if (int.type == 'rest') {
            icon = 'api';
        } else {
            icon = 'question';
        }
        if (int.icon != null && int.icon != '') {
            icon = int.icon;
        }
        let labels = [];
        if (int.labels != null) {
            for (let [key, value] of Object.entries(int.labels)) {
                labels.push({ key: key, value: value });
            }
        }
        nodes.push({
            id: int.id,
            shortName: buildShortName(int.shortName, int.name),
            name: int.name,
            description: int.description,
            type: int.type,
            color: int.color == '' || int.color == null ? '#4B5563' : int.color,
            icon: icon,
            data: int,
            labels: labels,
            includeSources: false, includeTargets: false, selected: false
        });
    }

    for (let p of data.processes) {
        let labels = [];
        if (p.labels != null) {
            for (let [key, value] of Object.entries(p.labels)) {
                labels.push({ key: key, value: value });
            }
        }
        nodes.push({
            id: p.id,
            name: p.name,
            shortName: buildShortName(p.shortName, p.name),
            description: p.description,
            type: p.type,
            color: p.color == '' || p.color == null ? '#4B5563' : p.color,
            icon: 'wind-stream',
            data: p,
            labels: labels,
            includeSources: false, includeTargets: false, selected: false
        });
        for (let i of p.inputs) {
            links.push(
                {
                    sourceId: i.source,
                    source: i.source,
                    targetId: p.id,
                    target: p.id,
                    name: i.info,
                    trigger: i.trigger
                }
            );
        }
        for (let o of p.outputs) {
            links.push(
                {
                    sourceId: p.id,
                    source: p.id,
                    targetId: o.target,
                    target: o.target,
                    name: o.info,
                    trigger: o.trigger
                });
        }
    }

// add missing nodes
    for (let l of links) {
        if (!nodes.some((n) => n.id == l.sourceId)) {
            nodes.push({
                id: l.sourceId,
                name: l.sourceId,
                shortName: buildShortName(undefined, l.sourceId),
                type: 'unknown',
                color: '#4B5563',
                icon: 'help',
                includeSources: false,
                includeTargets: false,
                labels: [],
                selected: false
            });
        }
        if (!nodes.some((n) => n.id == l.target)) {
            nodes.push({
                id: l.targetId,
                name: l.targetId,
                shortName: buildShortName(undefined, l.targetId),
                type: 'unknown',
                color: '#4B5563',
                icon: 'help',
                includeSources: false,
                includeTargets: false,
                labels: [],
                selected: false
            });
        }
    }

    nodes.sort((a, b) => {
        if (a.id < b.id) {
            return -1;
        }
        if (a.id > b.id) {
            return 1;
        }
        return 0;
    });
    return { nodes: nodes, links: links };
}
