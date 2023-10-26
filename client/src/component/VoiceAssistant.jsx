import React, { useEffect, useState } from 'react';
import annyang from 'annyang';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { speakText } from './text_to_speack/speaktext';
import { Country, State, City } from 'country-state-city';
import { tellCountry, tellState, tellCity, tellCapital, tellPopulation } from './aboutCountryStateCity/CSC';
import { cityWeather } from './api/weatherAPi'
import tellJoke from './api/telljoke';
import { URL } from '../../endpointURL';
import youtube from './api/youtubeAPI';

const VoiceAssistant = () => {
    const [listening, setListening] = useState(false);
    const [Speak, setSpeak] = useState(false);
    const [videoURL, setVideoURL] = useState("");


    const commands = {
        'Good morning *name': () => speakText('Hy Boss Good morning'),
        'Good afternoon *name': () => speakText('Hy Boss Good afternoon'),
        'Good evening *name': () => speakText('Hy Boss Good evening'),
        'Goodbye *name': () => speakText('Goodbye, have a great day!'),
        'What is your name': () => speakText('My name is Jarvis'),
        'Tell me about yourself': () => speakText('I am a voice assistant Sidhu Alston created me.'),
        'Tell me about you': () => speakText('I am a voice assistant Sidhu Alston created me.'),
        'Who are you': () => speakText('I am a voice assistant Sidhu Alston created me.'),
        'Who created you': () => speakText('Sidhu Alston created me.'),
        'I am feeling sad': () => speakText("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'I am feeling boring': () => speakText("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'I am sad': () => speakText("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'open *name': (name) => openWebsite(name),
        'Open *name': (name) => openWebsite(name),

    };

    useEffect(() => {
        if (annyang) {
            if (listening) {
                // Start listening when the 'listening' state is true
                annyang.addCommands(commands);

                annyang.addCallback('result', (phrases) => {
                    console.log(phrases[0])
                    // Check if userInput is not in the commands
                    if (!isUserInputInCommands(phrases[0])) {
                        findCategory(phrases[0]);
                    }
                });
                annyang.start();
            } else {
                // Stop listening when the 'listening' state is false
                annyang.abort();
            }
        }
        // Clean up the annyang callbacks when the component unmounts
        return () => {
            annyang.removeCommands();
            annyang.removeCallback('result');
        };
    }, [listening]);

    const handleClick = async () => {
        setListening(!listening);
    }

    const isUserInputInCommands = (userInput) => {
        return Object.keys(commands).some(command => {
            const commandWithoutWildcards = command.replace(/\*\w+/g, '').trim();
            return userInput.toLowerCase() === commandWithoutWildcards.toLowerCase();
        });
    };

    const openWebsite = (name) => {
        // Make sure the name is in a valid format (e.g., without spaces and special characters)
        const sanitizedName = name.replace(/\s/g, '');

        if (sanitizedName) {
            const url = `https://www.${sanitizedName}.com`;
            window.location.href = url
        } else {
            console.log('Invalid website name provided.');
        }
    };
    //Find Category
    const findCategory = async (userInput) => {
        // if userInput not avaiable in cmmmands array that it  tun
        try {
            // const { data } = await axios.post(import.meta.env.VITE_VITE_ENDPOINT_URL, { userInput });
            const { data } = await axios.post(`${URL}/findfunction`, { userInput });

            let CSCname = ""
            const inputArray = userInput.split(" ");
            // Initialize an array to store the substrings
            var substrings = [];
            // Loop through the words and generate substrings
            for (var i = 0; i < inputArray.length; i++) {
                for (var j = i; j < inputArray.length; j++) {
                    var substring = inputArray.slice(i, j + 1).join(" ");
                    substrings.push(substring);
                }
            }
            if (data.data == "Hello") {
                speakText("Helo Boss, How may I help you")
            }
            else if (data.data == "Aboutyou") {
                speakText("I'm good Boss. I am always ready for you any conddition")
            }

            else if (data.data === "country" || data.data === "state" || data.data === "city") {
                for (let input of substrings) {
                    if (CSCname === "") {
                        const country = Country.getAllCountries().find(c => c.name === input);
                        if (country) {
                            CSCname = country.isoCode;
                            return tellCountry(CSCname);
                        }
                        if (CSCname === "") {
                            const state = State.getAllStates().find(s => s.name === input);
                            if (state) {
                                CSCname = state?.isoCode;
                                return tellState(CSCname, state.countryCode);
                            }
                        }

                        if (CSCname === "") {
                            const city = City.getAllCities().find(city => city.name === input);
                            if (city) {
                                CSCname = city.name;
                                return tellCity(city.stateCode, CSCname, city.countryCode);
                            }
                        }
                    }
                }
            } else if (data.data == "City_Weather") {
                for (let input of substrings) {
                    const city = City.getAllCities().find(city => city.name === input);
                    if (city) {
                        speakText(`I understand your concern you asking about Weather`)
                        return cityWeather(city.name);
                    }
                }
            } else if (data.data == "play_youtube") {
                const data = await youtube(userInput);
                setVideoURL(`https://www.youtube.com/embed/${data}?autoplay=1`)
            } else if (data.data == "speak_joke") {
                tellJoke();
            } else if (data.data == "family_info") {
                speakText("Sorry, I am AI voice assistant so i have not a family but i have some friend Google Assistant, Siri, Bing others friend")
            } else if (data.data === "country_capital" || data.data === "country_population") {
                for (let input of substrings) {
                    const country = Country.getAllCountries().find(city => city.name === input);
                    if (country) {
                        if (data.data === "country_capital") {
                            tellCapital(country.name)
                        } else {
                            tellPopulation(country.name)
                        }
                    }
                }
            } else if (data.data === "Not_Category") {
                speakText("Sorry, I don't know much more about that, but with time I am updating myself.");
            }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <>
            <iframe width="560" height="315" src={videoURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            <div className="home_container">
                <div className="mic" onClick={handleClick}>
                    {listening ? <FaMicrophone /> : <FaMicrophoneSlash style={{ color: "red" }} />}
                </div>
                <div className="container" style={{ animationIterationCount: listening ? "infinite" : "" }}>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="loading" >
                    <span style={{ animationIterationCount: Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: Speak ? "infinite" : "" }}></span>
                </div>

            </div>
        </>


    );
};

export default VoiceAssistant;
