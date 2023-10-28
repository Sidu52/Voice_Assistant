import React, { useEffect, useState, useContext } from 'react';
import annyang from 'annyang';
import axios from 'axios';
import { URL } from '../../endpointURL';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { speakText } from './text_to_speack/speaktext';
import tellJoke from './api/telljoke';
import youtube from './api/youtubeAPI';
import tellCountryStateCity from './api/tellCountryStateCity';
import { translateTextToHindi } from './api/translate';
import { searchWiki } from './api/wikipidia';
import stateContext from '../mycontext/Mycontext';

const VoiceAssistant = () => {
    const { state, loading, updateloadingValue, updateSpeakValue } = useContext(stateContext);

    const [iframeVisible, setIframeVisible] = useState(false);
    const [listening, setListening] = useState(false);
    const [videoURL, setVideoURL] = useState("");

    const commands = {
        'Hello': () => speakText('Hello How may I help you?'),
        'Good morning *name': () => speakText('Hy Boss Good morning'),
        'Good afternoon *name': () => speakText('Hy Boss Good afternoon'),
        'Good evening *name': () => speakText('Hy Boss Good evening'),
        'Goodbye *name': () => speakText('Goodbye, have a great day!'),
        'What is your name': () => speakText('My name is Jarvis', updateloadingValue),
        'Tell me about yourself': () => speakText('I am a voice assistant Sidhu Alston created me.'),
        'Tell me about you': () => speakText('I am a voice assistant Sidhu Alston created me.'),
        'Who are you': () => speakText('I am a voice assistant Sidhu Alston created me.'),
        'Who created you': () => speakText('Sidhu Alston created me.'),
        'I am feeling sad': () => speakText("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'I am feeling boring': () => speakText("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'I am sad': () => speakText("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'open *name': (name) => openWebsite(name),
        'Open *name': (name) => openWebsite(name),
        'tell me about *name': (name) => searchWiki(name),
        'Who is a *name': (name) => searchWiki(name),
        'who is the *name': (name) => searchWiki(name),
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

    const closeIframe = () => {
        setIframeVisible(false);
    };

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
        updateloadingValue(true)
        try {
            annyang.abort();
            setListening(false)
            var substrings = [];
            const { data } = await axios.post(`${URL}/findfunction`, { userInput });
            const inputArray = userInput.split(" ");
            // Loop through the words and generate substrings
            for (var i = 0; i < inputArray.length; i++) {
                for (var j = i; j < inputArray.length; j++) {
                    var substring = inputArray.slice(i, j + 1).join(" ");
                    substrings.push(substring);
                }
            }
            if (data.data == "Hello") {
                speakText("Helo Boss, How may I help you")
            } else if (data.data == "Aboutyou") {
                speakText("I'm good Boss. I am always ready for you any conddition")
            } else if (data.data == "english_joke") {
                speakText("Yes Boss I have a latest hidni and english jokes for you");
                tellJoke();
            } else if (data.data == "hindi_joke") {
                // speakText("ओके हिंदी में चुटकुले सुना रहा हूं", "HI");/
                speakText("ओके", "HI");
                const { data } = await axios.get('https://hindi-jokes-api.onrender.com/jokes?api_key=bd4c780c41c74b6af4ae1f31bc5d');
                speakText(data.jokeContent, "HI");
            }
            else if (data.data == "translate") {
                translateTextToHindi(userInput)
            } else if (data.data == "family_info") {
                speakText("Sorry, I am AI voice assistant so i have not a family but i have some friend Google Assistant, Siri, Bing others friend")
            } else if (data.data === "country" || data.data === "state" || data.data === "city" || data.data === "country_capital" || data.data === "country_population" || data.data == "City_Weather") {
                await tellCountryStateCity(data.data, substrings);
            }
            else if (data.data == "play_youtube") {
                const data = await youtube(userInput);
                setIframeVisible(true)
                setVideoURL(`https://www.youtube.com/embed/${data}?autoplay=1`)
            } else if (data.data === "Not_Category") {
                speakText("Sorry, I don't know much more about that, but with time I am updating myself.");
            }
        } catch (err) {
            console.log(err)
        }
    }


    return (
        <div className='main_container'>
            <div className='youtube_video_container'>
                {iframeVisible ?
                    <div>
                        <iframe src={videoURL} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        <button className='close_btn' onClick={closeIframe}><AiOutlineCloseCircle /></button>
                    </div>
                    :
                    ""
                }
            </div>
            <div className="mic_animation_container">
                <div className="home_container1">
                    <div className="mic" onClick={handleClick}>
                        {listening ? <FaMicrophone style={{ color: "#000" }} /> : <FaMicrophoneSlash style={{ color: "red" }} />}
                    </div>
                    <div className='circle_container' style={{ animationIterationCount: listening ? "infinite" : "" }}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                </div>
            </div>
            {loading ?
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <div class="typing-indicator">
                        <div class="typing-circle"></div>
                        <div class="typing-circle"></div>
                        <div class="typing-circle"></div>
                        <div class="typing-shadow"></div>
                        <div class="typing-shadow"></div>
                        <div class="typing-shadow"></div>
                    </div>
                </div> :
                <div className="loading" >
                    <span style={{ animationIterationCount: state.Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: state.Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: state.Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: state.Speak ? "infinite" : "" }}></span>
                    <span style={{ animationIterationCount: state.Speak ? "infinite" : "" }}></span>
                </div>
            }
            {/* <div className="home_container">
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
            </div> */}
        </div>


    );
};

export default VoiceAssistant;
