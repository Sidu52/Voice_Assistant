import { speakText } from "../text_to_speack/speaktext";
const wikiEndpoint = "https://simple.wikipedia.org/w/api.php";
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

async function searchWiki(title) {
    try {
        const response = await fetch(wikiEndpoint + wikiParams + title + last, {
            mode: 'cors'
        });

        if (response.status === 404) {
            console.log("Not found (404)");
        } else if (response.ok) {
            const data = await response.json();
            console.log("title", title)
            console.log("data", data)

            const result = data.query.pages[0].extract;
            console.log("result", result)
            speakText(result)
        } else {
            console.log("Response not okay:", response.status);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

export { searchWiki };