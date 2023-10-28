import jokesData from '../../data/jokeData';
import {speakText} from '../text_to_speack/speaktext';
const tellJoke = () => {
   
    const randomJoke = jokesData[Math.floor(Math.random() * jokesData.length)];
    speakText(randomJoke);
};

export default tellJoke;