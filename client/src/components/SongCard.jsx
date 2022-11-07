import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import {
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { GlobalStoreContext } from '../store';

function SongCard({ song, index }) {
  const { store } = useContext(GlobalStoreContext);

  function handleDragStart(event) {
    event.dataTransfer.setData('song', index);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
  }

  function handleDragLeave(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const targetIndex = index;
    const sourceIndex = Number(event.dataTransfer.getData('song'));

    // UPDATE THE LIST
    store.addMoveSongTransaction(sourceIndex, targetIndex);
  }
  function handleRemoveSong() {
    store.showRemoveSongModal(index, song);
  }
  function handleClick(event) {
    // DOUBLE CLICK IS FOR SONG EDITING
    if (event.detail === 2) {
      store.showEditSongModal(index, song);
    }
  }

  const deleteSongIcon = (
    <IconButton onClick={handleRemoveSong} edge="end">
      <DeleteIcon />
    </IconButton>
  );
  return (
    <>
      { index === 0 ? '' : <Divider component="li" /> }
      <div
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggable
      >
        <ListItem
          id={`song-${index}-card`}
          sx={{ bgcolor: 'background.paper' }}
          onClick={handleClick}
          secondaryAction={deleteSongIcon}
        >
          <ListItemButton>
            <Typography variant="h4">
              {`${index + 1}. `}
              <a
                id={`song-${index}-link`}
                className="song-link"
                href={`https://www.youtube.com/watch?v=${song.youTubeId}`}
              >
                {`${song.title} by ${song.artist}`}
              </a>
            </Typography>
          </ListItemButton>
        </ListItem>
      </div>
    </>
  );
}

SongCard.propTypes = {
  song: PropTypes.shape({
    title: PropTypes.string,
    artist: PropTypes.string,
    youTubeId: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default SongCard;
