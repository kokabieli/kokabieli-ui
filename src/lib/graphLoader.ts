import type { ConstellationInfo, ConstellationResult } from "./interface";
import { availableConstellations, rawData, selectedConstellation } from "./store";
import { queryParam, ssp } from "sveltekit-search-params";

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

export async function refetchData() {
  selectedConstellation.update((value) => {
    if (value) {
      fetchData(value);
    }
    return value;
  });
}

export async function resetGraph() {
  const file = queryParam("file", ssp.string(""));
  file.set("");
  rawData.set({ dataInterfaceList: [], dataProcessList: [] });
  await fetchIndex();
}