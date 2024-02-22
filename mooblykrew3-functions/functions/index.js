const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();
const app = require('express')();
const firebase = require('firebase');

const config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

firebase.initializeApp(config);

const db = admin.firestore();

app.get('/songs', (req, res) => {
    db.collection('songs')
    .orderBy('createdAt', 'desc')
    .get()
        .then(data => {
            let songs = [];
            data.forEach(doc => {
                songs.push({
                    songId: doc.id,
                    artistName: doc.data().artistName,
                    songName: doc.data().songName,
                    albumName: doc.data().albumName,
                    genre: doc.data().genre,
                    createdAt: doc.data().createdAt
                });
            });
            return res.json(songs);
        })
        .catch(err => console.error(err));
});

 app.post('/song', (req, res) => {
  
  const noAudio = "933237380259.mp3";
  
  const newSong = {
        artistName: req.body.artistName,
        songName: req.body.songName,
        albumName: req.body.albumName,
        genre: req.body.genre,
        createdAt: new Date().toISOString(),
        audioUrl: ``
    };

    db.collection('songs')
        .add(newSong)
        .then(doc => {
            res.json({ message: `document ${doc.id} created successfully`});
        })
        .catch(err => {
            res.status(500).json({ error: 'something went horribly wrong' });
            console.error(err);
        })
});

exports.api = functions.https.onRequest(app); //turns into multiple routes