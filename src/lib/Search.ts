import type { SearchParserResult } from 'search-query-parser';

export interface SearchParams {
    includeNeighbours: boolean;
    triggersOnly: boolean;
    from: string[];
    to: string[];
    text: string[];
    filtered: boolean;
    labels: string[];
}

export interface SearchParseEvent {
    detail: SearchParserResult;
    source: string;
}