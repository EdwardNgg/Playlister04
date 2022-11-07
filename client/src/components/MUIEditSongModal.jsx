import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { GlobalStoreContext, CurrentModal } from '../store';

export default function MUIEditSongModal() {
  const { store } = useContext(GlobalStoreContext);
  const [title, setTitle] = useState(store.currentSong.title);
  const [artist, setArtist] = useState(store.currentSong.artist);
  const [youTubeId, setYouTubeId] = useState(store.currentSong.youTubeId);

  function handleConfirmEditSong() {
    const newSongData = { title, artist, youTubeId };
    store.addUpdateSongTransaction(store.currentSongIndex, newSongData);
  }

  function handleCancelEditSong() {
    store.hideModals();
  }

  function handleUpdateTitle(event) {
    setTitle(event.target.value);
  }

  function handleUpdateArtist(event) {
    setArtist(event.target.value);
  }

  function handleUpdateYouTubeId(event) {
    setYouTubeId(event.target.value);
  }

  const open = store.currentModal === CurrentModal.EDIT_SONG;
  return (
    <Dialog open={open}>
      <DialogTitle>
        Edit Song?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          To edit this song, please make changes to the title, artist, or YouTube ID.
        </DialogContentText>
        <br />
        <TextField
          id="edit-song-modal-title-textfield"
          label="Title"
          margin="dense"
          fullWidth
          value={title}
          onChange={handleUpdateTitle}
        />
        <TextField
          id="edit-song-modal-artist-textfield"
          label="Artist"
          margin="dense"
          fullWidth
          value={artist}
          onChange={handleUpdateArtist}
        />
        <TextField
          id="edit-song-modal-youTubeId-textfield"
          label="YouTube ID"
          margin="dense"
          fullWidth
          value={youTubeId}
          onChange={handleUpdateYouTubeId}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelEditSong}>Cancel</Button>
        <Button onClick={handleConfirmEditSong} autoFocus>Save Edits</Button>
      </DialogActions>
    </Dialog>
  );
}
