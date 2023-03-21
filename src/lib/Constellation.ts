export interface Constellation {
    interfaces: DataInterfaceDefinition[];
    processes: DataProcessDefinition[];
}

interface InputInfo {
    source: string;
    info: string;
    lag?: number;
    trigger?: boolean;
}

interface OutputInfo {
    target: string;
    info: string;
    trigger?: boolean;
}

export interface DataProcessDefinition {
    id: string;
    name: string;
    shortName?: string;
    type: string;
    icon: string;
    color?: string;
    inputs: InputInfo[];
    outputs: OutputInfo[];
    labels?: Map<string, number>;
    kubernetesInfo?: KubernetesInfo[];
    description?: string;
}

export interface DataInterfaceDefinition {
    id: string;
    name: string;
    shortName?: string;
    type: string;
    icon: string;
    color?: string;
    labels?: Map<string, number>;
    kubernetesInfo?: KubernetesInfo[];
    description?: string;
}

interface KubernetesInfo {
    namespace: string;
    apiVersion: string;
    kind: string;
    labels?: Map<string, number>;
    name: string;
}