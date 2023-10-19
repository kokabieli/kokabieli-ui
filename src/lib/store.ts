import { writable } from "svelte/store";
import type { ConstellationInfo, ConstellationResult } from "./interface";
import type { Graph } from "./Graph";
import type { SearchParams, SearchParseEvent } from "./Search";

export const includeNeighbours = writable(false);
export const triggersOnly = writable(false);
export const showLabels = writable(true);
export const search = writable("");
export const availableConstellations = writable<ConstellationInfo[]>([]);
export const selectedConstellation = writable("");
export const rawData = writable<ConstellationResult>({ dataInterfaceList: [], dataProcessList: [] });
export const globalGraph = writable<Graph>({ nodes: [], links: [] });
export const selectedGraph = writable<Graph>({ nodes: [], links: [] });
export const searchFrom = writable("");
export const searchTo = writable("");
export const labelsFilter = writable<string[]>([]);
export const rawSearch = writable<SearchParseEvent>({ detail: {}, source: "initial" });
export const searchParams = writable<SearchParams>({
    labels: [],
    includeNeighbours: true,
    triggersOnly: false,
    from: [],
    to: [],
    text: [],
    filtered: false
});
