// --url 'https://api.themoviedb.org/3/search/multi?include_adult=false&language=en-US&page=1' \
// --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NGU4NmQ5OWE5NTg1ZTQ4ZDc0MTRmN2MwMzFkNWRlMSIsInN1YiI6IjY1NTVhMjI4YWE2NTllMDEzOWJiN2FjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QEwFJeMNdfTIY0_QA7RkXPPbrY34j8ro_orqBMRvCKE' \
// --header 'accept: application/json'

import { speakText } from '../text_to_speack/speaktext';

import axios from 'axios';
async function movidata(name) {
    try {
        const { data } = await axios.get(`https://api.themoviedb.org/3/search/multi${name}include_adult=false&language=en-US&page=1`, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NGU4NmQ5OWE5NTg1ZTQ4ZDc0MTRmN2MwMzFkNWRlMSIsInN1YiI6IjY1NTVhMjI4YWE2NTllMDEzOWJiN2FjMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QEwFJeMNdfTIY0_QA7RkXPPbrY34j8ro_orqBMRvCKE',
                'accept': 'application/json'
            }
        });
        console.log(data.data)


    } catch (error) {
        console.error(error);
        return await speakText("Somting Wrong with me try again")
    }
}

export default movidata;