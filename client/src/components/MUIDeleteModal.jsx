import React, { useContext, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { GlobalStoreContext, CurrentModal } from '../store';

export default function MUIDeleteModal() {
  const { store } = useContext(GlobalStoreContext);
  const name = useRef('');
  if (store.listMarkedForDeletion) {
    name.current = store.listMarkedForDeletion.name;
  }

  function handleDeleteList(event) {
    event.preventDefault();
    store.deleteMarkedList();
  }
  function handleCloseModal(event) {
    event.preventDefault();
    store.hideModals();
  }

  const open = store.currentModal === CurrentModal.DELETE_LIST;
  return (
    <Dialog open={open}>
      <DialogTitle>
        Delete Playlist?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to permanently remove the
          <strong>{` ${name.current} `}</strong>
          playlist?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button onClick={handleDeleteList} autoFocus>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}
