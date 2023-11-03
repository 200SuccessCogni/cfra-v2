import { ReactElement, useEffect, useState } from "react";

import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    Typography,
    Divider,
    ListItemText,
    ListItemIcon,
    IconButton,
    LinearProgress,
    SwipeableDrawer,
    Link as MuiLink,
} from "@mui/material";
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import QueryStatsTwoToneIcon from "@mui/icons-material/QueryStatsTwoTone";
import TimelineTwoToneIcon from "@mui/icons-material/TimelineTwoTone";
// import RecommendTwoToneIcon from "@mui/icons-material/RecommendTwoTone";
import PolylineTwoToneIcon from "@mui/icons-material/PolylineTwoTone";
import RecommendTwoToneIcon from "@mui/icons-material/RecommendTwoTone";
import LogoutIcon from "@mui/icons-material/Logout";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useApp from "../../store/app.context";
import CloseIcon from "@mui/icons-material/Close";
import Header from "./Header";
import GlobalDateSelect from "../app/GlobalDateSelect";

interface Props {
    children?: React.ReactNode;
}

const drawerWidth = 260;

const menuList = [
    { icon: <HomeTwoToneIcon />, name: "Dashboard", url: "/" },
    { icon: <TimelineTwoToneIcon />, name: "Reviews", url: "/reviews" },
    { icon: <CompareArrowsIcon />, name: "Comparision", url: "/compare" },
    {
        icon: <QueryStatsTwoToneIcon />,
        name: "Insights & Analytics",
        url: "/analytics",
    },
    // {
    //     icon: <RecommendTwoToneIcon />,
    //     name: "Recommendation",
    //     url: "/recommendation",
    // },
    {
        icon: <PolylineTwoToneIcon />,
        name: "Integration",
        url: "/integration",
    },
];

export default function SideNav(props: Props) {
    const [drwaerOpen, setDrawerOpen] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [currentPath, setCurrentPath] = useState("");
    const { loader, user = { name: "" } } = useApp();

    useEffect(() => {
        setCurrentPath(pathname);
    }, [pathname]);

    const logout = () => {
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
        navigate("/signin");
    };

    return (
        <>
            <Box sx={{ display: "flex", height: "100%" }}>
                <Header setDrawerOpen={setDrawerOpen} />
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            boxSizing: "border-box",
                            border: "none",
                            // backgroundColor: "secondary.light",
                            borderRight: "1px solid #eee",
                        },
                        position: "relative",
                        display: { xs: "none", md: "block" },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Toolbar>
                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                flexDirection: "column",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography
                                variant="button"
                                color="primary"
                                sx={{
                                    px: 1,
                                    textTransform: "none",
                                    color: "text.primary",
                                    fontWeight: "600",
                                    fontSize: "1.2rem",
                                }}
                            >
                                CFRA
                            </Typography>
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{
                                    px: 1,
                                    textTransform: "none",
                                    fontWeight: "400",
                                    lineHeight: 1,
                                }}
                            >
                                Customer Feedback and Review Analysis
                            </Typography>
                        </Box>
                    </Toolbar>
                    <MenuList currentPath={currentPath} logout={logout} />
                </Drawer>
                {/* Resposive mobile menu drawer */}
                <SwipeableDrawer
                    anchor="left"
                    open={drwaerOpen}
                    onClose={() => setDrawerOpen(false)}
                    onOpen={() => setDrawerOpen(true)}
                    sx={{ width: "80vw" }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={2}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                            }}
                        >
                            <Typography
                                variant="button"
                                color="primary"
                                sx={{
                                    px: 1,
                                    textTransform: "none",
                                    color: "text.primary",
                                    fontWeight: "600",
                                    fontSize: "1.2rem",
                                }}
                            >
                                CFRA
                            </Typography>
                            <Typography
                                variant="caption"
                                color="primary"
                                sx={{
                                    px: 1,
                                    textTransform: "none",
                                    fontWeight: "400",
                                    lineHeight: 1,
                                }}
                            >
                                Customer Feedback and Review Analysis
                            </Typography>
                        </Box>
                        <IconButton onClick={() => setDrawerOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <MenuList currentPath={currentPath} logout={logout} />
                </SwipeableDrawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        height: "calc(100vh - 69px)",
                        marginTop: loader ? "65px" : "65px",
                        overflowY: "auto",
                        overflowX: "hidden",
                        // backgroundColor: "secondary.main",
                        position: "relative",
                    }}
                >
                    {!!loader && (
                        <LinearProgress
                            sx={{
                                mt: -3,
                                mx: -3,
                                mb: 3,
                                height: "3px",
                                color: "primary.dark",
                            }}
                        ></LinearProgress>
                    )}

                    {props.children}
                    <Box
                        sx={{
                            background: "#eef2f5",
                            border: "none",
                            position: "absolute",
                            top: "1rem",
                            right: "1rem",
                        }}
                    >
                        <GlobalDateSelect />
                    </Box>
                </Box>
            </Box>
        </>
    );
}

const MenuList = ({
    currentPath,
    logout,
}: {
    currentPath: string;
    logout: () => void;
}) => {
    const Menutem = ({
        icon,
        currentPath,
        url,
        name,
    }: {
        icon: ReactElement;
        currentPath: string;
        url: string;
        name: string;
    }) => {
        return (
            <>
                <ListItemIcon
                    sx={{
                        justifyContent: "center",
                        color: `${
                            currentPath === url
                                ? "primary.main"
                                : "text.primary"
                        }`,
                    }}
                >
                    {icon}
                </ListItemIcon>
                <ListItemText
                    primary={
                        <Typography
                            variant="body2"
                            fontWeight={currentPath === url ? "600" : "500"}
                            color={
                                currentPath === url
                                    ? "primary.main"
                                    : "text.primary"
                            }
                            fontSize="0.85rem"
                        >
                            {name}
                        </Typography>
                    }
                />
            </>
        );
    };

    return (
        <Box
            p={2}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <List>
                {menuList.slice(0, 3).map((e) => {
                    return (
                        <Link to={e.url} key={e.name}>
                            <ListItem disablePadding key={e.name}>
                                <ListItemButton sx={{ p: 0.5 }}>
                                    <Menutem
                                        icon={e.icon}
                                        name={e.name}
                                        url={e.url}
                                        currentPath={currentPath}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    );
                })}
            </List>
            <Divider />
            <List>
                {menuList.slice(3, 6).map((e) => (
                    <Link to={e.url} key={e.name}>
                        <ListItem disablePadding key={e.name}>
                            <ListItemButton sx={{ p: 0.5 }}>
                                <Menutem
                                    icon={e.icon}
                                    name={e.name}
                                    url={e.url}
                                    currentPath={currentPath}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
            <Box sx={{ mt: "auto", py: 2, width: "100%" }}>
                <Link to={"/settings"}>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ p: 0.5 }}>
                            <Menutem
                                icon={<SettingsTwoToneIcon />}
                                name={"Settings"}
                                url={"/settings"}
                                currentPath={currentPath}
                            />
                        </ListItemButton>
                    </ListItem>
                </Link>
                <ListItem disablePadding>
                    <ListItemButton sx={{ p: 0.5 }} onClick={() => logout()}>
                        <Menutem
                            icon={<LogoutIcon />}
                            name={"Logout"}
                            url={"/logout"}
                            currentPath={currentPath}
                        />
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );
};
