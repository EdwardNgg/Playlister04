/* eslint-disable no-underscore-dangle */
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import { GlobalStoreContext } from '../store';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its
    name or deleting it.

    @author McKilla Gorilla
*/
function ListCard({ idNamePair }) {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState('');

  function handleLoadList(event, id) {
    console.log(`handleLoadList for ${id}`);
    if (!event.target.disabled) {
      let _id = event.target.id;
      if (_id.indexOf('list-card-text-') >= 0) {
        _id = (`${_id}`).substring('list-card-text-'.length);
      }

      console.log(`load ${event.target.id}`);

      // CHANGE THE CURRENT LIST
      store.setCurrentList(id);
    }
  }

  function toggleEdit() {
    const newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    store.markListForDeletion(id);
  }

  function handleKeyPress(event) {
    if (event.code === 'Enter') {
      const id = event.target.id.substring('list-'.length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
  }

  let cardElement = (
    <ListItem
      id={idNamePair._id}
      key={idNamePair._id}
      sx={{ display: 'flex', p: 1 }}
      style={{ width: '100%' }}
      button
      onClick={(event) => {
        handleLoadList(event, idNamePair._id);
      }}
    >
      <Box sx={{ p: 1, flexGrow: 1 }}>
        <Typography variant="h4">
          {idNamePair.name}
        </Typography>
      </Box>
      <Box sx={{ p: 1 }}>
        <IconButton onClick={handleToggleEdit} aria-label="edit">
          <EditIcon style={{ fontSize: '24pt' }} />
        </IconButton>
      </Box>
      <Box sx={{ p: 1 }}>
        <IconButton
          onClick={(event) => { handleDeleteList(event, idNamePair._id); }}
          aria-label="delete"
        >
          <DeleteIcon style={{ fontSize: '24pt' }} />
        </IconButton>
      </Box>
    </ListItem>
  );

  if (editActive) {
    cardElement = (
      <TextField
        sx={{ paddingLeft: '1%', paddingRight: '1%', width: '98%' }}
        margin="normal"
        required
        id={`list-${idNamePair._id}`}
        label="Playlist Name"
        name="name"
        autoComplete="Playlist Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={idNamePair.name}
        InputLabelProps={{ style: { paddingLeft: '1%' } }}
        autoFocus
      />
    );
  }
  return (
    cardElement
  );
}
ListCard.propTypes = {
  idNamePair: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default ListCard;
