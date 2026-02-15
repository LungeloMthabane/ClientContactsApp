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

const CustomDialogComponent = ({open, setOpen, children, dialogTitle, onSaveClicked, maxWidth}) => {
    const [fullWidth, setFullWidth] = React.useState(true);
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
}

export default CustomDialogComponent;
