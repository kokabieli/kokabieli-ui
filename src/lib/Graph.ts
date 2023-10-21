import type { ConstellationInterface, ConstellationDataProcess } from './interface';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

export interface Graph {
    nodes: Node[];
    links: Link[];
}

export interface Node extends SimulationNodeDatum{
    id: string;
    name: string;
    shortName: string;
    description?: string;
    type: string;
    color: string;
    icon: string;
    data?: ConstellationDataProcess | ConstellationInterface;
    labels: Label[];
    selected: boolean;
    matched?: string;
    includeSources: boolean;
    includeTargets: boolean;
    source: string;
    isInterface: boolean;
    isProcess: boolean;
}

export interface Label {
    key: string;
    value: string;
}

export interface Link extends SimulationLinkDatum<Node> {
    sourceId: string;
    targetId: string;
    name: string;
    trigger?: boolean;
}