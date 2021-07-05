export interface JsonPatchDocument {
    value: any;
    path: string;
    op: 'replace' | 'add' | 'remove' | 'move' | 'copy' | 'test';
}

export const converObjectToReplaceJsonPatch : (object: {}) => JsonPatchDocument[] = (object) => {
    return Object.entries(object).map(kvp => ({ op: 'replace', path: '/' + kvp[0], value: kvp[1] }));
}