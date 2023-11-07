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
            resolve(null); // Reject the promise in case of an error
        };
        recognition.onend = () => {
            // If onresult is not called before onend, consider it an error
            resolve(null);
        };
        recognition.start();
    });
};

const transl = async (sentence, from, to) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set('q', sentence);
    encodedParams.set('source', from); // Source language is English
    encodedParams.set('target', to); // Target language is Hindi
    try {
        const { data } = await axios.post("https://google-translate1.p.rapidapi.com/language/translate/v2", encodedParams, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com'
            },
        });
        await speakText(data.data.translations[0].translatedText, to);//IT is not working speakText only speak endlishS
    } catch (error) {
        console.error("Translation error:", error);
        return await speakText("Somting Wrong with me try again")
    }
};

const translateTextToHindi = async (animationupdate, loadingupdate) => {
    try {
        let i = 0;
        await speakText("ok, I think you want to use translate. Please speak first language.");
        const { data } = await axios.get("https://pkgstore.datahub.io/core/language-codes/language-codes_json/data/97607046542b532c395cf83df5185246/language-codes_json.json");
        animationupdate(true);
        let From = await takeInput();
        i = 0;
        while (!From && i < 5) {
            await speakText("Sorry input not found try again");
            i++
            From = await takeInput();
        }
        if (i == 5) {
            return await speakText("Sorry input not found thanks for using")
        }
        const FromLanguage = (data.find(language => language.English === From));
        animationupdate(false);
        await speakText(`Your first language is ${From}`);
        await speakText(`Please speak target language.`);
        animationupdate(true);
        let target = await takeInput();
        i = 0;
        while (!target && i < 5) {
            await speakText("Sorry input not found try again");
            target = await takeInput();
        }
        if (i == 5) {
            return speakText("Sorry input not found thank for using");
        }
        const targetLanguage = (data.find(language => language.English === target));
        animationupdate(false);
        await speakText(`Your target language is ${target}`);
        await speakText("Please speak the sentence or word that you want to translate.");
        animationupdate(true);
        let sentence = await takeInput();
        i = 0;
        while (!sentence && i < 5) {
            await speakText("Sorry input not found try again");
            i++
            sentence = await takeInput();
        }
        if (i == 5) {
            return speakText("Sorry input not found thank for using");
        }
        animationupdate(false);
        return transl(sentence, FromLanguage.alpha2, targetLanguage.alpha2);
    }
    catch (err) {
        console.error("Error:", err);
        return await speakText("Sorry Somthing wrong with us.")
    }
}
export { translateTextToHindi, takeInput };
