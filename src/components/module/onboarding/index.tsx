import { Box } from "@mui/material";
import { useState } from "react";
import Intro1 from "./Intro1";
import LocationsAdd from "./LocationsAdd";
import Integrate from "./Integrate";

function Intro() {
    const [step, setStep] = useState(1);

    return (
        <Box maxWidth="xl" height="100vh">
            {step === 1 && <Intro1 setStep={setStep} />}
            {step === 2 && <LocationsAdd setStep={setStep} />}
            {step === 3 && <Integrate setStep={setStep} />}
        </Box>
    );
}

export default Intro;
