require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

//Our routes go here:
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artist-search", (req, res) => {
  const { artist } = req.query;
  spotifyApi
    .searchArtists(artist)
    .then((data) => {
      res.render("artist-search-results", { artist: data.body.artists.items });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", function (req, res, next) {
  spotifyApi
    .getArtist(req.params.artistId)
    .then((data) => {
      return data.body;
    })
    .then((artist) => {
      spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then((data) => {
          res.render("albums", {
            albums: data.body.items,
            artist: artist,
          });
        })
        .catch((err) =>
          console.log("error: ", err)
        );
    })
    .catch((err) =>
      console.log("error: ", err)
    );
});


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
