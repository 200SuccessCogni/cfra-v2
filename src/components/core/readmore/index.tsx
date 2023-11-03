import { useState } from "react";
import { Typography } from "@mui/material";

const ReadMore = ({ children }: { children: string }) => {
    const text = children;
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => {
        setIsReadMore(!isReadMore);
    };
    return (
        <>
            {isReadMore ? text.slice(0, 350) : text}
            {text.length >= 350 && (
                <Typography
                    component="span"
                    variant="caption"
                    onClick={toggleReadMore}
                    sx={{ cursor: "pointer", color: "purple" }}
                >
                    {isReadMore ? "...read more" : " show less"}
                </Typography>
            )}
        </>
    );
};

export default ReadMore;
