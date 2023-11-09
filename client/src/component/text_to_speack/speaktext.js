// export { speakText };
const voiceName = 'Google हिन्दी';

const speakText = (message, lang = 'en') => {
    return new Promise((resolve, reject) => {

        if ('speechSynthesis' in window) {
            const synthesis = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = lang;
            utterance.rate = 1;
            utterance.volume = 1;
            // Get available voices
            const availableVoices = synthesis.getVoices();
            // Find the voice by name or default to the first available voice
            const selectedVoice = availableVoices.find((voice) => voice.name === voiceName) || availableVoices[0];
            utterance.voice = selectedVoice;

            utterance.onend = () => {
                resolve(); // Resolves the Promise when speech is done
            };

            utterance.onerror = (error) => {
                reject(error); // Rejects the Promise on error
            };

            synthesis.speak(utterance);
            console.log(message)


        } else {
            reject('Your browser does not support the Speech Synthesis API.');
        }
    });
};


speakText('')
    .then(() => {
        console.log('Speech completed.');
    })
    .catch((error) => {
        console.error('Error:', error);
    });

export { speakText };