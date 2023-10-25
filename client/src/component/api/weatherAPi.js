import axios from "axios";
import speakText from "../text_to_speack/speaktext";
const cityWeather = async (cityName) => {
    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`);
        if (data) {
            speakText(`Now ${cityName} tempreature is ${data.main.temp} degree celcious and a number of cloud in sky is ${data.clouds.all} with${data.weather[0].description} and the wind speed is ${data.wind.speed}kilometer prati hours.`)
            console.log(data)
        } else {
            speakText(`Sorry ${data.name} State is not found`);
        }

    } catch (err) {
        console.error(err);
        // speakText('Sorry, there was an error fetching country data');
    }
};

export { cityWeather };