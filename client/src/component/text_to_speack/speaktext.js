const speakText = (message) => {
    if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(message);

        utterance.rate = 0.7; // For slower speech, use a value < 1


        utterance.volume = 1; // A value between 0 (silent) and 1 (max volume)

        synthesis.speak(utterance);
    } else {
        alert('Your browser does not support the Speech Synthesis API.');
    }
};

export default speakText;