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

type themeColos = {
    primary: string;
    secondary: string;
    text?: string;
};

export function generatePalette(colors?: themeColos) {
    const primaryBase = (colors && colors.primary) || "#000048";
    const secondaryBase = (colors && colors.secondary) || "#36C0CF";
    const blackBase = "#000";
    const primaryMain = alpha(primaryBase, 0.9);
    const secondaryMain = alpha(secondaryBase, 0.9);

    const palette: ExtendedPaletteOptions = {
        primary: {
            main: primaryMain,
            light: alpha(primaryBase, 0.3),
            dark: alpha(primaryBase, 1),
            contrastText:
                getContrastRatio(primaryMain, "#fff") > 4.5 ? "#fff" : "#111",
        },
        secondary: {
            main: secondaryMain,
            light: alpha(secondaryBase, 0.5),
            dark: alpha(secondaryBase, 1),
            contrastText:
                getContrastRatio(secondaryMain, "#fff") > 4.5 ? "#fff" : "#111",
            darker: secondaryBase,
        },
        black: {
            main: alpha(blackBase, 0.7),
            light: alpha(blackBase, 0.5),
            dark: alpha(blackBase, 0.95),
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

    return palette;
}

export function getNewTheme(color: themeColos) {
    // Create a theme instance.
    const theme = createTheme({
        palette: generatePalette(color),
        typography: {
            fontFamily: "Poppins",
        },
    });
    return theme;
}

// Create a theme instance.
const theme = createTheme({
    palette: generatePalette(),
    typography: {
        fontFamily: "Poppins",
    },
});

const defaultTheme = theme;
export const mcdTheme = getNewTheme({ primary: "#ffbc0d", secondary: "#000" });
export const mcCainTheme = getNewTheme({ primary: "#ffbc0d", secondary: "#000" });
export const kohlerTheme = getNewTheme({
    primary: "#2b2a28",
    secondary: "#364573",
});
export const marriottTheme = getNewTheme({
    primary: "#8e001e",
    secondary: "#2b2a28",
});
// defaultTheme = mcdTheme;

export default defaultTheme;
