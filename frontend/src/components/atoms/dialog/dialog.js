import React from "react";
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogActions,
    Button,
    Divider,
    DialogTitle,
    Alert
} from "@mui/material";

const CustomDialogComponent = ({open, setOpen, children, dialogTitle, onSaveClicked, maxWidth, enableSaveButton, showAlert, alertMessage}) => {
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
            {showAlert && (
                <Alert severity="error" sx={{mt: "0.5rem", mr: "0.5rem", ml: "0.5rem"}}>{alertMessage}</Alert>
            )}
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
    showAlert: PropTypes.bool,
    alertMessage: PropTypes.string,
}

export default CustomDialogComponent;
