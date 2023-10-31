import axios from "axios";
import { speakText } from "../text_to_speack/speaktext";


const takeInput = () => {
    return new Promise((resolve, reject) => {
        const recognition = new webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const output = event.results[0][0].transcript;
            resolve(output); // Resolve the promise with the recognized text
        };
        recognition.onerror = (error) => {
            reject(error); // Reject the promise in case of an error
        };
        recognition.onend = () => {
            // If onresult is not called before onend, consider it an error
            reject("Speech recognition ended without result.");
        };
        recognition.start();
    });
};

const transl = async (sentence, foundLanguage) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set('q', sentence);
    encodedParams.set('source', 'en'); // Source language is English
    encodedParams.set('target', foundLanguage); // Target language is Hindi

    try {
        const { data } = await axios.post("https://google-translate1.p.rapidapi.com/language/translate/v2", encodedParams, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
        });
        await speakText(data.data.translations[0].translatedText, foundLanguage);//IT is not working speakText only speak endlishS
    } catch (error) {
        console.error("Translation error:", error);
    }
};
const translateTextToHindi = async (animationupdate, loadingupdate) => {
    try {
        await speakText("Ok, I think you want to use translate. Please speak translate language.");
        animationupdate(true);
        let targetLanguage = await takeInput();
        loadingupdate(true);
        if (targetLanguage) {
            // Fetch the language code for the target language
            const { data } = await axios.get("https://pkgstore.datahub.io/core/language-codes/language-codes_json/data/97607046542b532c395cf83df5185246/language-codes_json.json");
            loadingupdate(false);
            animationupdate(false);
            const foundLanguage = (data.find(language => language.English === targetLanguage));
            if (foundLanguage) {
                await speakText("Please speak the sentence or word that you want to translate.");
                animationupdate(true);
                let sentence = await takeInput();
                if (sentence) {
                    animationupdate(false);
                    return transl(sentence, foundLanguage.alpha2);
                }
                animationupdate(false);f
            } else {
                return await speakText("Language not found.");
            }
        }
    } catch (err) {
        console.error("Error:", err);
    }
}
export { translateTextToHindi, takeInput };
