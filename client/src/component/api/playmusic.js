import axios from 'axios';

const playMusic = async (name) => {
    console.log("mis", name)
    const detailsOptions = {
        method: 'GET',
        url: 'https://jio-saavan-unofficial.p.rapidapi.com/getdata',
        params: { q: name },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
            'X-RapidAPI-Host': 'jio-saavan-unofficial.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(detailsOptions);
        const musicDetails = response.data;
        console.log('Music Details:', musicDetails.results[0]);

        // Once you have the music details, you can call another function to get the music URL
        const music = await findMusicURL(musicDetails.results[0]);
        return music.results[music.results.length - 1];
    } catch (error) {
        console.error(error);
    }
};

const findMusicURL = async (musicDetails) => {
    const urlOptions = {
        method: 'POST',
        url: 'https://jio-saavan-unofficial.p.rapidapi.com/getsong',
        data: {
            encrypted_media_url: musicDetails.encrypted_media_url
        },
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
            'X-RapidAPI-Host': 'jio-saavan-unofficial.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(urlOptions);
        const musicURL = response.data;
        return musicURL;
    } catch (error) {
        console.error('Error:', error);
    }
};




export { playMusic };

