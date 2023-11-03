import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";

type DropRingProps = {
    zIndex: number;
    opacity?: number;
    height?: string;
    width?: string;
};

const DropRing = styled("span")<DropRingProps>(
    ({ theme, zIndex, opacity, height = "100%", width = "100%" }) => ({
        position: "absolute",
        zIndex,
        height,
        width,
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        display: "block",
        aspectRatio: 1,

        "&:before": {
            content: "''",
            position: "absolute",
            display: "block",
            width: "100%",
            height: "100%",
            opacity: 0.2,
            background: `linear-gradient(-180deg, ${theme.palette.primary.main}, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
            // backgroundColor: theme.palette.primary.main,
            animation: "aigradient 5s ease infinite",
            backgroundSize: "400% 400%",
            borderRadius: "50%",
        },
    })
);

const DropZone = styled("div")({
    display: "flex",
    justifyContent: "center",
    width: "12rem",
    height: "12rem",
    margin: "0px",
    padding: "0.5em",
    border: "0px",
    borderRadius: "50%",
    transition: "transform .3s ease-out",
});

const DropZoneContainer = styled("div")({
    position: "relative",
    zIndex: 1,
    display: "inline-block",
});

const DropZoneMedia = styled("div")({
    position: "relative",
    zIndex: 1,
    display: "flex",
    alignItems: "flex-start",
    minHeight: "5rem",
    paddingTop: "1rem",
});

const DropContent = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    textAlign: "center",
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.contrastText,
    cursor: "pointer",
}));

function DragDropFileUpload() {
    return (
        <DropZoneMedia>
            <DropZoneContainer>
                <DropZone>
                    <DropContent>
                        <Typography
                            variant="body1"
                            fontWeight={500}
                            lineHeight={1.1}
                        >
                            Drag and drop your locations
                        </Typography>
                        <Typography variant="body2">OR</Typography>
                        <Typography variant="body2">Browse here</Typography>
                    </DropContent>
                </DropZone>
                <DropRing zIndex={-2} opacity={0.9} />
                <DropRing
                    zIndex={-3}
                    opacity={0.8}
                    height="180%"
                    width="180%"
                />
                <DropRing
                    zIndex={-4}
                    opacity={0.7}
                    height="270%"
                    width="270%"
                />
                <DropRing
                    zIndex={-4}
                    opacity={0.7}
                    height="360%"
                    width="360%"
                />
            </DropZoneContainer>
        </DropZoneMedia>
    );
}

export default DragDropFileUpload;
