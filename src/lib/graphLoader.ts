import type { ConstellationInfo, ConstellationResult } from "./interface";
import { availableConstellations, rawData } from "./store";

let data: ConstellationResult = { dataProcessList: [], dataInterfaceList: [] };

// fetch and parse index.json
export async function fetchIndex() {
    const res = await fetch(`/constellation-data/index.json`);
    const indexData: ConstellationInfo[] = await res.json();
    console.log(JSON.stringify(indexData));
    availableConstellations.set(indexData);
}

export async function fetchData(constellationFile: string) {
    const res = await fetch(`/constellation-data/` + constellationFile);
    let newData = await res.json();
    // compare md5 hashes to see if constellation-data has changed
    if (JSON.stringify(data) !== JSON.stringify(newData)) {
        data = newData;
        rawData.set(data);
    }
}