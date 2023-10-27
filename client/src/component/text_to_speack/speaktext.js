import { useContext } from "react";
import SateContext from "../../mycontext/Mycontext";
// const { updateSpeakValue } = useContext(SateContext);
const speakText = (message, lang = 'en') => {
    // updateSpeakValue(true);
    if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = lang;
        utterance.rate = 0.7; // For slower speech, use a value < 1
        utterance.volume = 1; // A value between 0 (silent) and 1 (max volume)

        synthesis.speak(utterance);
        // updateSpeakValue(false);
    } else {
        alert('Your browser does not support the Speech Synthesis API.');
    }
};

export { speakText };