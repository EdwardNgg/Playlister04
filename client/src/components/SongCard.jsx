import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { GlobalStoreContext } from '../store';

function SongCard({ song, index }) {
  const { store } = useContext(GlobalStoreContext);
  const [draggedTo, setDraggedTo] = useState(0);

  function handleDragStart(event) {
    event.dataTransfer.setData('song', index);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setDraggedTo(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setDraggedTo(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    const targetIndex = index;
    const sourceIndex = Number(event.dataTransfer.getData('song'));
    setDraggedTo(false);

    // UPDATE THE LIST
    store.addMoveSongTransaction(sourceIndex, targetIndex);
  }
  function handleRemoveSong(event) {
    store.showRemoveSongModal(index, song);
  }
  function handleClick(event) {
    // DOUBLE CLICK IS FOR SONG EDITING
    if (event.detail === 2) {
      store.showEditSongModal(index, song);
    }
  }

  const cardClass = 'list-card unselected-list-card';
  return (
    <div
      key={index}
      id={`song-${index}-card`}
      className={cardClass}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable="true"
      onClick={handleClick}
    >
      {`${index + 1}.`}
      <a
        id={`song-${index}-link`}
        className="song-link"
        href={`https://www.youtube.com/watch?v=${song.youTubeId}`}
      >
        {`${song.title} by ${song.artist}`}
      </a>
      <input
        type="button"
        id={`remove-song-${index}`}
        className="list-card-button"
        value={'\u2715'}
        onClick={handleRemoveSong}
      />
    </div>
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
