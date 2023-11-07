import { speakText } from '../text_to_speack/speaktext';
import { jokesData } from '../../data/jokeData';
import axios from 'axios';
async function tellJoke() {
    try {
        const { data } = await axios.get("https://dad-jokes.p.rapidapi.com/random/joke", {
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_EnglishJoke_API_KEY,
                'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
            }
        });
        if (data) {
            console.log(data)
            await speakText(data.body[0].setup);
            return await speakText(data.body[0].punchline);
        }
        return jokesData();
    } catch (error) {
        console.error(error);
        return await speakText("Somting Wrong with me try again")
    }
}

export default tellJoke;