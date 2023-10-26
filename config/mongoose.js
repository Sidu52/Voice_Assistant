const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Sidhu:Sidu&7879@cluster0.fca4n63.mongodb.net/backup_Cmd");// Connect mongoose using URL
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Error connecting to MongoDB"));

db.once('open', () => {
    console.log("Connected to Database :: MongoDB ")
});

module.exports = db;