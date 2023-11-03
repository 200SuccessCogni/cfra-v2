import {
    Typography, Container, Grid,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Button
} from "@mui/material";
import { useState } from 'react';
import HomeTwoToneIcon from "@mui/icons-material/HomeTwoTone";
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import PolylineTwoToneIcon from "@mui/icons-material/PolylineTwoTone";
import GrainTwoToneIcon from '@mui/icons-material/GrainTwoTone';

const settingsMenu = [
    { icon: <AccountCircleTwoToneIcon />, name: "Profile Details", code: "profile" },
    { icon: <PeopleTwoToneIcon />, name: "Access Control", code: "access-control" },
    { icon: <PolylineTwoToneIcon />, name: "Integration", code: "integration" },
    {
        icon: <GrainTwoToneIcon />,
        name: "Analysis Vendor",
        code: "/gen-ai",
    },
]


export default function Settings() {
    const [currentPath, setCurrentPath] = useState("profile");

    return (
        <>
            <Typography variant="h5" fontWeight={500}>
                Settings
            </Typography>
            <Container sx={{ my: 6 }}>
                <Grid container spacing={3}>
                    <Grid item md={8}>
                        <Box sx={{
                            backgroundColor: "secondary.light",
                            borderRadius: "0.5rem",
                            p: 3,
                            // border: "1px solid",
                            // borderColor: "primary.main",
                            minHeight: "60vh",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%"
                        }}>

                            <Typography
                                variant="h6"
                            >
                                User Profile
                            </Typography>
                            <Box mt="auto" ml="auto">
                                <Button color="black" variant="contained">Submit</Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item md={4}>
                        <Box sx={{
                            backgroundColor: "secondary.light",
                            borderRadius: "0.5rem",
                            // border: "1px solid",
                            // borderColor: "primary.main",
                            minHeight: "60vh"
                        }}>
                            <List>
                                {settingsMenu.map(e => (
                                    <ListItem onClick={() => setCurrentPath(e.code)} sx={{ p: 0 }}>
                                        <ListItemButton>
                                            <ListItemIcon
                                                sx={{
                                                    justifyContent: "center",
                                                    color: `${currentPath === e.code
                                                        ? "primary.main"
                                                        : "text.primary"
                                                        }`,
                                                }}
                                            >
                                                {e.icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={currentPath === e.code ? "600" : "400"}
                                                        color={
                                                            currentPath === e.code
                                                                ? "primary.main"
                                                                : "text.primary"
                                                        }
                                                        fontSize="0.9rem"
                                                    >
                                                        {e.name}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}