export type GlobalSearchPropsType = {
    selectedEntity: SelectedEntity | null;
    recommendedItems: SearchDataType[];
    searchItemResult: SearchDataType[];
    inputProps: React.HTMLProps<HTMLInputElement>;
    // allLocations?: SearchDataType[];
    others?: any[];
    loading?: boolean;
    controlKey?: string;
    onChange: (searchQuery: string) => void;
    onSelect: (searchQuery: SearchDataType) => void;
};

export type SearchDataType = {
    entityId: string;
    entityName: string;
    entityAddress?: string;
    entityImg?: string;
};

export type SelectedEntity = {
    entityId: string;
    entityName: string;
    entityAddress?: string;
};
