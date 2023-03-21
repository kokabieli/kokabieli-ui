import type { Constellation } from './Constellation';
import { rawData } from './store';

let data: Constellation = { interfaces: [], processes: [] };

export async function fetchData() {
    const res = await fetch(`/api/constellation`);
    let newData = await res.json();
    // compare md5 hashes to see if data has changed
    if (JSON.stringify(data) !== JSON.stringify(newData)) {
        data = newData;
        rawData.set(data);
    }
}