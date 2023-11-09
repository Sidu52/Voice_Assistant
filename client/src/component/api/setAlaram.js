import axios from "axios";
import { speakText } from "../text_to_speack/speaktext";
import { URL } from '../../../endpointURL';

const takeInput = () => {
    return new Promise((resolve, reject) => {
        const recognition = new webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const output = event.results[0][0].transcript;
            resolve(output); // Resolve the promise with the recognized text
        };
        recognition.onerror = (error) => {
            resolve(null); // Reject the promise in case of an error
        };
        recognition.onend = () => {
            // If onresult is not called before onend, consider it an error
            resolve(null);
        };
        recognition.start();
    });
};

async function setAlaram(userInput, opration, animationupdate, loadingupdate) {
    try {
        await speakText(`I think you want to ${opration}`);
        let i = 0;
        let updateData = {};
        const timeRegex = /(\d{1,2}:\d{2}\s*[ap]\.m\.)/gi;
        // Search for time patterns in the input strings
        let time = userInput.match(timeRegex);
        if (!time && opration != "getAll Alarm") {
            await speakText(`gave your  ${opration} time`);
            animationupdate(true);
            let Atime = await takeInput();
            time = Atime.match(timeRegex);
            i = 0;
            while (!time && i < 5) {
                await speakText("Sorry time not found try again");
                i++;
                Atime = await takeInput();
                time = Atime.match(timeRegex);
            }
            if (i == 5) {
                return speakText("Sorry input not found thank for using");
            }
            animationupdate(false);
        }
        i = 0;
        var localuser = JSON.parse(localStorage.getItem('user'));
        if (!localuser) {
            await speakText("User not found gave your nickname");
            animationupdate(true);
            let nickname = await takeInput();
            i = 0;
            while (!nickname && i < 5) {
                await speakText("Sorry nickname not found try again");
                i++;
                nickname = await takeInput();
            }
            if (i == 5) {
                return speakText("Sorry input not found thank for using");
            }
            animationupdate(false);
            if (nickname) {
                loadingupdate(true)
                await speakText(`You say ${nickname}`);
                const { data } = await axios.post(`${URL}/todo/user`, {
                    nickname: nickname
                });
                loadingupdate(false)
                if (data.data) {
                    localuser = data.data;
                    localStorage.setItem('user', JSON.stringify(localuser));
                }
            } else {
                return await speakText(`User not found`);
            }
            localuser = JSON.parse(localStorage.getItem('user'));
        }
        if (opration == "set Alarm") {
            var { data } = await axios.post(`${URL}/alarm/alarm`, { alarmTime: time[0], userid: localuser._id });
            if (data.data) {
                return speakText(`${time[0]} alarm ${data.data.title} already set`);
            }
        }
        switch (opration) {
            case "set Alarm":
                await speakText("what name should i set the alarm");
                animationupdate(true);
                let alarmName = await takeInput();
                i = 0;
                while (!alarmName && i < 5) {
                    await speakText("Sorry name not found try again");
                    i++
                    alarmName = await takeInput();
                }
                if (i == 5) {
                    return speakText("Sorry input not found thank for using");
                }
                loadingupdate(true);
                var data = await axios.post(`${URL}/alarm/setalarm`, { title: alarmName, alarmTime: time[0], userid: localuser._id });
                loadingupdate(false);
                animationupdate(false);
                if (data.data) {
                    await speakText(`ok your ${alarmName} alram set ${time}`);
                } else {
                    await speakText(`your alarm is not shedule`);
                }
                break;

            case "update Alarm":
                const oldtime = time;
                animationupdate(false);
                await speakText("what should i you want to update");
                await speakText("name or time");
                animationupdate(true);
                let updateType = await takeInput();
                i = 0;
                while (!updateType && i < 5) {
                    await speakText("Sorry task not found try again");
                    i++
                    updateType = await takeInput();
                }
                if (i == 5) {
                    return await speakText("Sorry input not found thank for using");
                }

                const sanitizedInput = updateType.split(' ');
                // Check for keywords
                const timeupdate = sanitizedInput.some(word => ['time'].includes(word.toLowerCase()));
                const nameupdate = sanitizedInput.some(word => ['name'].includes(word.toLowerCase()));
                if (timeupdate && !nameupdate) {
                    await speakText("tell me the updated time");
                    animationupdate(true);
                    let newTime = await takeInput();
                    // Search for time patterns in the input strings
                    time = newTime.match(timeRegex);
                    i = 0;
                    while (!time && i < 5) {
                        await speakText("Sorry time not found try again");
                        i++
                        newTime = await takeInput();
                        time = newTime.match(timeRegex);
                    }
                    if (i == 5) {
                        return speakText("Sorry input not found thank for using");
                    }
                    loadingupdate(false);
                    animationupdate(false);

                    updateData = {
                        alarmTime: time[0],
                    }

                } else if (nameupdate && !timeupdate) {
                    await speakText("tell me the updated name");
                    animationupdate(true);
                    let newName = await takeInput();
                    // Search for time patterns in the input strings
                    // time = newName.match(timeRegex);
                    i = 0;
                    while (!newName && i < 5) {
                        await speakText("Sorry name not found try again");
                        i++
                        newName = await takeInput();
                    }
                    if (i == 5) {
                        return speakText("Sorry input not found thank for using");
                    }
                    loadingupdate(false);
                    animationupdate(false);

                    updateData = {
                        title: newName,
                    }

                } else if (timeupdate && nameupdate) {
                    await speakText("tell me the updated name");
                    animationupdate(true);
                    let newName = await takeInput();
                    i = 0;
                    while (!newName && i < 5) {
                        await speakText("Sorry name not found try again");
                        i++
                        newName = await takeInput();
                    }
                    if (i == 5) {
                        return speakText("Sorry input not found thank for using");
                    }
                    loadingupdate(false);
                    animationupdate(false);
                    await speakText("tell me the updated time");
                    animationupdate(true);
                    let newTime = await takeInput();
                    // Search for time patterns in the input strings
                    time = newTime.match(timeRegex);
                    i = 0;
                    while (!time && i < 5) {
                        await speakText("Sorry time not found try again");
                        i++
                        newTime = await takeInput();
                        time = newTime.match(timeRegex);
                    }
                    if (i == 5) {
                        return speakText("Sorry input not found thank for using");
                    }
                    loadingupdate(false);
                    animationupdate(false);

                    updateData = {
                        title: newName,
                        alarmTime: time[0]
                    }
                } else {
                    return await speakText("time or name no one found")
                }
                loadingupdate(false);
                var data = await axios.put(`${URL}/alarm/updatealarm`, { alarmTime: oldtime[0], userid: localuser._id, updateData });
                animationupdate(false);
                if (data.data) {
                    await speakText(`your alarm ${updateData.title} is update`);
                } else {
                    await speakText(`your alarm is not update`);
                }
                break;
            case "delete Alarm":
                var { data } = await axios.post(`${URL}/alarm/deletealarm`, { alarmTime: time[0], userid: localuser._id });
                animationupdate(false);
                if (data.data) {
                    await speakText(`your alarm ${alarm} is deleted`);
                } else {
                    await speakText(`your alarm is not found`);
                }
                break;
            case "get Alarm":
                // loadingupdate(false);
                var { data } = await axios.post(`${URL}/alarm/alarm`, { alarmTime: time[0], userid: localuser._id });
                animationupdate(false);
                if (data.data) {
                    await speakText(`your alarm ${data.data.title} `);
                } else {
                    await speakText(`your alarm is not find`);
                }
                break
            case "getAll Alarm":
                await speakText("Wait your alarms fetch plz wait");
                loadingupdate(true);
                var { data } = await axios.post(`${URL}/alarm/getalarm`, { userid: localuser._id });
                loadingupdate(false);
                if (data.data) {
                    await speakText(`your alarms is find`);
                    i = 0;
                    while (i < data.data.length) {
                        await speakText(`your ${data.data[i].alarmTime} alarm task is ${data.data[i].title}`);
                        i++;
                    }
                } else {
                    await speakText(`your alarm is not find`);
                }
                break;
            default:
                await speakText("Sorry, I don't know much more about that, but with time I am updating myself");
                break;
        }
        return true;
    } catch (err) {
        console.log(err)
        await speakText("Somting wrong with us")
    }
    // Regular expression to match time in the format hh:mm am/pm
}

export default setAlaram;


