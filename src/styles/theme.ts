import { createTheme, alpha, getContrastRatio } from "@mui/material/styles";
import { red } from "@mui/material/colors";
import {
    SimplePaletteColorOptions,
    PaletteOptions,
    TypeText,
} from "@mui/material";

interface ExtendedPaletteColorOptions extends SimplePaletteColorOptions {
    darker?: string;
}

interface ExtendedTypeText extends TypeText {
    light: string;
    contrastText: string;
    contrastTextLight: string;
}

interface ExtendedPaletteOptions extends PaletteOptions {
    primary: ExtendedPaletteColorOptions;
    secondary: ExtendedPaletteColorOptions;
    text: Partial<ExtendedTypeText>;
    error: ExtendedPaletteColorOptions;
    // warning: ExtendedPaletteColorOptions
    // info: ExtendedPaletteColorOptions
    // success: ExtendedPaletteColorOptions
    black: ExtendedPaletteColorOptions;
    gray?: ExtendedPaletteColorOptions;
    // And your custom palette options if you defined them, e.g:
    // brand: ExtendedPaletteColorOptions
}

declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        black: true;
    }
}

const primaryBase = "#00301F";
const secondaryBase = "#FFD681";
const blackBase = "#000";
const primaryMain = alpha(primaryBase, 0.7);
const secondaryMain = alpha(secondaryBase, 0.7);

const palette: ExtendedPaletteOptions = {
    primary: {
        main: primaryMain,
        light: alpha(primaryBase, 0.3),
        dark: alpha(primaryBase, 0.9),
        contrastText:
            getContrastRatio(primaryMain, "#fff") > 4.5 ? "#fff" : "#111",
    },
    secondary: {
        main: secondaryMain,
        light: alpha(secondaryBase, 0.5),
        dark: alpha(secondaryBase, 0.9),
        contrastText:
            getContrastRatio(secondaryMain, "#fff") > 4.5 ? "#fff" : "#111",
        darker: secondaryBase,
    },
    black: {
        main: alpha(blackBase, 0.7),
        light: alpha(blackBase, 0.5),
        dark: alpha(blackBase, 0.9),
        contrastText: "#fff",
    },
    gray: {
        main: "#777",
    },
    error: {
        main: red.A400,
    },
    text: {
        primary: "#032e2b",
        secondary: "#222",
        light: "#454545",
        contrastText: "#fff",
        contrastTextLight: "#d0e9f3",
    },
    background: {
        default: "#ecf3eb",
    },
};

// Create a theme instance.
const theme = createTheme({
    palette: palette,
    typography: {
        fontFamily: "Poppins",
    },
});

export default theme;
