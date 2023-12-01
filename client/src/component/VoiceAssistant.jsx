import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import annyang from 'annyang';
import axios from 'axios';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { URL } from '../../endpointURL';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { IoCloseCircleOutline } from 'react-icons/io5';
import alarmImage from '../assets/image/alarmB.gif';
import alarmTone from '../assets/audio/ringtone.mp3'
import { speakText } from './text_to_speack/speaktext';
import tellJoke from './api/telljoke';
import youtube from './api/youtubeAPI';
import tellCountryStateCity from './api/tellCountryStateCity';
import { translateTextToHindi } from './api/translate';
import { searchWiki } from './api/wikipidia';
import { playMusic, findMusicURL } from './api/playmusic';
import { BsFillMicFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import stateContext from '../mycontext/Mycontext';
import getCurrentTimeAndDate from './api/findDateTime';
import gkquize from './api/gkquize';
import todo from './api/todo';
import audiogif from '../assets/image/sirilike.gif';
import getdata from '../data/jokeData';
import getDistance from './api/distanceApi';
import mapNavigate from './api/mapApi';
import setAlaram from './api/setAlaram';
import { getRasaResponse } from './api/ConversionApi';
const VoiceAssistant = () => {
    const audioRef = useRef(null);
    const localuser = JSON.parse(localStorage.getItem('user'));
    const { state, loading, updateloadingValue, updateSpeakValue } = useContext(stateContext);
    const [volume, setVolume] = useState(100);
    const [iframeVisible, setIframeVisible] = useState(false);
    const [michidden, setMichidden] = useState(true);
    const [listening, setListening] = useState(false);
    const [anayan, setAnayan] = useState(false);
    const [secoundMic, setSecoundMic] = useState(false);
    const [videoURL, setVideoURL] = useState("");
    const [musicURL, setMusicURL] = useState("");
    const [musicArray, setMusicArray] = useState([]);
    const [musicIndex, setMusicIndex] = useState(0);
    const [alarmRing, setAlarmRing] = useState(false);
    const [alardetail, setAlarmDeatil] = useState({});
    const [load, setLoad] = useState(false);
    const navigate = useNavigate();
    const commands = {
        'Good morning *name': () => speak('Hy Boss Good morning'),
        'Good morning': () => speak('Hy Boss Good morning'),
        '*name Good morning': () => speak('Hy Boss Good morning'),
        'Good afternoon *name': () => speak('Hy Boss Good afternoon'),
        'Good afternoon': () => speak('Hy Boss Good afternoon'),
        '*name Good afternoon': () => speak('Hy Boss Good afternoon'),
        'Good evening *name': () => speak('Hy Boss Good evening'),
        'Good evening': () => speak('Hy Boss Good evening'),
        '*name Good evening': () => speak('Hy Boss Good evening'),
        'Goodbye *name': () => speak('Goodbye, have a great day!'),
        'Goodbye': () => speak('Goodbye, have a great day!'),
        '*name Goodbye': () => speak('Goodbye, have a great day!'),
        'Tell me about yourself': () => speak('I am a voice assistant Sidhu Alston created me. if you want to know more about sidhu alston say Sidhu Alston Resume'),
        'Tell me about you': () => speak('I am a voice assistant Sidhu Alston created me. if you want to know more about sidhu alston say Sidhu Alston Resume'),
        'Who are you': () => speak('I am a voice assistant Sidhu Alston created me.'),
        'Who created you': () => speak('Sidhu Alston created me.'),
        'I am sad': () => speak("Sorry Boss, But why are you sad I have a some joke for you or you listen Dinchak Pooja Song"),
        'Sidhu Alston Resume': () => openResume(),
        'Sidhu elstone Resume': () => openResume(),
        'open *name': (name) => openWebsite(name),
        'Open *name': (name) => openWebsite(name),
        'Distance': () => getDistance(),
    };
    useEffect(() => {
        const input = "Hello what is your name";
        axios.post(`${URL}/findfunction`, { input });
        axios.get('https://hindi-jokes-api.onrender.com/jokes?api_key=bd4c780c41c74b6af4ae1f31bc5d');
        getAllAlarm()
    }, [load])
    useEffect(() => {
        if (annyang) {
            if (listening) {
                // Start listening when the 'listening' state is true
                annyang.addCommands(commands);
                annyang.addCallback('result', (phrases) => {
                    console.log(phrases[0])
                    const ansss = isUserInputInCommands(phrases[0])
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
    const Stop = async () => {
        setAnayan(false);
        setListening(false);
        updateSpeakValue(false)
        annyang.abort();
    }
    //Set Alarms 
    const getAllAlarm = () => {
        if (!localuser) {
            return;
        }
        axios.post(`${URL}/alarm/getalarm`, { userid: localuser._id })
            .then(response => {
                const data = response.data?.data;
                if (data && data.length > 0) {
                    const timeDifferences = [];
                    data.forEach((alarmData, index) => {
                        const givenTime = alarmData.alarmTime;
                        const [time, period] = givenTime.split(' ');
                        const [hours, minutes] = time.split(':');
                        const formattedGivenTime = new Date();
                        formattedGivenTime.setHours(
                            period.toLowerCase() === 'p.m.' ? parseInt(hours) + 12 : parseInt(hours),
                            parseInt(minutes),
                            0,
                            0
                        );
                        const currentTime = new Date();
                        let timeDifference = formattedGivenTime - currentTime;
                        if (timeDifference < 0) {
                            timeDifference += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                        }
                        timeDifferences.push(timeDifference);
                        setTimeout(() => {
                            // Assuming setAlarmRing and setAlarmDeatil are functions
                            setAlarmRing(true);
                            setAlarmDeatil(alarmData);
                        }, timeDifference);
                    });

                    return timeDifferences;
                }
            })
            .catch(error => {
                console.error('Error fetching alarm data:', error);
            });
    };

    //     if (!localuser) {
    //         return;
    //     }
    //     const { data } =await axios.post(`${URL}/alarm/getalarm`, { userid: localuser._id });
    //     if (data?.data) {
    //         const alarmData = data.data;
    //         if (alarmData.length === 0) {
    //             return;
    //         }
    //         const timeDifferences = [];

    //         for (let i = 0; i < alarmData.length; i++) {
    //             const givenTime = alarmData[i].alarmTime;
    //             const [time, period] = givenTime.split(' ');
    //             const [hours, minutes] = time.split(':');
    //             // Convert to 24-hour format
    //             const formattedGivenTime = new Date();
    //             formattedGivenTime.setHours(
    //                 period.toLowerCase() === 'p.m.' ? parseInt(hours) + 12 : parseInt(hours),
    //                 parseInt(minutes),
    //                 0,
    //                 0
    //             );
    //             // Get the current time
    //             const currentTime = new Date();
    //             // Calculate the time difference in milliseconds
    //             let timeDifference = formattedGivenTime - currentTime;
    //             // If the time difference is negative, add 24 hours
    //             if (timeDifference < 0) {
    //                 timeDifference += 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    //             }
    //             // Store the time difference in the array
    //             timeDifferences.push(timeDifference);

    //             console.log("SET TIME OUT")
    //             setTimeout(() => {
    //                 // Assuming setAlarmRing and setAlarmDeatil are functions
    //                 setAlarmRing(true);
    //                 setAlarmDeatil(alarmData[i]);
    //             }, timeDifference);
    //         }
    //         return timeDifferences;

    //     }

    //     // If you need to use the time differences array elsewhere, you can return it or perform further actions.

    // };

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
        setSecoundMic(false)
        setMichidden(true)
        annyang.start();
        setListening(true)
        setAnayan(true);
        updateSpeakValue(false);
    }
    //Speaking precomman
    const speak = async (message) => {
        annyang.abort();
        setListening(false)
        setAnayan(false);
        updateSpeakValue(true);
        await speakText(message);
        updateSpeakValue(false);
        annyang.start();
        setListening([true])
        setAnayan(true);
        return
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

    const openWebsite = async (name) => {
        // Make sure the name is in a valid format (e.g., without spaces and special characters)
        const sanitizedName = name.replace(/\s/g, '');
        if (sanitizedName) {
            const url = `https://www.${sanitizedName}.com`;
            window.location.href = url
        } else {
            await speakText('Invalid website name provided.');
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
            if (data) {
                updateloadingValue(false);
                updateSpeakValue(true);
            }
            switch (data.data) {
                case "Hello":
                case "name":
                case "Bye":
                case "disturb":
                case "jarvise_work":
                case "Aboutyou":
                case "love_jarvis":
                case "hate_jarvis":
                case "SidhuAlston":
                case "family_info":
                    await getdata(data.data);
                    break;
                case "about_us":
                    await speakText("It is credential information.");
                    await speakText("I have not authenticated for sharing my credential information with anyone.");
                    await speakText("But I am created using mern technology React.js, Node.js, Express.js, and Mongoose for storing data for updating myself");
                    break;
                case "date":
                case "time":
                    await getCurrentTimeAndDate(data.data);
                    break;
                case "Stop":
                    await Stop();
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
                case "mapNavigation":
                    await mapNavigate(animationupdate, loadingupdate);
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
                case "set Alarm":
                case "update Alarm":
                case "delete Alarm":
                case "getAll Alarm":
                case "get Alarm":
                    const res = await setAlaram(userInput, data.data, animationupdate, loadingupdate);
                    setLoad(res);
                    break;
                case "Not_Category":
                    await speakText("Sorry, I don't know much more about that, but with time I am updating myself");
                    handlemicshow(true)
                    break;
                default:
                    handlemicshow(true)
                    break;
            }
            if (data.data != "Stop" && data.data != "play_youtube") {
                updateSpeakValue(false);
                annyang.abort();
                setListening(true);
                setAnayan(true)
            }
        } catch (err) {
            console.log(err)
            await speakText("Somting Wrong with me try again");
            handlemicshow(true)
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
            return await speakText("Somting Wrong with me try again")
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
    async function handleYouTube(userInput) {
        try {
            const arr = ['play', 'music', 'song', 'run', 'i', 'want', 'youtube', 'video', 'audio'];
            const sanitizedInput = userInput.split(' ').filter(word => !arr.includes(word)).join(' ');
            // Check if the modified userInput contains "video" and "YouTube"
            let containsVideo = userInput.toLowerCase().includes('video');
            let containsYouTube = userInput.toLowerCase().includes('youtube');
            if (containsYouTube || containsVideo) {
                const videoData = await youtube(userInput);
                setMichidden(false);
                setIframeVisible(true);
                setVideoURL(`https://www.youtube.com/embed/${videoData}?autoplay=1`);
            }
            else {
                setIframeVisible(false)
                setMichidden(false);
                loadingupdate(true);
                speakText('Okk, music searching');
                updateSpeakValue(false);
                const musicData = await playMusic(sanitizedInput || "Bollywood");
                setMusicArray(musicData);
                setMusicIndex(0);
                await playNextSong(musicData);
            }
        } catch (err) {
            console.log(err);
            await speakText("Something went wrong. Please try again.");
        }
    }

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
    // handle music controll
    const takeinputcmd = async () => {
        annyang.abort();
        setSecoundMic(true);
        // setMichidden(true);
        const cmd = await takeInput();
        if (!cmd) {
            setMichidden(false);
            setListening(false);
            setAnayan(false);
            updateSpeakValue(false);
        }
        const sanitizedInput = cmd.split(' ');
        // Check for keywords
        const play = sanitizedInput.some(word => ['pause', 'stop'].includes(word.toLowerCase()));
        const pause = sanitizedInput.some(word => ['play', 'continue', 'start'].includes(word.toLowerCase()));
        const prevSong = sanitizedInput.some(word => ['back', 'old', 'previous'].includes(word.toLowerCase()));
        const nextSong = sanitizedInput.some(word => ['next', 'new', 'another', 'change'].includes(word.toLowerCase()));
        const volume = sanitizedInput.some(word => ['sound', 'voice', 'volume'].includes(word.toLowerCase()));
        if (play) {
            audioRef.current.pause();
        } else if (pause) {
            audioRef.current.play();
        } else if (prevSong) {
            if (musicIndex == 0) {
                setMusicIndex(musicArray.length - 1);

            } else {
                setMusicIndex(musicIndex - 1);
            }
            playNextSong(musicArray); // Use playNextSong instead of playMusic
        } else if (nextSong) {
            if (musicIndex == musicArray.length - 1) {
                setMusicIndex(0);
            } else {
                setMusicIndex(musicIndex + 1);
            }
            playNextSong(musicArray); // Use playNextSong instead of playMusic
        } else if (volume) {
            const regex = /\d+(\.\d+)?/g;
            const percentage = cmd.match(regex);
            console.log(percentage)
            handleVolumeChange(percentage);
        }
        else {
            handleYouTube(cmd)
        }
    }
    //Handle music voice
    const handleVolumeChange = (newVolume) => {
        const cVolume = Math.max(0, Math.min(100, newVolume));
        setVolume(cVolume);
        audioRef.current.volume = cVolume / 100;
    };
    async function playNextSong(musicData) {
        try {
            if (musicIndex < musicData.length) {
                const music = musicData[musicIndex];
                const musicurl = music.downloadUrl;
                if (musicurl.length > 0) {
                    const url = musicurl[musicurl.length - 1];
                    const finalurl = url.link;
                    // Play the music and handle the next song after its duration
                    updateloadingValue(false);
                    setAnayan(false);
                    setListening(false);
                    setMichidden(false);
                    setMusicURL(finalurl);
                }

            }
        } catch (err) {
            console.log(err);
            await speakText("Something went wrong with the music playback.");
        }
    }
    return (
        <div className="main_container">
            <div className="w-full h-0 bg-opacity-75 bg-gray-800 absolute text-center flex items-center transition-all duration-500 justify-center z-10 overflow-hidden" style={{ height: alarmRing ? "100%" : "" }} >
                <div className='flex items-center justify-around bg-white rounded-2xl relative'>
                    <IoCloseCircleOutline className=' absolute top-4 right-4 text-2xl' onClick={async () => {
                        setAlarmRing(false)
                        await axios.post(`${URL}/alarm/deletealarm`, { alarmTime: alardetail.alarmTime, userid: localuser._id });
                    }
                    }
                    />
                    <img className='w-1/3' src={alarmImage} alt="" />
                    <div className=' text-left'>
                        <h2 className='text-4xl font-bold'>{alardetail?.title || "SSS"}</h2>
                        <p className='text-xl font-semibold'>{alardetail?.alarmTime || "10:30 p.m"}</p>
                    </div>
                </div>
                {alarmRing ? <audio src="https://2u039f-a.akamaihd.net/downloads/ringtones/files/mp3/technocraj-20230730-0001-61126.mp3" autoPlay loop></audio> : null}

            </div>
            {michidden ?
                // show doc button
                <div onClick={() => { navigate('/doc') }} className="group absolute top-2 right-2 z-10">
                    <button className="Btn flex items-center justify-start gap-2 w-12 h-12 rounded-full overflow-hidden cursor-pointer relative overflow-hidden transition-all duration-300 linear shadow-md bg-teal-400 group-hover:w-32  group-hover:rounded-xl group-hover:duration-300 group-active:transform group-active:translate-x-2 group-active:translate-y-2">
                        <div className="w-full transition-all duration-300 flex items-center justify-center gap-4">
                            <HiOutlineInformationCircle className='absolute transition-all duration-300 text-white text-2xl group-hover:left-6' />
                        </div>
                        <div className="absolute right-0 w-0 opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:w-full group-hover:opacity-100 group-hover:p-2">
                            Doc
                        </div>
                    </button>
                </div> :
                <>
                    {/* Mic icon close Show */}
                    {!iframeVisible ? <div onClick={takeinputcmd} className="group absolute top-2 left-2 z-10">
                        <div class="w-20 h-20 rounded-full relative animate-spin bg-gradient-to-br from-purple-400 via-blue-500 to-cyan-400 shadow-inner">
                            <div class="w-20 h-20 rounded-full bg-gray-800 opacity-60 absolute animate-blur"></div>
                        </div>
                        <div className="submic absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl bg-black bg-opacity-25 rounded-full p-3">
                            <BsFillMicFill className="text-white submic:hover {
                                transform: rotate(360deg);
                                transition-duration: 300ms;
                                }" />
                        </div>
                        <span className='text-white absolute text-center'>MUSIC CONTROL</span>
                    </div> : ""}

                    {/* Close */}
                    <div onClick={handlemicshow} className="group absolute top-2 right-2 z-10">
                        <button className="Btn flex items-center justify-start gap-4 w-12 h-12 rounded-full overflow-hidden cursor-pointer relative overflow-hidden transition-all duration-300 linear shadow-md bg-teal-400 group-hover:w-32  group-hover:rounded-xl group-hover:duration-300 group-active:transform group-active:translate-x-2 group-active:translate-y-2">
                            <div className="w-full transition-all duration-300 flex items-center justify-center gap-4">
                                <AiOutlineClose className='absolute transition-all duration-300 text-white text-2xl group-hover:left-4' />
                            </div>
                            <div className="absolute right-0 w-0 opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:w-full group-hover:opacity-100 group-hover:p-2">
                                Show
                            </div>
                        </button>
                    </div>
                </>
            }
            {!michidden || secoundMic ? <div>
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
                        <div className='flex items-center justify-center relative h-screen'>
                            <audio id='musicPlayer' className='audio_controller absolute bottom-0 w-full' src={musicURL} onPlay={true} volume={volume / 100} ref={audioRef} onEnded={() => {
                                console.log("ENter")
                                if (musicIndex == musicArray.length - 1) {
                                    setMusicIndex(0);
                                } else {
                                    setMusicIndex(musicIndex + 1);
                                }
                                playNextSong(musicArray); // Use playNextSong instead of playMusic
                            }} autoPlay controls ></audio>
                            <img className='img_audio_container w-screen' src={audiogif} alt="" />
                        </div>
                    </div>}
                </div>
            </div> : ""}
            {michidden ?
                <div className="mic_animation_container h-screen">
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
                    <div id='demo' className='text-2xl text-white'></div>
                </div> : ""}
        </div>
    );
};

export default VoiceAssistant;
