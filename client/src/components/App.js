import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Route, Switch, HashRouter } from "react-router-dom";
import AuthRoute from "../util/route_util";
import Login from "./Login";
import Nav from "./Nav";
import MusicPlayer from './music_player';
import UserShow from "./user/User_Show";
import "./css_index.css";
import SongIndex from "./song/song_index";
import MainComponent from './main_app/main';

const App = () => {
  return (
    <div>
      <h1>Study-fi</h1>

        <Nav />
        <AuthRoute exact path="/login" component={Login} routeType="auth" />
        <UserShow />
        <MusicPlayer />
        <SongIndex />
    </div>
  );
};

export default App;
