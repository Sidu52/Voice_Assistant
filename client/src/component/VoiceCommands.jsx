import React, { useEffect } from 'react';
import annyang from 'annyang';
import jokesData from '../data/jokeData';
import axios from 'axios';
import { cmd } from '../data/startingCmd';

const VoiceCommands = () => {
    useEffect(() => {
        const commands = {
            'Good morning': () => speakText('Hy Boss Good morning'),
            'Good afternoon': () => speakText('Hy Boss Good afternoon'),
            'Good evening': () => speakText('Hy Boss Good evening'),
            'Goodbye': () => speakText('Goodbye, have a great day!'),
            'What is your name': () => speakText('My name is Jarvis'),
            'Tell me about yourself': () => speakText('I am a voice assistant Sidhu Alston created me.'),
            'Who created you': () => speakText('Sidhu Alston created me.'),
            'Tell me a joke': tellJoke,
            'Tell me about *country': tellCountry,
            'what is a capital of *country': tellCapital,
            'what is a population of *country': tellPopulation,
            '*any': () => speakText("Sorry, I don't know much more about that, but with time I am updating myself."),
        };

        if (annyang) {
            annyang.addCommands(commands);
            annyang.start();
        }
    }, []);

    const speakText = (message) => {
        if ('speechSynthesis' in window) {
            const synthesis = window.speechSynthesis;
            const utterance = new SpeechSynthesisUtterance(message);
            synthesis.speak(utterance);
        } else {
            alert('Your browser does not support the Speech Synthesis API.');
        }
    };

    const tellJoke = () => {
        const randomJoke = jokesData[Math.floor(Math.random() * jokesData.length)];
        speakText(randomJoke);
    };

    const tellCountry = async (country) => {
        try {
            const { data } = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
            if (data) {
                speakText(`${country} is a ${data[0].continents[0]} beautiful Country and the official name is ${data[0].name.nativeName?.eng?.official}and ${data[0].name?.nativeName?.hin?.official}`);
                speakText(`The name of these country is ${data[0].name?.common} and the capital of that country is ${data[0].capital}`);
                speakText(`The area of ${country} is ${data[0].area} kilometers and ${country} border is shared with ${data[0].borders?.length} countries border`);
            } else {
                speakText(`Sorry ${country} country is not found`);
            }
        } catch (err) {
            console.error(err);
            speakText('Sorry, there was an error fetching country data');
        }
    };

    const tellCapital = async (country) => {
        try {
            const { data } = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
            if (data) {
                speakText(`The Capital of ${country} is a ${data[0].capital}`);
            } else {
                speakText(`Sorry ${country} country is not found`);
            }
        } catch (err) {
            console.error(err);
            speakText('Sorry, there was an error fetching country data');
        }
    };

    const tellPopulation = async (country) => {
        try {
            const { data } = await axios.get(`https://restcountries.com/v3.1/name/${country}`);
            if (data) {
                speakText(`The population of ${country} is a ${data[0].population} population`);
            } else {
                speakText(`Sorry ${country} country is not found`);
            }
        } catch (err) {
            console.error(err);
            speakText('Sorry, there was an error fetching country data');
        }
    };

    return (
        <div>
            <h1>Voice Commands Example</h1>
            <p>The application is automatically listening. Speak something to trigger voice recognition.</p>
        </div>
    );
};

export default VoiceCommands;
