// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require('fs');
const uniqid = require('uniqid');
const util = require('util');
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//GET Request
//Show the index HTML
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/notes', function (req, res) {
  res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', async function (req, res) {
  try {
    const db = await readFileAsync('db/db.json', 'utf8');
    res.json(JSON.parse(db));
  } catch (error) {
    console.log(err);
  }
});

app.post('/api/notes', async function (req, res) {
  try {
    const db = await readFileAsync('db/db.json', 'utf8');
    let dbParse = JSON.parse(db);
    const newNote = req.body;
    newNote.id = uniqid();
    dbParse.push(newNote);
    await writeFileAsync('db/db.json', JSON.stringify(dbParse));
    res.json(true)
  } catch (error) {
    console.log(error);
  }
});

app.delete('/api/notes/:id', async function (req, res) {
  try {
    const db = await readFileAsync('db/db.json', 'utf8');
    const id = req.params.id;
    let dbParsed = JSON.parse(db);
    const filtered = dbParsed.filter(note => note.id !== id);
    await writeFileAsync('db/db.json', JSON.stringify(filtered));
    res.json(true);
  } catch (error) {
    console.log(error)
  }
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});