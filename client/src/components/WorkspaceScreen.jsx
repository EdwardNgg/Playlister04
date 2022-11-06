import React, { useContext, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { Button, Typography } from '@mui/material';
import SongCard from './SongCard';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import { GlobalStoreContext } from '../store';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.

    @author McKilla Gorilla
*/
function WorkspaceScreen() {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (!store.currentList) {
      store.setCurrentList(id);
    }
  }, []);

  let modalJSX = '';
  if (store.isEditSongModalOpen()) {
    modalJSX = <MUIEditSongModal />;
  } else if (store.isRemoveSongModalOpen()) {
    modalJSX = <MUIRemoveSongModal />;
  }

  if (!store.currentList) {
    return (
      <Box className="error-box">
        <Typography className="error-type" variant="h3">
          Oops!
        </Typography>
        <br />
        <Typography className="error-type" variant="subtitle1">
          Sorry, we cannot find that playlist.
        </Typography>
        <br />
        <Button className="error-button" href="/">
          Home
        </Button>

      </Box>
    );
  }

  return (
    <Box>
      <List
        id="playlist-cards"
        sx={{ width: '100%', bgcolor: 'background.paper' }}
      >
        {
          store.currentList.songs.map((song, index) => (
            <SongCard
              id={`playlist-song-${index}`}
              // eslint-disable-next-line react/no-array-index-key
              key={`playlist-song-${index}`}
              index={index}
              song={song}
            />
          ))
        }
      </List>
      { modalJSX }
    </Box>
  );
}

export default WorkspaceScreen;
