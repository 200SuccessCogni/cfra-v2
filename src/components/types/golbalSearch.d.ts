export type GlobalSearchPropsType = {
    selectedLocation: SelectedLocation;
    recommendedItems: earchDataType[];
    searchItemResult: SearchDataType[];
    // allLocations?: SearchDataType[];
    others?: any[];
    loading?: boolean;
    onChange: (searchQuery: string) => void;
    onSelect: (searchQuery: SearchDataType) => void;
};

export type SearchDataType = {
    locationId: string;
    locationName: string;
    locationAddress: string;
    locationImg: string;
};

export type SelectedLocation = {
    locationId: string;
    locationName: string;
    locationAddress: string;
};
