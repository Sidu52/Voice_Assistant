import {speakText} from '../text_to_speack/speaktext';
import { Country, State, City } from 'country-state-city';
import { tellCountry, tellState, tellCity, tellCapital, tellPopulation } from '../aboutCountryStateCity/CSC';
import { cityWeather } from '../api/weatherAPi'
import tellJoke from '../api/telljoke';
import youtube from '../api/youtubeAPI';
// import { openWebsite } from '../data/startingCmd';

const categoryfind = (data, substrings) => {
    let CSCname = ""
    speakText("Switch")
    switch (data.data) {
        case "Hello":
            speakText("Helo Boss, How may I help you");
            break;
        case "Aboutyou":
            speakText("I'm good Boss. I am always ready for you any condition");
            break;
        case "country":
        case "state":
        case "city":
            for (let input of substrings) {
                if (CSCname === "") {
                    const country = Country.getAllCountries().find(c => c.name === input);
                    if (country) {
                        CSCname = country.isoCode;
                        tellCountry(CSCname);
                        break;
                    }
                    if (CSCname === "") {
                        const state = State.getAllStates().find(s => s.name === input);
                        if (state) {
                            CSCname = state?.isoCode;
                            tellState(CSCname, state.countryCode);
                            break;
                        }
                    }
                    if (CSCname === "") {
                        const city = City.getAllCities().find(city => city.name === input);
                        if (city) {
                            CSCname = city.name;
                            tellCity(city.stateCode, CSCname, city.countryCode);
                            break;
                        }
                    }
                }
            }
            break;
        case "City_Weather":
            for (let input of substrings) {
                const city = City.getAllCities().find(city => city.name === input);
                if (city) {
                    speakText("I understand your concern you're asking about Weather");
                    cityWeather(city.name);
                    break;
                }
            }
            break;
        case "play_youtube":
            youtube(userInput);
            // setVideoURL(`https://www.youtube.com/watch?v=${data}`)
            break;
        case "speak_joke":
            tellJoke();
            break;
        case "family_info":
            speakText("Sorry, I am an AI voice assistant, so I do not have a family, but I have some friends like Google Assistant, Siri, Bing, and others.");
            break;
        case "country_capital":
        case "country_population":
            for (let input of substrings) {
                const country = Country.getAllCountries().find(city => city.name === input);
                if (country) {
                    if (data.data === "country_capital") {
                        tellCapital(country.name);
                    } else {
                        tellPopulation(country.name);
                    }
                    break;
                }
            }
            break;
        case "Not_Category":
            speakText("Sorry, I don't know much more about that, but with time I am updating myself.");
            break;
        default:
            // Handle the default case here if needed
            break;
    }

}

export default categoryfind;