import React, { useContext } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { GlobalStoreContext, CurrentModal } from '../store';

export default function MUIRemoveSongModal() {
  const { store } = useContext(GlobalStoreContext);

  function handleConfirmRemoveSong() {
    store.addRemoveSongTransaction();
  }

  function handleCancelRemoveSong() {
    store.hideModals();
  }

  const open = store.currentModal === CurrentModal.REMOVE_SONG;
  const songTitle = store.currentSong ? store.currentSong.title : '';

  return (
    <Dialog open={open}>
      <DialogTitle>
        Remove Song?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to permanetly remove the
          <strong>{` ${songTitle} `}</strong>
          song from the playlist?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelRemoveSong}>Cancel</Button>
        <Button onClick={handleConfirmRemoveSong}>Remove</Button>
      </DialogActions>
    </Dialog>
  );
}
