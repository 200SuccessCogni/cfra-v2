import React from "react";
import {
    Button,
    Typography,
    Divider,
    List,
    ListSubheader,
    ListItemButton,
    Avatar,
    Box,
    IconButton,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/system";
import { GlobalSearchPropsType, SearchDataType } from "../types/golbalSearch";
import PlaceIcon from "@mui/icons-material/Place";

const SearchForm = styled("form")({
    alignItems: "center",
    borderRadius: "4px",
    display: "flex",
    height: "56px",
    margin: 0,
    padding: " 0 12px",
    position: "relative",
    width: "100%",
});

const SearchInput = styled("input")({
    appearance: "none",
    background: "transparent",
    border: 0,
    flex: 1,
    font: "inherit",
    fontSize: "1rem",
    height: "100%",
    outline: "none",
    padding: "0 0 0 8px",
    width: "80%",
    // minWidth: "300px",
});

const SearchLabel = styled("label")({
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
});

const SearchItem = ({
    imgUrl = "https://www.rci.com/static/Resorts/Assets/3603E02L.jpg",
    name,
    address,
}: {
    imgUrl: string;
    name: string;
    address: string;
}) => {
    return (
        <ListItemButton>
            <Avatar variant="rounded" src={imgUrl}>
                Hotel
            </Avatar>
            <Box px={2}>
                <Typography variant="body2" fontWeight={500}>
                    {name}
                </Typography>
                <Typography variant="caption">{address}</Typography>
            </Box>
        </ListItemButton>
    );
};

const SearchHeader = ({
    headerText,
    icon,
}: {
    headerText: string;
    icon: React.ReactNode;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                pl: 2,
            }}
        >
            {icon}
            <ListSubheader component="div" id="recent-location">
                {headerText}
            </ListSubheader>
        </Box>
    );
};

function GlobalSearch(props: GlobalSearchPropsType) {
    const searchInpRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [searchText, setSearchText] = React.useState("");
    const [prevSearchItems, setPrevSearchItems] = React.useState([]);
    // const [selectedLocation, setSelectedLocation] = React.useState(null);

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    React.useEffect(() => {
        setTimeout(() => {
            if (open && searchInpRef.current) {
                searchInpRef.current?.focus();
            }
        }, 500);
    }, [open]);

    const onSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(ev.target.value);
        props.onChange(ev.target.value);
    };

    const onClear = () => {
        setSearchText("");
        props.onChange("");
    };

    const onItemClick = (item: SearchDataType) => {
        saveRecentSearch(item);
        setPrevSearchItems(getSavedSearchItems());
        setOpen(false);
        props.onSelect(item);
    };

    const saveRecentSearch = (item: SearchDataType) => {
        const prevRecentSearchItems = localStorage.getItem("prevSearchItems");

        if (prevRecentSearchItems && JSON.parse(prevRecentSearchItems)) {
            const data = [...JSON.parse(prevRecentSearchItems)];
            if (data.length) {
                const isExist = data.some(
                    (l: SearchDataType) =>
                        l.locationName.toLowerCase() ===
                        item.locationName.toLowerCase()
                );
                if (!isExist) data.push(item);
            }

            localStorage.setItem("prevSearchItems", JSON.stringify(data));
        }
    };

    const getSavedSearchItems = () => {
        return (
            (!!localStorage.getItem("prevSearchItems") &&
                JSON.parse(localStorage.getItem("prevSearchItems") || "")) ||
            []
        );
    };

    const SearchItem = ({
        imgUrl = "https://www.rci.com/static/Resorts/Assets/3603E02L.jpg",
        name,
        address,
        onClick,
    }: {
        imgUrl: string;
        name: string;
        address: string;
        onClick: () => void;
    }) => {
        return (
            <ListItemButton onClick={() => onClick()}>
                <Avatar variant="rounded" src={imgUrl}>
                    Hotel
                </Avatar>
                <Box px={2}>
                    <Typography variant="body2" fontWeight={500}>
                        {name}
                    </Typography>
                    <Typography variant="caption">{address}</Typography>
                </Box>
            </ListItemButton>
        );
    };

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setOpen(true)}
                // sx={{ backgroundColor: "secondary.main", borderColor: "#eee" }}
            >
                <SearchIcon />
                <Typography variant="body2" sx={{ px: { xs: 1, md: 2 } }}>
                    {props.selectedLocation?.locationName ||
                        "Search your location..."}
                </Typography>
                <Box sx={{ display: { xs: "none", md: "inline-block" } }}>
                    <kbd>⌘ + k</kbd>
                </Box>
            </Button>
            <Dialog
                open={open}
                fullWidth
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"sm"}
            >
                <header>
                    <SearchForm>
                        <SearchLabel>
                            <SearchIcon />
                        </SearchLabel>
                        <SearchInput
                            placeholder="Search your location..."
                            value={searchText}
                            onChange={onSearch}
                            ref={searchInpRef}
                        />

                        <IconButton
                            sx={{
                                visibility: searchText ? "visible" : "hidden",
                            }}
                            onClick={onClear}
                        >
                            <CloseIcon />
                        </IconButton>
                    </SearchForm>
                </header>
                <Divider />
                <DialogContent sx={{ p: 0 }}>
                    {/* Search result */}
                    {!!props.searchItemResult.length && (
                        <List
                            sx={{
                                width: "100%",
                                bgcolor: "background.paper",
                            }}
                            component="nav"
                            aria-labelledby="suggested-location"
                            subheader={
                                <SearchHeader
                                    headerText="Search result"
                                    icon={<PlaceIcon />}
                                />
                            }
                        >
                            {props.searchItemResult.map(
                                (e: SearchDataType, i) => (
                                    <Box key={i}>
                                        <SearchItem
                                            imgUrl={
                                                e.locationImg ||
                                                "https://www.rci.com/static/Resorts/Assets/3603E02L.jpg"
                                            }
                                            name={e.locationName}
                                            address={e.locationAddress}
                                            onClick={() => onItemClick(e)}
                                        />
                                        <Divider />
                                    </Box>
                                )
                            )}
                        </List>
                    )}
                    {/* Recommended  */}
                    {!!props.recommendedItems.length && (
                        <List
                            sx={{
                                width: "100%",
                                bgcolor: "background.paper",
                            }}
                            component="nav"
                            aria-labelledby="suggested-location"
                            subheader={
                                <SearchHeader
                                    headerText="Recommended"
                                    icon={<PlaceIcon />}
                                />
                            }
                        >
                            {props.recommendedItems.map(
                                (e: SearchDataType, i) => (
                                    <Box key={i}>
                                        <SearchItem
                                            imgUrl={
                                                e.locationImg ||
                                                "https://www.rci.com/static/Resorts/Assets/3603E02L.jpg"
                                            }
                                            name={e.locationName}
                                            address={e.locationAddress}
                                            onClick={() => onItemClick(e)}
                                        />
                                        <Divider />
                                    </Box>
                                )
                            )}
                        </List>
                    )}
                    <List
                        sx={{
                            width: "100%",
                            bgcolor: "background.paper",
                        }}
                        component="nav"
                        aria-labelledby="recent-location"
                        subheader={
                            <SearchHeader
                                headerText="Recent"
                                icon={<AccessTimeIcon />}
                            />
                        }
                    >
                        {!!prevSearchItems.length &&
                            prevSearchItems.map((e: SearchDataType, i) => (
                                <Box key={i}>
                                    <SearchItem
                                        imgUrl={
                                            e.locationImg ||
                                            "https://www.rci.com/static/Resorts/Assets/3603E02L.jpg"
                                        }
                                        name={e.locationName}
                                        address={e.locationAddress}
                                        onClick={() => onItemClick(e)}
                                    />
                                    <Divider />
                                </Box>
                            ))}

                        {!prevSearchItems.length && (
                            <Typography
                                variant="body2"
                                align="left"
                                gutterBottom
                                sx={{ pl: 3 }}
                            >
                                No recent serach found.
                            </Typography>
                        )}
                    </List>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default GlobalSearch;
