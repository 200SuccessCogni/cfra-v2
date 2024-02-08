import { Box } from "@mui/material";
import styles from "./spinner.module.css";

export default function Spinner() {
    return (
        <Box className={styles.spinner}>
            <Box className={styles.bounce1}></Box>
            <Box className={styles.bounce2}></Box>
            <Box className={styles.bounce3}></Box>
        </Box>
    );
}
