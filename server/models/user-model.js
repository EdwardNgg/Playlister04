const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    playlists: [{ type: ObjectId, ref: 'Playlist' }],
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', UserSchema);
