import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { GlobalStoreContext, CurrentModal } from '../store';
import AuthContext from '../auth';

function getTitle(type) {
  if (type === 'login') {
    return 'Sign In Unsuccessful.';
  } if (type === 'register') {
    return 'Sign Up Unsuccessful.';
  }
  return '';
}

function MUIAlertModal({ type }) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);

  const open = store.currentModal === CurrentModal.ALERT;

  const handleClose = (event) => {
    event.preventDefault();
    store.hideModals();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {getTitle(type)}
      </DialogTitle>
      <DialogContent>
        <Alert severity="error">{ auth.errorMessage }</Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
MUIAlertModal.propTypes = {
  type: PropTypes.oneOf(['login', 'register']).isRequired,
};

export default MUIAlertModal;
