
// const speakText = (message, lang = 'en') => {
//     console.log(message, lang)
//     // updateloadingValue(false);
//     if ('speechSynthesis' in window) {
//         const synthesis = window.speechSynthesis;
//         const utterance = new SpeechSynthesisUtterance(message);
//         utterance.lang = lang;
//         utterance.rate = 0.8; // For slower speech, use a value < 1
//         utterance.volume = 1; // A value between 0 (silent) and 1 (max volume)

//         synthesis.speak(utterance);
//         // callingfuntion(false);
//     } else {
//         alert('Your browser does not support the Speech Synthesis API.');
//     }
// };
const speakText = (message, lang = 'en') => {
    return new Promise((resolve, reject) => {
        if ('speechSynthesis' in window) {
            const synthesis = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = lang;
            utterance.rate = 0.8;
            utterance.volume = 1;

            utterance.onend = () => {
                resolve(); // Resolves the Promise when speech is done
            };

            utterance.onerror = (error) => {
                reject(error); // Rejects the Promise on error
            };

            synthesis.speak(utterance);
        } else {
            reject('Your browser does not support the Speech Synthesis API.');
        }
    });
};

export { speakText };