import { useCallback, useEffect, useState } from "react";
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Avatar,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsPopover from "../popover/Notifications";

import useApp from "../../store/app.context";
import GlobalSearch from "../app/GlobalSearch";
import { GET } from "../../services/api.service";
import { IResort } from "../../interfaces/resort.interface";

const drawerWidth = 260;

function Header(props: any) {
    const [filteredLocations, setFilteredLocations] = useState<any[]>([]);
    const [recommendedLocs, setRecommendedLocs] = useState<any[]>([]);
    const {
        resortList,
        setResort,
        setSelectedLocation,
        user,
        selectedLocation,
    } = useApp();

    useEffect(() => {
        setRecommendedLocs(
            resortList.length < 4 ? resortList : resortList.slice(0, 3) || []
        );
    }, [resortList]);

    useEffect(() => {
        if (user && user.business && user.business?.businessId) {
            getAllLocations();
        }
    }, [user]);

    const onResortChange = (value: string) => {
        if (!value) {
            setFilteredLocations([]);
            return;
        }
        const locations = [...resortList].filter((r) => {
            return r.locationName.toLowerCase().includes(value.toLowerCase());
        });
        setFilteredLocations(locations);
    };

    const onLocationChoose = (data: any) => {
        console.log({ data });
        setSelectedLocation(data);
    };

    // notification popover
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    const getAllLocations = useCallback(async () => {
        try {
            const res = await GET(
                `/location/getAll?businessId=${user?.business?.businessId}`
            );

            if (
                res &&
                res?.data &&
                res.data?.data &&
                Array.isArray(res.data.data)
            ) {
                const resorts: IResort[] = res.data.data.map((r: any) => ({
                    id: r._id,
                    businessId: r.businessId,
                    locationName: r.locationName,
                    locationAddress: r.address,
                    city: r.city,
                    country: r.country,
                    state: r.state,
                    organization: r.organization,
                }));

                if (resorts && resorts.length) {
                    setResort(resorts);
                    setSelectedLocation(resorts[0]);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }, [user?.business?.businessId]);

    return (
        <AppBar
            position="fixed"
            sx={{
                width: {
                    xs: "100%",
                    md: `calc(100% - ${drawerWidth}px)`,
                },
                ml: { xs: 0, md: `${drawerWidth}px` },
                boxShadow: "none",
                border: "none",
                backgroundColor: "#fff",
                borderBottom: "1px solid",
                borderBottomColor: "#eee",
            }}
        >
            <Toolbar>
                <IconButton
                    sx={{
                        display: { xs: "block", md: "none" },
                        transform: "rotate(180deg)",
                        mr: 3,
                    }}
                    onClick={() => props.setDrawerOpen(true)}
                >
                    <svg
                        viewBox="0 0 100 100"
                        xmlns="http://www.w3.org/2000/svg"
                        strokeWidth="4"
                        style={{
                            display: "block",
                            height: "50px",
                            transform: "scale(0.9)",
                        }}
                    >
                        <line x1="50" y1="75" x2="100" y2="75" stroke="#222" />{" "}
                        <line x1="10" y1="50" x2="100" y2="50" stroke="#222" />{" "}
                        <line x1="50" y1="25" x2="100" y2="25" stroke="#222" />
                    </svg>
                    {/* <MenuIcon /> */}
                </IconButton>

                <GlobalSearch
                    recommendedItems={recommendedLocs}
                    searchItemResult={filteredLocations || []}
                    onChange={onResortChange}
                    onSelect={onLocationChoose}
                    selectedLocation={selectedLocation}
                />
                <Box
                    sx={{
                        ml: "auto",
                        display: { xs: "none", md: "flex" },
                    }}
                >
                    <IconButton
                        sx={{ mx: 1 }}
                        size="large"
                        aria-label="show new notifications"
                        color="inherit"
                        onClick={handleClick}
                    >
                        <Badge badgeContent={7} color="primary">
                            <NotificationsIcon sx={{ color: "#777" }} />
                        </Badge>
                    </IconButton>
                    <NotificationsPopover
                        open={open}
                        handleClose={handleClose}
                        anchorEl={anchorEl}
                    />
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            display: {
                                xs: "none",
                                md: "flex",
                            },
                            borderLeft: "1px solid #eee",
                            pl: 1,
                        }}
                    >
                        <Typography
                            variant="body2"
                            fontWeight={500}
                            color="text.primary"
                        >
                            {!!user && `${user?.fullname}`}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{ lineHeight: 1 }}
                            color="text.primary"
                        >
                            {user && user.business?.businessName}
                        </Typography>
                    </Box>
                    <Box mx={1}>
                        <Avatar
                            alt={(user && user.business?.businessName) || ""}
                            src="/static/images/avatar/1.jpg"
                        />
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
