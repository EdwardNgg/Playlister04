import React, { useContext, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListCard from './ListCard';
import MUIDeleteModal from './MUIDeleteModal';
import { GlobalStoreContext } from '../store';
/*
    This React component lists all the top5 lists in the UI.

    @author McKilla Gorilla
*/
function HomeScreen() {
  const { store } = useContext(GlobalStoreContext);

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  function handleCreateNewList() {
    store.createNewList();
  }
  let listCard = '';
  if (store) {
    listCard = (
      <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
        {
          store.idNamePairs.map((pair) => (
            <ListCard
              // eslint-disable-next-line no-underscore-dangle
              key={pair._id}
              idNamePair={pair}
            />
          ))
        }
      </List>
    );
  }
  return (
    <div id="playlist-selector">
      <div id="list-selector-heading">
        <Fab
          sx={{ marginRight: '10px' }}
          color="ffffff"
          aria-label="add"
          id="add-list-button"
          onClick={handleCreateNewList}
        >
          <AddIcon />
        </Fab>
        <Typography variant="h3">Your Lists</Typography>
      </div>
      <div id="list-selector-list">
        { listCard }
        <MUIDeleteModal />
      </div>
    </div>
  );
}

export default HomeScreen;
