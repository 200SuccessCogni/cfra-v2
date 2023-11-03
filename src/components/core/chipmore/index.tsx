import { useState, Children, ReactNode } from "react";
import { Chip } from "@mui/material";

const ChipMore = ({ children }: { children: ReactNode }) => {
    const arrayChildren = Children.toArray(children);
    const [isChipMore, setIsChipMore] = useState(true);
    const toggleChipMore = () => {
        setIsChipMore(!isChipMore);
    };
    return (
        <>
            {/* {isChipMore ? arrayChildren.slice(0, 5) : arrayChildren}
            {arrayChildren.length >= 5 && (
                <Chip
                    onClick={toggleChipMore}
                    sx={{ cursor: "pointer", color: "purple" }}
                    label={isChipMore ? "...read more" : " show less"}
                ></Chip>
            )} */}
        </>
    );
};

export default ChipMore;
