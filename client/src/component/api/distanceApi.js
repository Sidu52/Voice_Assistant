import axios from "axios";

const route = [
    { "t": "Mumbai" }
    // { "t": "Mumbai, India" }
];

const options = {
    method: 'GET',
    url: 'https://distanceto.p.rapidapi.com/get',
    params: {
        route: JSON.stringify(route),
        car: 'false'
    },
    headers: {
        'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
        'X-RapidAPI-Host': 'distanceto.p.rapidapi.com'
    }
};

async function getDistance() {
    try {
        const response = await axios.request(options);
        const distance = response.data; // The distance value
        console.log('Distance between Delhi and Mumbai:', distance);
        return distance;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}


export default getDistance;
