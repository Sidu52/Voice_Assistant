import { speakText } from '../text_to_speack/speaktext';

async function tellJoke() {
    try {
        const { data } = await axios.get("https://dad-jokes.p.rapidapi.com/random/joke", {
            headers: {
                'X-RapidAPI-Key': import.meta.env.VITE_EnglishJoke_API_KEY,
                'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
            }
        });
        await speakText(data.setup);
        return await speakText(data.punchline);
    } catch (error) {
        console.error(error);
    }
}

export default tellJoke;