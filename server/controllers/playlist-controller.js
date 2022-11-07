/* eslint-disable no-underscore-dangle */
const Playlist = require('../models/playlist-model');
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.

    @author McKilla Gorilla
*/

const createPlaylist = (req, res) => {
  const { body } = req;
  console.log(`createPlaylist body: ${JSON.stringify(body)}`);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a Playlist',
    });
  }

  const playlist = new Playlist(body);
  console.log(`playlist: ${playlist.toString()}`);
  if (!playlist) {
    return res.status(400).json({ success: false, error: 'Cannot create playlist' });
  }

  User.findOne({ _id: req.userId }, (err, user) => {
    console.log(`user found: ${JSON.stringify(user)}`);

    if (user.email !== playlist.ownerEmail) {
      return res.status(403).json({
        success: false,
        error: 'Cannot create playlist. Action is forbidden.',
      });
    }

    user.playlists.push(playlist._id);
    user
      .save()
      .then(() => {
        playlist
          .save()
          .then(() => res.status(201).json({
            playlist,
          }))
          .catch((error) => res.status(400).json({
            errorMessage: 'Playlist Not Created!',
            error,
          }));
      });
    return null;
  });
  return null;
};
const deletePlaylist = async (req, res) => {
  console.log(`delete Playlist with id: ${JSON.stringify(req.params.id)}`);
  console.log(`delete ${req.params.id}`);
  Playlist.findById({ _id: req.params.id }, (findErr, playlist) => {
    console.log(`playlist found: ${JSON.stringify(playlist)}`);
    if (findErr) {
      return res.status(404).json({
        errorMessage: 'Playlist not found!',
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      User.findOne({ email: list.ownerEmail }, (_err, user) => {
        console.log(`user._id: ${user._id}`);
        console.log(`req.userId: ${req.userId}`);
        if (user._id.toString() === req.userId) {
          console.log('correct user!');
          return Playlist.findOneAndDelete(
            { _id: req.params.id },
            () => res.status(200).json({ success: true }),
          );
        }
        console.log('incorrect user!');
        return res.status(400).json({
          errorMessage: 'authentication error',
        });
      });
    }
    return asyncFindUser(playlist);
  });
};
const getPlaylistById = async (req, res) => {
  console.log(`Find Playlist with id: ${JSON.stringify(req.params.id)}`);

  await Playlist.findById({ _id: req.params.id }, (findErr, list) => {
    if (findErr) {
      return res.status(400).json({ success: false, error: findErr });
    }
    console.log(`Found list: ${JSON.stringify(list)}`);

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(playlist) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log(`user._id: ${user._id}`);
        console.log(`req.userId: ${req.userId}`);
        if (user._id.toString() === req.userId) {
          console.log('correct user!');
          return res.status(200).json({ success: true, playlist });
        }

        console.log('incorrect user!');
        return res.status(400).json({ success: false, description: 'authentication error' });
      });
    }
    return asyncFindUser(list);
  }).catch((err) => console.log(err));
};
const getPlaylistPairs = async (req, res) => {
  console.log('getPlaylistPairs');
  await User.findOne({ _id: req.userId }, (findErr, user) => {
    console.log(`find user with id ${req.userId}`);
    async function asyncFindList(email) {
      console.log(`find all Playlists owned by ${email}`);
      await Playlist.find({ ownerEmail: email }, (err, playlists) => {
        console.log(`found Playlists: ${JSON.stringify(playlists)}`);
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        if (!playlists) {
          console.log('!playlists.length');
          return res
            .status(404)
            .json({ success: false, error: 'Playlists not found' });
        }

        console.log('Send the Playlist pairs');
        // PUT ALL THE LISTS INTO ID, NAME PAIRS
        const pairs = [];
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const key in playlists) {
          const list = playlists[key];
          const pair = {
            _id: list._id,
            name: list.name,
          };
          pairs.push(pair);
        }
        return res.status(200).json({ success: true, idNamePairs: pairs });
      }).catch((err) => console.log(err));
    }
    asyncFindList(user.email);
  }).catch((err) => console.log(err));
};
const getPlaylists = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(400).json({ success: false, error: 'Cannot get playlists: User does not exist.' });
  }

  await Playlist.find({ ownerEmail: user.email }, (err, playlists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!playlists.length) {
      return res
        .status(404)
        .json({ success: false, error: 'Playlists not found' });
    }
    return res.status(200).json({ success: true, data: playlists });
  }).catch((err) => console.log(err));
  return null;
};
const updatePlaylist = async (req, res) => {
  const { body } = req;
  console.log(`updatePlaylist: ${JSON.stringify(body)}`);
  console.log(`req.body.name: ${req.body.name}`);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a body to update',
    });
  }

  Playlist.findOne({ _id: req.params.id }, (findErr, playlist) => {
    console.log(`playlist found: ${JSON.stringify(playlist)}`);
    if (findErr) {
      return res.status(404).json({
        error: findErr,
        message: 'Playlist not found!',
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      const listModel = list;
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log(`user._id: ${user._id}`);
        console.log(`req.userId: ${req.userId}`);
        if (user._id.toString() === req.userId) {
          console.log('correct user!');
          console.log(`req.body.name: ${req.body.name}`);

          listModel.name = body.playlist.name;
          listModel.songs = body.playlist.songs;
          listModel
            .save()
            .then(() => {
              console.log('SUCCESS!!!');
              return res.status(200).json({
                success: true,
                id: list._id,
                message: 'Playlist updated!',
              });
            })
            .catch((error) => {
              console.log(`FAILURE: ${JSON.stringify(error)}`);
              return res.status(404).json({
                error,
                message: 'Playlist not updated!',
              });
            });
        } else {
          console.log('incorrect user!');
          return res.status(400).json({ success: false, description: 'authentication error' });
        }
        return null;
      });
    }
    asyncFindUser(playlist);
    return null;
  });
  return null;
};
module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylistPairs,
  getPlaylists,
  updatePlaylist,
};
