require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 8000;
const cors = require("cors");
const db = require('./config/mongoose');
// const cmd = require('./comands/comands'); // Make sure this path is correct
const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'], forceNER: true });



app.use(cors());
const corsOptions = {
    origin: process.env.CORS_URL, // Allow only requests from this domain
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
// Middleware to parse JSON request bodies
app.use(express.json());
// Train and save the model.

// Map over the imported `cmd` array to add documents
// cmd.map((item) => {
//     manager.addDocument('en', item.utterance, item.function);
// });


// // Add responses answer
// manager.addAnswer('en', 'greetings.hello', 'Hello');
// manager.addAnswer('en', 'greeting.aboutyou', 'Aboutyou');
// manager.addAnswer('en', 'greeting.wiss', 'wiss');
// manager.addAnswer('en', 'greetings.bye', 'Bye');
// manager.addAnswer('en', 'weather', 'City_Weather');
// manager.addAnswer('en', 'country', 'country');
// manager.addAnswer('en', 'country_capital', 'country_capital');
// manager.addAnswer('en', 'country_population', 'country_population');
// manager.addAnswer('en', 'state', 'state');
// manager.addAnswer('en', 'city', 'city');
// manager.addAnswer('en', 'speak_joke', 'speak_joke');
// manager.addAnswer('en', 'family_info', 'family_info');
// manager.addAnswer('en', 'music_play', 'music_play');
// manager.addAnswer('en', 'youtube_music', 'play_youtube');
// manager.addAnswer('en', 'open_website', 'open_website');
// manager.addAnswer('en', 'translate', 'translate');

// (async () => {
//     // await manager.load();
//     await manager.train();
//     manager.save();
// })();

// Set routes
app.use('/', require('./router'));
// app.use('/toggle', require('./routes/post'));

//SetIp Exprees server
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
