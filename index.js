require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');
const os = require('os');
const app = express();
const PORT = 8000;
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/mongoose');
const { NlpManager } = require('node-nlp');
// const cmd = require('./comands/comands'); // Make sure this path is correct
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
// cmd.map((item) => {
//     manager.addDocument('en', item.utterance, item.function);
// });

// Add responses answer
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
            skype: 'start skype',//Skype
            notepad: 'start notepad.exe',//notepad
            chrome: 'start chrome',//chrome
            edge: 'start msedge',//edge
            calculator: 'start calc',//calculator
            camera: 'start microsoft.windows.camera:',// camera
            alarms: 'start ms-clock:',//Clock
            mail: 'start outlook', // Mail
            filemanager: 'start explorer', // File manager
            word: 'start winword', // Microsoft Word
            excel: 'start excel', // Microsoft Excel
            powerpoint: 'start powerpnt', //Microsoft PowerPoint
            vlc: 'start vlc', // VLC media player
            photoshop: 'start photoshop', // Adobe Photoshop
            acrobat: 'start acrobat', // Adobe Acrobat Reader
            vscode: 'start code', //Visual Studio Code
            terminal: 'start cmd', //command prompt
            cmd: 'start cmd', //command prompt
        };
        const softwareCommand = softwareCommands[entity.toLowerCase()];
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
async function openSoftware(command) {
    const platform = os.platform(); // Get the user's operating system platform
    switch (platform) {
        case 'win32':
        case 'win64':
            // const softwareCommand = `start ${command}.exe`;
            const softwareCommand = `start "" "C:\\Program Files\\${command}\\${command}.exe"`;
            exec(softwareCommand, (error) => {
                if (error) {
                    console.error(`Error: ${error}`);
                }
            });
            break;
        case 'linux':
        case 'darwin':
            const shellCommand = command;
            exec(shellCommand, (error) => {
                if (error) {
                    console.error(`Error: ${error}`);
                }
            });
            break;
        case 'android':
            const adbCommand = `adb shell ${command}`;
            exec(adbCommand, (error) => {
                if (error) {
                    console.error(`Error: ${error}`);
                }
            });
            break;
        default:
            console.error('Unsupported operating system:', platform);
            break;
    }
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
