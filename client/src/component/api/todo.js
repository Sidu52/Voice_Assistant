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
            reject(error); // Reject the promise in case of an error
        };
        recognition.onend = () => {
            // If onresult is not called before onend, consider it an error
            reject("Speech recognition ended without result.");
        };
        recognition.start();
    });
};

const todo = async (type) => {
    try {
        await speakText(`Ok, I think you want to ${type.split('_')[0]} todo`);
        var localuser = JSON.parse(localStorage.getItem('user'));
        if (!localuser) {
            await speakText("User not found if you want to create account gave your nickname");
            const nickname = await takeInput();
            console.log("Nickname", nickname);
            if (nickname) {
                speakText(`You say ${nickname}`);
                const { data } = await axios.post(`${URL}/todo/user`, {
                    nickname: nickname
                });
                console.log("data", data.data)
                if (data.data) {
                    localuser = data.data;
                    localStorage.setItem('user', JSON.stringify(localuser));
                    console.log(localuser)
                }
            } else {
                return await speakText(`User not found`);
            }
            localuser = JSON.parse(localStorage.getItem('user'));
        }
        switch (type) {
            case "create_todolsit":
                await speakText("What is your to do task");
                console.log("Enter", localuser._id)
                const todoTask = await takeInput();
                var data = await axios.post(`${URL}/todo/todo`, { title: todoTask, completed: false, userid: localuser._id });
                console.log("Data")
                if (data.data) {
                    await speakText(`ok your task ${todoTask} is added`);
                } else {
                    await speakText(`your task is not added`);
                }
                break;
            case "update_todolsit":
                await speakText("Which task you want to update");
                const oldTask = await takeInput();
                await speakText("  Tell what should you want to updated");
                const updatedTask = await takeInput();
                var data = await axios.put(`${URL}/todo/todo`, { title: oldTask, completed: false, userid: localuser._id, updatetitle: updatedTask });
                if (data.data) {
                    await speakText(`your task ${updatedTask} is update`);
                } else {
                    await speakText(`your task is not update`);
                }
                break;
            case "delete_todolsit":
                await speakText("Which task you want to delete");
                const taskname = await takeInput();
                var data = await axios.post(`${URL}/todo/deletetodo`, { title: taskname, userid: localuser._id });
                if (data.data) {
                    await speakText(`your task ${taskname} is deleted`);
                } else {
                    await speakText(`your task is not delted`);
                }
                break;
            case "get_todolsit":
                await speakText("Which task you find in your list");
                const nam = await takeInput();
                var data = await axios.post(`${URL}/todo/utodo`, { title: nam, userid: localuser._id });
                if (data.data) {
                    await speakText(`your task ${nam} `);
                } else {
                    await speakText(`your task is not find`);
                }
                break
            case "getAll_todolsit":
                await speakText("Wait your to do list fetch plz wait");
                var data = await axios.post(`${URL}/todo/gettodo`, { userid: localuser._id });
                if (data.data) {
                    await speakText(`your todos is find`);
                    let i = 0;
                    while (i < data.data.data.length) {
                        await speakText(`your ${i + 1} todo task is ${data.data.data[i].title}`);
                        i++;
                    }
                } else {
                    await speakText(`your task is not find`);
                }
                break;
            default:
                await speakText("Sorry, I don't know much more about that, but with time I am updating myself");
                break;
        }
    } catch (err) {
        console.error("Error:", err);
    }
}
export default todo;
