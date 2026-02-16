import React from "react";
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogProps,
    DialogActions,
    Button,
    Divider,
    DialogTitle,
    Slide,
} from "@mui/material";

const CustomDialogComponent = ({open, setOpen, children, dialogTitle, onSaveClicked, maxWidth, enableSaveButton}) => {
    const defaultWidth = "sm";

    return (
        <Dialog
            open={open}
            maxWidth={maxWidth || defaultWidth}
            onClose={() => setOpen(false)}
            fullWidth
        >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <Divider
                sx={{
                    mx: 2,
                }}
            />
            {children}
            <Divider
                sx={{
                    mx: 2,
                }}
            />
            <DialogActions>
                <Button
                    sx={{
                        textTransform: "none",
                    }}
                    onClick={() => setOpen(false)}
                >
                    {"Close"}
                </Button>
                {onSaveClicked && (
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: "none",
                        }}
                        disabled={enableSaveButton}
                        onClick={onSaveClicked}
                    >
                        Save
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

CustomDialogComponent.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    dialogTitle: PropTypes.string,
    onSaveClicked: PropTypes.func,
    maxWidth: PropTypes.string,
    enableSaveButton: PropTypes.bool,
}

export default CustomDialogComponent;
