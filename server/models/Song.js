const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  artists: [
    {
      type: Schema.Types.ObjectId,
      ref: "artists"
    }
  ],
  album: {
    type: Schema.Types.ObjectId,
    ref: "album"
  },
  duration: {
    type: Number,
    required: true
  },
  songUrl: {
    type: String,
    required: true
  },
  playlists: [{
    type: Schema.Types.ObjectId,
    ref: "playlists"
  }]
});

SongSchema.statics.findArtists = function(id) {
  return this.findById(id)
    .populate("artists")
    .then(song => {
      const Artist = mongoose.model("artists");
      const artistsArr = song.artists;
      let returnArr = [];
      artistsArr.forEach(artist => {
        returnArr.push(Artist.findById(artist));
      });
      return returnArr;
    });
};

SongSchema.statics.findAlbum = function(id) {
  return this.findById(id)
    .populate("album")
    .then(song => {
      const Album = mongoose.model("album");
      return Album.findById(song.album);
    });
};

SongSchema.statics.addSongToArtistAlbum = (songId, artistArr, albumId) => {
  const Artist = mongoose.model("artists");
  const Album = mongoose.model("album");

  return artistArr.forEach(artistId => {
    Artist.findById(artistId).then(artist=> {
      Album.findById(albumId).then(album => {
        artist.songs.push(songId);

        if(!album.songs.includes(songId)){
          album.songs.push(songId);
        }
        
        return Promise.all([artist.save(), album.save()])
          .then(([artist, album]) => artist)
      })
    })
  });
};

SongSchema.statics.addSongToUser = function(userId, songId) {
  const User = mongoose.model("users");

  return User.findById(userId).then(user => {
    user.likedSongs.push(songId);

    return user.save().then(() => songId);
  });
};

SongSchema.statics.removeSongFromUser = function(userId, songId){
  const User = mongoose.model("users");
  const Song = mongoose.model("songs");

  return User.findById(userId)
    .then( user => {

      return Song.findById(songId)
        .then(song => {
          user.likedSongs.pull(song);

          return user.save().then(() => songId);
        })
    })
}

module.exports = mongoose.model("songs", SongSchema);