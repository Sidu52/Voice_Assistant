require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = 8000;
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/mongoose');
const { NlpManager } = require('node-nlp');
const cmd = require('./comands/comands'); // Make sure this path is correct
const manager = new NlpManager({ languages: ['en'], forceNER: true });
const StringModel = require('./model/stringSchema');
const uniqueStr = require('./model/uniqeString');
const compromise = require('compromise');


app.use(cors());
const corsOptions = {
    origin: process.env.CORS_URL, // Allow only requests from this domain
    optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// Map over the imported `cmd` array to add documents
cmd.map((item) => {
    manager.addDocument('en', item.utterance, item.function);
});

// Add responses answer
manager.addAnswer('en', 'greetings.hello', 'Hello');
manager.addAnswer('en', 'greeting.aboutyou', 'Aboutyou');
manager.addAnswer('en', 'greeting.wiss', 'wiss');
manager.addAnswer('en', 'greetings.bye', 'Bye');
manager.addAnswer('en', 'weather', 'City_Weather');
manager.addAnswer('en', 'country', 'country');
manager.addAnswer('en', 'country_capital', 'country_capital');
manager.addAnswer('en', 'country_population', 'country_population');
manager.addAnswer('en', 'state', 'state');
manager.addAnswer('en', 'city', 'city');
manager.addAnswer('en', 'speak_joke', 'speak_joke');
manager.addAnswer('en', 'family_info', 'family_info');
manager.addAnswer('en', 'music_play', 'music_play');
manager.addAnswer('en', 'youtube_music', 'play_youtube');
manager.addAnswer('en', 'open_website', 'open_website');

// Train and save the model.
(async () => {
    await manager.load();
    // await manager.train();
    // manager.save();
})();

// Define a function to execute user commands
async function executeCommand(userInput) {
    const doc = compromise(userInput);

    // Extract the intent (action)
    const intent = doc.verbs().out('array')[0];

    // Extract the entity (what to open)
    const entity = doc.nouns().out('array')[0];

    if (intent === 'open' && entity) {
        const softwareCommands = {
            skype: 'start skype',
            notepad: 'start notepad.exe',
            chrome: 'start chrome',
            edge: 'start msedge',
            calculator: 'start calc',
            camera: 'start microsoft.windows.camera:',
            alarms: 'start ms-clock:',
        };

        const softwareCommand = softwareCommands[entity];
        return softwareCommand;
    }
}
// Function to save a string to the database
async function saveStringToDatabase(inputString, category) {
    try {
        // Check if the inputString already exists in the database
        const existingString = await StringModel.findOne({ content: inputString });
        if (existingString) {
        } else {
            const newString = new StringModel({
                content: inputString,
                category: category,
            });
            await newString.save();
        }
    } catch (error) {
        console.error('Error saving string to the database:', error);
    }
}
// Function to save a unique string to the database
async function saveUniqueString(inputString) {
    try {
        // Check if the inputString already exists in the database
        const existingString = await uniqueStr.findOne({ content: inputString });
        if (existingString) {
        } else {
            const newString = new uniqueStr({ content: inputString });
            await newString.save();
        }
    } catch (error) {
        console.error('Error saving UniqueString to the database:', error);
    }
}

// Define a function to launch software
async function openSoftware(webname) {
    console.log(webname)
    const softwareCommand = `start ${webname}.exe`;

    exec(softwareCommand, (error) => {
        if (error) {
            console.error(`Error: ${error}`);
            return;
        }
        return;
    });
}

app.post('/findfunction', async (req, res) => {
    const userInput = req.body.userInput; // You can get the user input from the request query
    try {
        const webname = await executeCommand(userInput)
        // Process the user input using the NLP model
        const data = await manager.process('en', userInput)
        if (!data.answer) {
            saveUniqueString(userInput);
        } else {
            saveStringToDatabase(userInput, data.answer);
        }
        if (data.answer === "open_website") {
            await openSoftware(webname);
        }
        return res.status(200).json({ message: 'find data sucessfull', data: data.answer || "Not_Category" });
        // return res.status(200).json({ message: 'find data sucessfull', data });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});



//SetIp Exprees server
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is Successfully Running, and App is listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
