import axios from 'axios';
import { speakText } from '../text_to_speack/speaktext';

const playMusic = async (name) => {
    console.log("Music Name", name)
    try {
        const data = await axios.get(`https://saavn.me/search/songs?query=${name}&page=1&limit=10`)
        if (!data.data.data) {
            return speakText("Music not found")
        }
        console.log(data.data.data.results)
        const musicDetails = data.data.data.results;
        console.log('Music Details:', musicDetails);
        return musicDetails;
    } catch (err) {
        console.log(err)
    }
}


// const playMusic = async (name) => {
//     const detailsOptions = {
//         method: 'GET',
//         url: 'https://jio-saavan-unofficial.p.rapidapi.com/getdata',
//         params: { q: name },
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
//             'X-RapidAPI-Host': 'jio-saavan-unofficial.p.rapidapi.com'
//         }
//     };
//     try {
//         const response = await axios.request(detailsOptions);
//         const musicDetails = response.data;
//         console.log('Music Details:', musicDetails.results);

//         // Once you have the music details, you can call another function to get the music URL
//         // const music = await findMusicURL(musicDetails.results[0]);

//         // return music.results[music.results.length - 1];
//         return musicDetails.results;
//     } catch (error) {
//         console.log(error);
//         return await speakText("Somting Wrong with me try again")
//     }
// };

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
        return await speakText("Somting Wrong with me try again")
    }
};




export { playMusic, findMusicURL };

