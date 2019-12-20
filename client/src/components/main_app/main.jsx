import React, { Component } from "react";
import { withRouter } from "react-router";
import { Switch, Route } from 'react-router-dom';
import Nav from "../Nav";
import HomeComponent from './home';
import MusicPlayer from '../music_player';
import Search from "./search/search";
import ArtistShow from "./artist/artist_show";
import AlbumShow from "./album/album_show";
import PlaylistIndex from "./playlist/playlist_index";
import { Query } from "react-apollo";
import Queries from "../../graphql/queries";
import PlaylistShow from "./playlist/playlist_show";
import CreatePlaylist from "./playlist/create_playlist";
const {CURRENT_USER_ID} = Queries;

class MainComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSong: null,
      modal: false
    };
    this.toPage = this.toPage.bind(this);
    this.update = this.update.bind(this);
    this.setCurrentSong = this.setCurrentSong.bind(this);
    this.playSongNow = this.playSongNow.bind(this);
    this.playAlbumNow = this.playAlbumNow.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  toPage(page) {
    return this.props.history.push(`/${page}`);
  }

  update(field) {
    return e => this.setState({ [field]: e.target.value });
  }

  setCurrentSong(song) {
    this.setState({ currentSong: song });
  }

  playSongNow(song) {
    this.musicPlayer.playSongNow(song);
  }

  playAlbumNow(albumSongs) {
    this.musicPlayer.playAlbumNow(albumSongs);
  }

  openModal() {
    console.log("show modal")
    this.setState({ modal: true });
  }

  closeModal() {
    this.setState({ modal: false });
  }

  render() {
    return (
      <Query query={CURRENT_USER_ID}>
        {({ loading, error, data }) => {
          return (
            <main className="overall-container">
              <nav className="top-nav">
                <Nav />
              </nav>
              <aside className="main-nav">
                <h2>
                  <i className="fas fa-graduation-cap"></i> Study-fi
                </h2>
                <ul className="main-links">
                  <li key="1" onClick={() => this.toPage("")}>
                    <i className="fas fa-university"></i>
                    <p>Home</p>
                  </li>
                  <li key="2" onClick={() => this.toPage("search")}>
                    <i className="fas fa-search"></i>
                    <p>Search</p>
                  </li>
                  <li key="3">
                    <i className="fas fa-book"></i>
                    <p>Your Library</p>
                  </li>
                </ul>
                <h3>PLAYLISTS</h3>
                <PlaylistIndex currentUserId={data.currentUserId} />
                <div className="new-playlist">
                  <i
                    className="fas fa-plus-square"
                    onClick={this.openModal}
                  ></i>
                  <p>Create Playlist</p>
                </div>
              </aside>
              <section className="main-container">
                <Switch>
                  <Route
                    path="/artist/:artistId"
                    render={props => (
                      <ArtistShow {...props} playSongNow={this.playSongNow} />
                    )}
                  />
                  <Route
                    path="/album/:albumId"
                    render={props => (
                      <AlbumShow
                        {...props}
                        playSongNow={this.playSongNow}
                        playAlbumNow={this.playAlbumNow}
                        currentSong={this.state.currentSong}
                      />
                    )}
                  />
                  <Route
                    path="/search"
                    render={props => <Search playSongNow={this.playSongNow} />}
                  />
                  <Route path="/" component={HomeComponent} />
                </Switch>
              </section>
              <div className="music-player">
                <MusicPlayer
                  onRef={ref => (this.musicPlayer = ref)}
                  setCurrentSong={this.setCurrentSong}
                />
              </div>
              {this.state.modal ? (
                <div id="modal-outter-container" onClick={this.closeModal}>
                  <div
                    id="modal-innder-container"
                    onClick={e => e.stopPropagation()}
                  >
                    <CreatePlaylist currentUserId={data.currentUserId} />
                  </div>
                </div>
              ) : null}
            </main>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(MainComponent);