import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import annyang from 'annyang';
import axios from 'axios';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { URL } from '../../endpointURL';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { speakText } from './text_to_speack/speaktext';
import tellJoke from './api/telljoke';
import youtube from './api/youtubeAPI';
import tellCountryStateCity from './api/tellCountryStateCity';
import { translateTextToHindi } from './api/translate';
import { searchWiki } from './api/wikipidia';
import { playMusic } from './api/playmusic';
import { BsFillMicFill } from 'react-icons/bs';
import stateContext from '../mycontext/Mycontext';
import getCurrentTimeAndDate from './api/findDateTime';
import gkquize from './api/gkquize';
import todo from './api/todo';
import audiogif from '../assets/image/sirilike.gif';

const VoiceAssistant = () => {
    const { state, loading, updateloadingValue, updateSpeakValue } = useContext(stateContext);
    const [iframeVisible, setIframeVisible] = useState(false);
    const [michidden, setMichidden] = useState(true);
    const [listening, setListening] = useState(false);
    const [anayan, setAnayan] = useState(false);
    const [videoURL, setVideoURL] = useState("");
    const [musicURL, setMusicURL] = useState("");

    const navigate = useNavigate();

    const commands = {
        'Good morning *name': () => speak('Hy Boss Good morning'),
        'Good afternoon *name': () => speak('Hy Boss Good afternoon'),
        'Good evening *name': () => speak('Hy Boss Good evening'),
        'Goodbye *name': () => speak('Goodbye, have a great day!'),
        'What is your name': () => speak('My name is Jarvis', updateloadingValue),
        'Tell me about yourself': () => speak('I am a voice assistant Sidhu Alston created me. if you want to know more about sidhu alston say Sidhu Alston Resume'),
        'Tell me about you': () => speak('I am a voice assistant Sidhu Alston created me.  if you want to know more about sidhu alston say Sidhu Alston Resume'),
        'Who are you': () => speak('I am a voice assistant Sidhu Alston created me.'),
        'Who created you': () => speak('Sidhu Alston created me.'),
        'I am sad': () => speak("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'I like you *name': () => speak("oo realy it is impressive but sorry i am commited for other one"),
        'I love you *name': () => speak("oo realy it is impressive but sorry i am commited for other one"),
        'I hate you *name': () => speak("oo why are you hate me if i make a mistake so sorry."),

        'Sidhu Alston Resume': () => openResume(),
        'Sidhu elstone Resume': () => openResume(),
        'open *name': (name) => openWebsite(name),
        'Open *name': (name) => openWebsite(name),
        // 'Play *name music': (name) => Music(name),
        // 'play music *name': (name) => Music(name),
        // 'Music play *name': (name) => Music(name),
        // 'play *name': (name) => Music(name),
        // 'Play *name song': (name) => Music(name),
        // 'play song *name': (name) => Music(name),
        // 'song play *name': (name) => Music(name),
        // 'play *name': (name) => Music(name),
        // 'play song by *name': (name) => Music(name),

        // '*name music play': (name) => Music(name),
        //Youtube command
        'close youtube': () => closeIframe(),
        'close music': () => closeIframe(),
        'close video': () => closeIframe(),
        'stop music': () => closeIframe(),
        'stop youtube': () => closeIframe(),
        'stop video': () => closeIframe(),
    };
    useEffect(() => {
        if (annyang) {
            if (listening) {
                // Start listening when the 'listening' state is true
                annyang.addCommands(commands);
                annyang.addCallback('result', (phrases) => {
                    console.log(phrases[0])
                    const ansss = isUserInputInCommands(phrases[0])
                    console.log(ansss)
                    // Check if userInput is not in the commands
                    if (!ansss) {
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

    //function for speaking
    const animationupdate = async (value) => {
        setAnayan(value);
        updateSpeakValue(!value)
        return;
    }
    //function for handle loading value
    const loadingupdate = async (value) => {
        updateloadingValue(value)
        return;
    }

    const handlemicshow = () => {
        console.log("Enter")
        setMichidden(true)
    }

    //Speaking precomman
    const speak = async (message) => {
        annyang.abort();
        setListening(false)
        setAnayan(false);
        updateSpeakValue(true);
        await speakText(message);
        updateSpeakValue(false);
    }

    //Resume
    const openResume = () => {
        window.open("https://drive.google.com/drive/folders/15tL9LlhsKSaBF7wdssxFhJ42dB3Hy8bB?usp=sharing", "_blank");
    }
    // Function to close the video
    const closeIframe = () => {
        annyang.abort();
        setListening(false)
        setAnayan(false);
        setIframeVisible(false);

    };

    const handleClick = async () => {
        setListening(!listening);
        setAnayan(!anayan);
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
        try {
            updateloadingValue(true);
            annyang.abort();
            setListening(false);
            setAnayan(false)

            const { data } = await axios.post(`${URL}/findfunction`, { userInput });

            console.log("Find category", data)
            if (data) {
                updateloadingValue(false);
                updateSpeakValue(true);
            }

            switch (data.data) {
                case "Hello":
                    await speakText("Hy Boss, How may I help you");
                    break;
                case "Aboutyou":
                    await speakText("I'm good Boss. I am always ready for you any condition");
                    break;
                case "SidhuAlston":
                    await speakText("Hy this side jarvis, Sidhu Alston is a full stack web developer and content creator on youtube. if you want to know more about sidhu alston say Sidhu Alston Resume");
                    break;
                case "disturb":
                    await speakText("oo, But why are you sad I have some joke for you or you can listen to Dinchak Pooja Song");
                    break;
                case "about_us":
                    await speakText("It is credential information.");
                    await speakText("I have not authenticated for sharing my credential information with anyone.");
                    await speakText("But I am created using MERN technology React.js, Node.js, Express.js, and Mongoose for storing data for updating myself");
                    break;
                case "date":
                case "time":
                    await getCurrentTimeAndDate(data.data);
                    break;
                case "english_joke":
                    await speakText("Yes Boss, I have the latest English jokes for you");
                    await tellJoke();
                    break;
                case "hindi_joke":
                    await handleHindiJoke();
                    break;
                case "gkquize":
                    await speakText("ok I think you want to play quiz game.");
                    await gkquize(animationupdate, loadingupdate);
                    break;
                case "wikipidia":
                    await searchWiki(userInput);
                    break;
                case "translate":
                    await translateTextToHindi(animationupdate, loadingupdate);
                    break;
                case "family_info":
                    await speakText("Sorry, I am an AI voice assistant, so I do not have a family but I have some friends like Google Assistant, Siri, Bing, and others");
                    break;
                case "country":
                case "state":
                case "city":
                case "country_capital":
                case "country_population":
                case "City_Weather":
                case "weather_forecast":
                    await handleCountryStateCity(data.data, userInput);
                    break;
                case "play_youtube":

                    await handleYouTube(userInput);
                    break;
                case "create_todolsit":
                case "update_todolsit":
                case "delete_todolsit":
                case "getAll_todolsit":
                case "get_todolsit":
                    await todo(data.data, animationupdate, loadingupdate);
                    break;
                case "Not_Category":
                    await speakText("Sorry, I don't know much more about that, but with time I am updating myself");
                    break;
                default:
                    break;
            }

            updateSpeakValue(false);
        } catch (err) {
            console.log(err);
        }
    };

    async function handleHindiJoke() {
        await speakText("ओके", "HI");
        updateSpeakValue(false);
        updateloadingValue(true);
        try {
            const { data } = await axios.get('https://hindi-jokes-api.onrender.com/jokes?api_key=bd4c780c41c74b6af4ae1f31bc5d');

            if (data) {
                updateloadingValue(false);
                updateSpeakValue(true);
                await speakText(data.jokeContent.slice(0, -7), "HI");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function handleCountryStateCity(category, userInput) {
        const inputArray = userInput.split(" ");

        const substrings = [];
        for (let i = 0; i < inputArray.length; i++) {
            const substring = [];
            for (let j = i; j < inputArray.length; j++) {
                substring.push(inputArray[j]);
                substrings.push(substring.join(" "));
            }
        }

        await tellCountryStateCity(category, substrings);
    }

    // const Music = async (name) => {
    //     console.log("SSS", name)

    // }

    async function handleYouTube(userInput) {
        try {
            const arr = ['play', 'music', 'song', 'run', 'i', 'want', 'youtube', 'video', 'audio'];
            const sanitizedInput = userInput.split(' ').filter(word => !arr.includes(word)).join(' ');
            // Check if the modified userinput contains "video" and "YouTube"
            const containsVideo = userInput.toLowerCase().includes('video');
            const containsYouTube = userInput.toLowerCase().includes('youtube');
            if (containsYouTube || containsVideo) {
                const videoData = await youtube(userInput);
                setMichidden(false);
                setIframeVisible(true);
                setVideoURL(`https://www.youtube.com/embed/${videoData}?autoplay=1`);

            } else {
                loadingupdate(true)
                await speakText(`Ok music searching`)
                const url = await playMusic(sanitizedInput);
                const propertyName = '320_kbps';
                const finalurl = url[propertyName];
                updateloadingValue(false)
                setAnayan(false);
                setListening(false);
                setMichidden(false);
                setMusicURL(finalurl);

                // setAudioframeVisble(true);
                // Set a timeout to hide the audio frame after 30 seconds
                // setTimeout(() => {
                //     setAudioframeVisble(false);
                // }, 30*1000); // 30,000 milliseconds = 30 seconds
            }


        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="main_container">
            {michidden ? <div onClick={() => { navigate('/doc') }} className="group absolute top-2 right-2">
                <button className="Btn flex items-center justify-start gap-2 w-12 h-12 rounded-full overflow-hidden cursor-pointer relative overflow-hidden transition-all duration-300 linear shadow-md bg-teal-400 group-hover:w-32  group-hover:rounded-xl group-hover:duration-300 group-active:transform group-active:translate-x-2 group-active:translate-y-2">
                    <div className="w-full transition-all duration-300 flex items-center justify-center">
                        <HiOutlineInformationCircle className='absolute transition-all duration-300 text-white text-2xl group-hover:left-6' />
                    </div>
                    <div className="absolute right-0 w-0 opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:w-full group-hover:opacity-100 group-hover:p-2">
                        Doc
                    </div>
                    {/* <div className="absolute right-0 w-0 opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:w-full group-hover:opacity-100 group-hover:p-2">
                        Doc
                    </div> */}
                </button>
            </div> :
                <div onClick={handlemicshow} className="group absolute top-2 right-2">
                    <button className="Btn flex items-center justify-start gap-2 w-12 h-12 rounded-full overflow-hidden cursor-pointer relative overflow-hidden transition-all duration-300 linear shadow-md bg-teal-400 group-hover:w-32  group-hover:rounded-xl group-hover:duration-300 group-active:transform group-active:translate-x-2 group-active:translate-y-2">
                        <div className="w-full transition-all duration-300 flex items-center justify-center">
                            <BsFillMicFill className='absolute transition-all duration-300 text-white text-2xl group-hover:left-6' />
                        </div>
                        <div className="absolute right-0 w-0 opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:w-full group-hover:opacity-100 group-hover:p-2">
                            Show
                        </div>
                        {/* <div className="absolute right-0 w-0 opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:w-full group-hover:opacity-100 group-hover:p-2">
                    Doc
                </div> */}
                    </button>
                </div>
            }

            {!michidden ? <div>
                <div className="youtube_video_container">
                    {iframeVisible ? (
                        <div>
                            <iframe
                                src={videoURL}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                style={{ width: '100vw', height: '100vh' }}
                            ></iframe>
                        </div>
                    ) : <div className="audio">
                        <div className='flex items-center justify-center '>
                            <audio className='absolute bottom-0 w-full' src={musicURL} autoPlay controls ></audio>
                            <img className='w-screen' style={{ height: "96vh " }} src={audiogif} alt="" />
                        </div>
                    </div>}
                </div>

            </div> : ""}

            {michidden ? <div className="mic_animation_container">
                <div className="home_container1">
                    {loading.loading ? (
                        <div className="loader"></div>
                    ) : (
                        <div className="mic" onClick={handleClick}>
                            {listening || anayan ? <FaMicrophone style={{ color: '#000' }} /> : <FaMicrophoneSlash style={{ color: 'red' }} />}
                        </div>
                    )}
                    <div className="circle_container" style={{ animationIterationCount: listening ? 'infinite' : '' }}>
                        {[...Array(4)].map((_, index) => (
                            <span key={index}></span>
                        ))}
                    </div>
                </div>
                <ul className="wave-menu" style={{ width: state.speak ? '243px' : 0, height: state.speak ? '43px' : 0, borderWidth: state.speak ? '4px' : 0 }}>
                    {[...Array(10)].map((_, index) => (
                        <li key={index}></li>
                    ))}
                </ul>
            </div> : ""}


        </div>
    );
};

export default VoiceAssistant;
