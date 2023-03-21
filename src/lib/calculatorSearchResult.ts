import {
    includeNeighbours,
    labelsFilter,
    rawSearch,
    search,
    searchFrom,
    searchParams,
    searchTo,
    triggersOnly
} from './store';
import type { SearchParserResult } from 'search-query-parser';
import { parse, stringify } from 'search-query-parser';
import type { SearchParams } from './Search';


let keywords = ['from', 'to', 'type', 'label', 'noNeighbours', 'triggersOnly'];
let lastSearch = '';
search.subscribe((s) => {
    if (lastSearch == s) {
        return;
    }
    let newQuery: SearchParserResult = parse(s, {
        keywords: keywords,
        alwaysArray: true,
        tokenize: true
    });
    rawSearch.set({ detail: newQuery, source: 'search' });
    lastSearch = s;
});

let lastParsed = {};
rawSearch.subscribe((spe) => {
    let s = spe.detail;
    if (spe.source != 'search') {
        search.set(stringify(s, { keywords: keywords, alwaysArray: true, tokenize: true }));
    }
    let noNeighbours = s.noNeighbours != null && s.noNeighbours.length > 0;
    let triggersOnlyVal = s.triggersOnly != null && s.triggersOnly.length > 0;
    let params: SearchParams = {
        filtered: false,
        text: s.text != null ? (typeof s.text == 'string' ? [s.text] : s.text.length == 1 && s.text[0] == '' ? [] : s.text) : [],
        includeNeighbours: !noNeighbours,
        triggersOnly: triggersOnlyVal,
        from: s.from != null ? s.from : [],
        to: s.to != null ? s.to : [],
        labels: s.label != null ? s.label : []
    };
    params.filtered = params.text.length > 0 || params.from.length > 0 || params.to.length > 0 || params.labels.length > 0;

    if (spe.source != 'triggersOnly') {
        triggersOnly.set(triggersOnlyVal);
    }
    if (spe.source != 'includeNeighbours') {
        includeNeighbours.set(!noNeighbours);
    }
    if (spe.source != 'searchFrom') {
        searchFrom.set(params.from.length > 0 ? params.from[0] : '');
    }
    if (spe.source != 'searchTo') {
        searchTo.set(params.to.length > 0 ? params.to[0] : '');
    }
    if (spe.source != 'labelsFilter') {
        labelsFilter.set(params.labels);
    }
    searchParams.set(params);
});

export function clearFromTo() {
    rawSearch.update((p)=>{
        p.source = 'clearFromTo';
        p.detail.from = [];
        p.detail.to = [];
        return p;
    })
}

searchFrom.subscribe((s) => {
    if (s != '') {
        rawSearch.update((p) => {
            return {
                source: 'searchFrom',
                detail: {
                    from: [s]
                }
            };
        });
    }
});

searchTo.subscribe((s) => {
    if (s != '') {
        rawSearch.update((p) => {
            return {
                source: 'searchTo',
                detail: {
                    to: [s]
                }
            };
        });
    }
});


triggersOnly.subscribe((s) => {
    rawSearch.update((p) => {
        p.source = 'triggersOnly';
        if (s) {
            p.detail.triggersOnly = ['yes'];
        } else {
            p.detail.triggersOnly = [];
        }
        return p;
    });
});
includeNeighbours.subscribe((s) => {
    rawSearch.update((p) => {
        p.source = 'includeNeighbours';
        if (s) {
            p.detail.noNeighbours = [];
        } else {
            p.detail.noNeighbours = ['yes'];
        }
        return p;
    });
});

labelsFilter.subscribe((s) => {
    rawSearch.update((p) => {
        p.source = 'labelsFilter';
        p.detail.label = s;
        return p;
    });
});