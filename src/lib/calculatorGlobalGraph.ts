import { globalGraph, rawData } from "./store";
import type { ConstellationResult } from "./interface";
import type { Graph, Link, Node } from "./Graph";

rawData.subscribe((s) => {
  globalGraph.set(buildGraph(s));
});

function buildShortName(name: string): string {
  if (name.length > 21) {
    return name.substring(0, 9) + "..." + name.substring(name.length - 9);
  }
  return name;

}

// converts the Constellation to a Graph
function buildGraph(data: ConstellationResult): Graph {
  let nodes: Node[] = [];
  let links: Link[] = [];

  for (let int of data.dataInterfaceList) {
    let icon = "API--1";
    if (int.type == "topic") {
      icon = "query-queue";
    } else if (int.type == "db") {
      icon = "data--base";
    } else if (int.type == "rest") {
      icon = "api";
    } else {
      icon = "question";
    }
    let labels = [];
    if (int.labels != null) {
      for (let [key, value] of Object.entries(int.labels)) {
        labels.push({ key: key, value: value });
      }
    }
    nodes.push({
      id: int.reference || "--",
      shortName: buildShortName(int.name || ""),
      name: int.name || "",
      description: int.description,
      type: int.type || "missing",
      color: "#4B5563",
      icon: icon,
      data: int,
      labels: labels,
      includeSources: false, includeTargets: false, selected: false,
      source: int.source?.namespace + "/" + int.source?.name,
      isInterface: true, isProcess: false
    });
  }

  for (let p of data.dataProcessList) {
    let labels = [];
    if (p.labels != null) {
      for (let [key, value] of Object.entries(p.labels)) {
        labels.push({ key: key, value: value });
      }
    }
    let id = p.source?.namespace + "/" + p.source?.name;
    let icon = "wind-stream";
    if (p.type == "missing") {
      icon = "question";
    }
    nodes.push({
      id: id,
      name: p.name || "",
      shortName: buildShortName(p.name || ""),
      description: p.description,
      type: p.type || "missing",
      color: "#4B5563",
      icon: icon,
      data: p,
      labels: labels,
      includeSources: false, includeTargets: false, selected: false,
      source: p.source?.namespace + "/" + p.source?.name,
      isInterface: false, isProcess: true
    });
    for (let i of p.inputs || []) {
      links.push(
        {
          sourceId: i.reference || "",
          source: i.reference || "",
          targetId: id,
          target: id,
          name: i.info || "",
          trigger: i.trigger
        }
      );
    }
    for (let o of p.outputs || []) {
      links.push(
        {
          sourceId: id,
          source: id,
          targetId: o.reference || "",
          target: o.reference || "",
          name: o.info || "",
          trigger: o.trigger
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
