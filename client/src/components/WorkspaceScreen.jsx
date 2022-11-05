import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
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

  let modalJSX = '';
  if (store.isEditSongModalOpen()) {
    modalJSX = <MUIEditSongModal />;
  } else if (store.isRemoveSongModalOpen()) {
    modalJSX = <MUIRemoveSongModal />;
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
