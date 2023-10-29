import { speakText } from "../text_to_speack/speaktext";

function getCurrentTimeAndDate(type) {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Months are 0-based, so add 1
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the date as "YYYY-MM-DD" and time as "HH:MM:SS"
    const dateFormat = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const timeFormat = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (type == "date") {
        return speakText(`Today date is ${dateFormat}`);
    } else {
        return speakText(`Currecnt time is ${timeFormat}`);
    }
}
export default getCurrentTimeAndDate;