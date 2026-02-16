import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PropTypes from 'prop-types';

const ToastComponent = ({ showToast, setShowToast, toastMessage}) => {
    return (
        <div>
            <Snackbar open={showToast} autoHideDuration={3000} onClose={() => {
                setShowToast(false)
            }}>
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                >
                    {toastMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

ToastComponent.propTypes = {
    showToast: PropTypes.bool.isRequired,
    toastMessage: PropTypes.string.isRequired,
    setShowToast: PropTypes.func.isRequired,
}

export default ToastComponent;

