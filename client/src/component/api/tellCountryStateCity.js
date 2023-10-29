import { Country, State, City } from 'country-state-city';
import { tellCountry, tellState, tellCity, tellCapital, tellPopulation } from '../aboutCountryStateCity/CSC';
import { cityWeather } from './weatherAPi';
import { speakText } from '../text_to_speack/speaktext';
import { searchWiki } from '../api//wikipidia';

const tellCountryStateCity = async (type, substrings) => {
    let CSCname = "";
    try {
        for (let input of substrings) {
            if (CSCname === "") {
                const country = Country.getAllCountries().find(c => c.name === input);
                if (country) {
                    if (type === "country_population" || type === "country_capital") {
                        if (type === "country_capital") {
                            return tellCapital(country.name)
                        } else {
                            return tellPopulation(country.name)
                        }
                    } else {
                        CSCname = country.isoCode;
                        return tellCountry(CSCname);
                    }
                }
                if (CSCname === "") {
                    const state = State.getAllStates().find(s => s.name === input);
                    if (state) {
                        CSCname = state?.isoCode;
                        // return tellState(CSCname, state.countryCode);
                        return searchWiki(state.name)
                    }
                }
                if (CSCname === "") {
                    const city = City.getAllCities().find(city => city.name === input);
                    if (city) {
                        if (type === "City_Weather" || type == "weather_forecast") {
                           await speakText(`I understand your concern you asking about Weather`)
                            return cityWeather(city.name, type);
                        } else {
                            CSCname = city.name;
                            // return tellCity(city.stateCode, CSCname, city.countryCode);
                            return searchWiki(city.name);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
};

export default tellCountryStateCity;

