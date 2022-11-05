/* eslint-disable no-underscore-dangle */
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import JsTps from '../common/JsTps';
import apis from './store-request-api';
import CreateSongTransaction from '../transactions/CreateSongTransaction';
import MoveSongTransaction from '../transactions/MoveSongTransaction';
import RemoveSongTransaction from '../transactions/RemoveSongTransaction';
import UpdateSongTransaction from '../transactions/UpdateSongTransaction';
import AuthContext from '../auth';
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers.

    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE

export const GlobalStoreContext = createContext({});
console.log('create GlobalStoreContext');

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: 'CHANGE_LIST_NAME',
  CLOSE_CURRENT_LIST: 'CLOSE_CURRENT_LIST',
  CREATE_NEW_LIST: 'CREATE_NEW_LIST',
  LOAD_ID_NAME_PAIRS: 'LOAD_ID_NAME_PAIRS',
  MARK_LIST_FOR_DELETION: 'MARK_LIST_FOR_DELETION',
  SET_CURRENT_LIST: 'SET_CURRENT_LIST',
  SET_LIST_NAME_EDIT_ACTIVE: 'SET_LIST_NAME_EDIT_ACTIVE',
  EDIT_SONG: 'EDIT_SONG',
  REMOVE_SONG: 'REMOVE_SONG',
  HIDE_MODALS: 'HIDE_MODALS',
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new JsTps();

const CurrentModal = {
  NONE: 'NONE',
  DELETE_LIST: 'DELETE_LIST',
  EDIT_SONG: 'EDIT_SONG',
  REMOVE_SONG: 'REMOVE_SONG',
};

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider({ children }) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE,
    idNamePairs: [],
    currentList: null,
    currentSongIndex: -1,
    currentSong: null,
    newListCounter: 0,
    listNameActive: false,
    listIdMarkedForDeletion: null,
    listMarkedForDeletion: null,
  });
  const history = useHistory();

  console.log('inside useGlobalStore');

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  const { auth } = useContext(AuthContext);
  console.log(`auth: ${auth}`);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.idNamePairs,
          currentList: payload.playlist,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter + 1,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          currentModal: CurrentModal.DELETE_LIST,
          idNamePairs: store.idNamePairs,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: payload.id,
          listMarkedForDeletion: payload.playlist,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: true,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      //
      case GlobalStoreActionType.EDIT_SONG: {
        return setStore({
          currentModal: CurrentModal.EDIT_SONG,
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.REMOVE_SONG: {
        return setStore({
          currentModal: CurrentModal.REMOVE_SONG,
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      case GlobalStoreActionType.HIDE_MODALS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
        });
      }
      default:
        return store;
    }
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  async function getListPairs(playlist) {
    const response = await apis.getPlaylistPairs();
    if (response.data.success) {
      const pairsArray = response.data.idNamePairs;
      storeReducer({
        type: GlobalStoreActionType.CHANGE_LIST_NAME,
        payload: {
          idNamePairs: pairsArray,
          playlist,
        },
      });
    }
  }
  async function updateList(playlist) {
    const response = await apis.updatePlaylistById(playlist._id, playlist);
    if (response.data.success) {
      getListPairs(playlist);
    }
  }
  async function asyncChangeListName(id, newName) {
    const response = await apis.getPlaylistById(id);
    if (response.data.success) {
      const { playlist } = response.data;
      playlist.name = newName;
      updateList(playlist);
    }
  }
  store.changeListName = function changeListName(id, newName) {
    // GET THE LIST
    asyncChangeListName(id, newName);
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function closeCurrentList() {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
    tps.clearAllTransactions();
  };

  // THIS FUNCTION CREATES A NEW LIST
  store.createNewList = async function createNewList() {
    const newListName = `Untitled${store.newListCounter}`;
    const response = await apis.createPlaylist(newListName, [], auth.user.email);
    console.log(`createNewList response: ${response}`);
    if (response.status === 201) {
      tps.clearAllTransactions();
      const newList = response.data.playlist;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });

      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      history.push(`/playlist/${newList._id}`);
    } else {
      console.log('API FAILED TO CREATE A NEW LIST');
    }
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = function loadIdNamePairs() {
    async function asyncLoadIdNamePairs() {
      const response = await apis.getPlaylistPairs();
      if (response.data.success) {
        const pairsArray = response.data.idNamePairs;
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: pairsArray,
        });
      } else {
        console.log('API FAILED TO GET THE LIST PAIRS');
      }
    }
    asyncLoadIdNamePairs();
  };

  // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
  // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
  // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
  // showDeleteListModal, and hideDeleteListModal
  async function getListToDelete(id) {
    const response = await apis.getPlaylistById(id);
    if (response.data.success) {
      const { playlist } = response.data;
      storeReducer({
        type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
        payload: { id, playlist },
      });
    }
  }
  store.markListForDeletion = function markListForDeletion(id) {
    getListToDelete(id);
  };

  async function processDelete(id) {
    const response = await apis.deletePlaylistById(id);
    if (response.data.success) {
      store.loadIdNamePairs();
      history.push('/');
    }
  }
  store.deleteList = function deleteList(id) {
    processDelete(id);
  };
  store.deleteMarkedList = function deleteMarkedList() {
    store.deleteList(store.listIdMarkedForDeletion);
    store.hideModals();
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

  store.showEditSongModal = (songIndex, songToEdit) => {
    storeReducer({
      type: GlobalStoreActionType.EDIT_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToEdit },
    });
  };
  store.showRemoveSongModal = (songIndex, songToRemove) => {
    storeReducer({
      type: GlobalStoreActionType.REMOVE_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToRemove },
    });
  };
  store.hideModals = () => {
    storeReducer({
      type: GlobalStoreActionType.HIDE_MODALS,
      payload: {},
    });
  };
  store.isDeleteListModalOpen = () => store.currentModal === CurrentModal.DELETE_LIST;
  store.isEditSongModalOpen = () => store.currentModal === CurrentModal.EDIT_SONG;
  store.isRemoveSongModalOpen = () => store.currentModal === CurrentModal.REMOVE_SONG;

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  async function asyncSetCurrentList(id) {
    let response = await apis.getPlaylistById(id);
    if (response.data.success) {
      const { playlist } = response.data;

      response = await apis.updatePlaylistById(playlist._id, playlist);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: playlist,
        });
        history.push(`/playlist/${playlist._id}`);
      }
    }
  }
  store.setCurrentList = function setCurrentList(id) {
    asyncSetCurrentList(id);
  };

  store.getPlaylistSize = function getPlaylistSize() {
    return store.currentList.songs.length;
  };
  store.addNewSong = function addNewSong() {
    const index = store.getPlaylistSize();
    store.addCreateSongTransaction(index, 'Untitled', '?', 'dQw4w9WgXcQ');
  };
  // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
  // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
  store.createSong = function createSong(index, song) {
    const list = store.currentList;
    list.songs.splice(index, 0, song);
    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
  // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
  store.moveSong = function moveSong(start, end) {
    const list = store.currentList;

    // WE NEED TO UPDATE THE STATE FOR THE APP
    if (start < end) {
      const temp = list.songs[start];
      for (let i = start; i < end; i += 1) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    } else if (start > end) {
      const temp = list.songs[start];
      for (let i = start; i > end; i -= 1) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
  // FROM THE CURRENT LIST
  store.removeSong = function removeSong(index) {
    const list = store.currentList;
    list.songs.splice(index, 1);

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
  store.updateSong = function updateSong(index, songData) {
    const list = store.currentList;
    const song = list.songs[index];
    song.title = songData.title;
    song.artist = songData.artist;
    song.youTubeId = songData.youTubeId;

    // NOW MAKE IT OFFICIAL
    store.updateCurrentList();
  };
  store.addNewSong = () => {
    const playlistSize = store.getPlaylistSize();
    store.addCreateSongTransaction(playlistSize, 'Untitled', '?', 'dQw4w9WgXcQ');
  };
  // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
  store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
    // ADD A SONG ITEM AND ITS NUMBER
    const song = {
      title,
      artist,
      youTubeId,
    };
    const transaction = new CreateSongTransaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addMoveSongTransaction = function addMoveSongTransaction(start, end) {
    const transaction = new MoveSongTransaction(store, start, end);
    tps.addTransaction(transaction);
  };
  // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
  store.addRemoveSongTransaction = () => {
    const index = store.currentSongIndex;
    const song = store.currentList.songs[index];
    const transaction = new RemoveSongTransaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addUpdateSongTransaction = function addUpdateSongTransaction(index, newSongData) {
    const song = store.currentList.songs[index];
    const oldSongData = {
      title: song.title,
      artist: song.artist,
      youTubeId: song.youTubeId,
    };
    const transaction = new UpdateSongTransaction(this, index, oldSongData, newSongData);
    tps.addTransaction(transaction);
  };
  store.updateCurrentList = function updateCurrentList() {
    async function asyncUpdateCurrentList() {
      const response = await apis.updatePlaylistById(store.currentList._id, store.currentList);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.SET_CURRENT_LIST,
          payload: store.currentList,
        });
      }
    }
    asyncUpdateCurrentList();
  };
  store.undo = function undo() {
    tps.undoTransaction();
  };
  store.redo = function redo() {
    tps.doTransaction();
  };
  store.canAddNewSong = function canAddNewSong() {
    return (store.currentList !== null);
  };
  store.canUndo = function canUndo() {
    return ((store.currentList !== null) && tps.hasTransactionToUndo());
  };
  store.canRedo = function canRedo() {
    return ((store.currentList !== null) && tps.hasTransactionToRedo());
  };
  store.canClose = function canClose() {
    return (store.currentList !== null);
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function setIsListNameEditActive() {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <GlobalStoreContext.Provider value={{ store }}>
      {children}
    </GlobalStoreContext.Provider>
  );
}

GlobalStoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
