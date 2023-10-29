import { speakText } from '../text_to_speack/speaktext';
const fetchJoke = {
    method: 'GET',
    url: 'https://dad-jokes.p.rapidapi.com/random/joke',
    headers: {
        'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
        'X-RapidAPI-Host': 'dad-jokes.p.rapidapi.com'
    }
};
async function tellJoke() {
    try {
        const { data } = await axios.request(fetchJoke);
        await speakText(data.setup);
        return await speakText(data.punchline);
    } catch (error) {
        console.error(error);
    }
}

export default tellJoke;