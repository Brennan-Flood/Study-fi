const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLID } = graphql;
const mongoose = require("mongoose");
const AuthService = require("../services/auth");
const UserType = require("./types/user_type");
const MusicType = require("./types/song_type");
const Song = require("../models/Song");
const Album = require("../models/Album");
const AlbumType = require("./types/album_type");
const ArtistType = require("./types/artist_type");
const Artist = require('../models/Artist');

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.register(args);
      }
    },
    login: {
      type: UserType,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.login(args);
      }
    },
    logout: {
      type: UserType,
      args: {
        _id: { type: GraphQLID }
      },
      resolve(_, args) {
        return AuthService.logout(args);
      }
    },
    verifyUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString }
      },
      resolve(_, args) {
        return AuthService.verifyUser(args);
      }
    },
    createSong: {
      type: MusicType,
      args: {
        name: {type: GraphQLString},
        artist: {type: GraphQLString},
        album: {type: GraphQLString},    
        duration: {type: GraphQLInt},
        songUrl: {type: GraphQLString},
      },
      resolve(_, args) {
        return new Song({ name: args.name, artist: args.artist, album: args.album, duration: args.duration, songUrl: args.songUrl}).save();
      }
    },
    createAlbum: {
      type: AlbumType,
      args: {
        name: { type: GraphQLString },
        year: { type: GraphQLInt }
      },
      resolve(_, { name, year }){
        return new Album({ name: name, year: year }).save();
      }
    },
    createArtist: {
      type: ArtistType,
      args: {
        name: {type: GraphQLString }
      },
      resolve(_, args) {
        return new Artist({ name: args.name }).save()
      }
    },
    addArtistAlbum: {
      type: ArtistType,
      args: {
        artistId: { type: GraphQLID },
        albumId: { type: GraphQLID }
      },
      resolve(_, { artistId, albumId }){
        return Artist.addAlbum(artistId, albumId);
      }
    }
  }
});

module.exports = mutation;