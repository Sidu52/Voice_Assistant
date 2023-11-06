import { speakText } from "../text_to_speack/speaktext";
import compromise from 'compromise';
import axios from "axios";
const wikiEndpoint = "https://simple.wikipedia.org/w/api.php";
const GoogleEndpoint = 'https://google-search74.p.rapidapi.com/';
const wikiParams =
    "?action=query" +
    "&prop=extracts" +
    "&exsentences=2" +
    "&exlimit=1" +
    "&titles=";
const last = "&explaintext=1" +
    "&format=json" +
    "&formatversion=2" +
    "&origin=*";

const GoogleParams =
    "?action=query" +
    "&prop=extracts" +
    "&exsentences=2" +
    "&exlimit=1" +
    "&titles=";


// async function searchWiki(input) {
//     try {
//         // Tokenize the input and get nouns
//         const doc = compromise(input);
//         var substrings = "";
//         const nouns = doc.nouns().toTitleCase().out('array');
//         // Initialize the result and i
//         let result = null;
//         let i = 0;
//         while (!result && k < nouns.length) {
//             for (var k = 0; k < nouns.length; k++) {
//                 for (var j = k; j < nouns.length; j++) {
//                     var substring = nouns.slice(k, j + 1).join(" ");
//                     substrings.push(substring);
//                 }
//             }
//             console.log("sss", substrings)
//             const noun = substrings[i];

//             var response = "";
//             if (noun != "I" && noun != "We" && noun != "You" && noun != "They" && noun != "He" && noun != "She" && noun != "It") {
//                 response = await fetch(wikiEndpoint + wikiParams + noun + last, {
//                     mode: 'cors',
//                 });
//             }
//             if (response.status === 200) {
//                 const data = await response.json();
//                 const page = data.query.pages[Object.keys(data.query.pages)[0]];
//                 result = page.extract;
//             }

//             i++;
//         }

//         if (result) {
//             return await speakText(result);
//         } else {
//             return await speakText(`Sorry, no relevant information found for "${input}"`);
//         }
//     } catch (error) {
//         console.error("An error occurred:", error);
//         return await speakText("An error occurred during the search.");
//     }
// }



try {
    const response = await axios.request(options);
    console.log(response.data);
} catch (error) {
    console.error(error);
}




async function searchWiki(input) {
    try {
        // Tokenize the input and get nouns
        const doc = compromise(input);
        const nouns = doc.nouns().toTitleCase().out('array');
        // Initialize the result
        let result = null;
        for (let k = 0; k < nouns.length; k++) {
            for (let j = k; j < nouns.length; j++) {
                // Create a substring from the nouns
                const substring = nouns.slice(k, j + 1).join(' ');
                // Check if the substring is not a personal pronoun
                if (!['I', 'We', 'You', 'They', 'He', 'She', 'It'].includes(substring)) {
                    // Fetch data from Wikipedia
                    const response = await fetch(wikiEndpoint + wikiParams + substring + last, {
                        mode: 'cors',
                    });

                    if (response.status === 200) {
                        const data = await response.json();
                        const page = data.query.pages[Object.keys(data.query.pages)[0]];
                        result = page.extract;
                        break; // Exit the loop if a result is found
                    }
                }
            }

            if (result) {
                break; // Exit the outer loop if a result is found
            }
        }

        if (result) {
            return await speakText(result);
        } else {

            const { data } = await axios.get('https://google-search74.p.rapidapi.com', {
                params: {
                    query: substring,
                    limit: 10,
                    related_keywords: true
                },
                headers: {
                    'X-RapidAPI-Key': '5447f97097msh074e382b719e1cap1bdf77jsn70dc0acb5746',
                    'X-RapidAPI-Host': 'google-search74.p.rapidapi.com'
                }
            });
            await speakText(`${data.knowledge_panel.name} is a ${data.knowledge_panel.label}`);
            return await speakText(`${data.knowledge_panel.description.text} is a ${data.knowledge_panel.label}`);
        }
    } catch (error) {
        console.error("An error occurred:", error);
        return await speakText("An error occurred during the search.");
    }
}

// async function searchWiki(input) {
//     try {
//         // Tokenize the input and get nouns
//         const doc = compromise(input);
//         const nouns = doc.nouns().toTitleCase().out('array');
//         // Initialize the result
//         let result = null;
//         let foundInWiki = false;

//         for (let k = 0; k < nouns.length; k++) {
//             for (let j = k; j < nouns.length; j++) {
//                 // Create a substring from the nouns
//                 const substring = nouns.slice(k, j + 1).join(' ');
//                 // Check if the substring is not a personal pronoun
//                 if (!['I', 'We', 'You', 'They', 'He', 'She', 'It'].includes(substring)) {
//                     // Fetch data from Wikipedia
//                     const response = await fetch(wikiEndpoint + wikiParams + substring + last, {
//                         mode: 'cors',
//                     });

//                     if (response.status === 200) {
//                         const data = await response.json();
//                         const page = data.query.pages[Object.keys(data.query.pages)[0]];
//                         result = page.extract;
//                         foundInWiki = true;
//                         break; // Exit the loop if a result is found
//                     }
//                 }
//             }

//             if (foundInWiki) {
//                 break; // Exit the outer loop if a result is found in Wikipedia
//             }
//         }

//         if (result) {
//             return await speakText(result);
//         } else {
//             // If data not found in Wikipedia, search from another API
//             const alternativeSearchResult = await searchFromAlternativeAPI(nouns[0]);
//             return await speakText(alternativeSearchResult);
//         }
//     } catch (error) {
//         console.error("An error occurred:", error);
//         return await speakText("An error occurred during the search.");
//     }
// }

// async function searchFromAlternativeAPI(query) {
//     try {
//         const { data } = await axios.get('https://alternative-search-api.com', {
//             params: {
//                 query: query,
//                 limit: 10,
//                 related_keywords: true
//             },
//             headers: {
//                 'X-RapidAPI-Key': 'your-api-key',
//                 'X-RapidAPI-Host': 'alternative-search-api.com'
//             }
//         });

//         return `${data.knowledge_panel.name} is a ${data.knowledge_panel.label}. ${data.knowledge_panel.description.text}`;
//     } catch (error) {
//         console.error("An error occurred in the alternative search:", error);
//         return "Sorry, no information found in alternative sources.";
//     }
// }


export { searchWiki };