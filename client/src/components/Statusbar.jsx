import React, { useContext } from 'react';
import { Typography } from '@mui/material';
import { GlobalStoreContext } from '../store';

/*
    Our Status bar React component goes at the bottom of our UI.

    @author McKilla Gorilla
*/
function Statusbar() {
  const { store } = useContext(GlobalStoreContext);
  let text = '';
  if (store.currentList) {
    text = store.currentList.name;
  }
  return (
    <div id="playlister-statusbar">
      <Typography className="status-type" variant="h3">{text}</Typography>
    </div>
  );
}

export default Statusbar;
