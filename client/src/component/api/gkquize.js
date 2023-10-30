import { speakText } from '../text_to_speack/speaktext';
// import { takeInput } from './translate';
import axios from 'axios';

// async function gkquize() {
//     try {
//         var score = 0;
//         const { data } = await axios.get("https://the-trivia-api.com/v2/questions");
//         for (let i = 0; i < data.length; i++) {
//             await speakText(`Question ${data.question}`);

//             const answers = data.incorrectAnswers.slice(); // Copy incorrect answers array
//             answers.push(data.correctAnswer); // Add the correct answer to the array
//             shuffleArray(answers); // Randomly shuffle the answers
//             const options = ['A', 'B', 'C', 'D'];//option
//             for (let j = 0; j < answers.length; j++) {
//                 await speakText(`${options[j]}. ${answers[j]}`);
//             }
//             await speakText("Choose one option")
//             let answer = await takeInput();
//             var k = 0;
//             while (!answer && k != 3) {
//                 await speakText("Plz choose one answer")
//                 answer = await takeInput()
//                 k++;
//             }
//             if (answer && answer === data.correctAnswer) {
//                 await speakText("Your answer is correct");
//                 score++;
//             } else {
//                 await speakText("Your answer is incorrect");
//             }
//             if (i < data.length - 1) {
//                 await speakText("Next Quesion");
//             }
//         }
//         await speakText(`Your Score is ${score}`);
//     } catch (error) {
//         console.error(error);
//     }
// }
const takeInput = () => {
    return new Promise((resolve, reject) => {
        const recognition = new webkitSpeechRecognition();
        recognition.onresult = (event) => {
            const output = event.results[0][0].transcript;
            resolve(output); // Resolve the promise with the recognized text
        };
        recognition.onerror = (error) => {
            resolve(null);// Reject the promise in case of an error
        };
        recognition.onend = () => {
            // If onresult is not called before onend, resolve with null
            resolve(null);
        };
        recognition.start();
    });
};

async function gkquize() {
    try {
        var score = 0;
        const { data } = await axios.get("https://the-trivia-api.com/v2/questions");
        for (let i = 0; i < data.length; i++) {
            const question = data[i].question;
            const correctAnswer = data[i].correctAnswer;
            const incorrectAnswers = data[i].incorrectAnswers;
            await speakText("Question")
            await speakText(question.text);
            const options = ['A', 'B', 'C', 'D'];
            const answers = [...incorrectAnswers, correctAnswer];
            shuffleArray(answers);

            for (let j = 0; j < answers.length; j++) {
                await speakText(`${options[j]}. ${answers[j]}`);
            }
            await speakText("Choose from options A B C or D");
            let answer = await takeInput();
            const opt = answer?.split(" ");
            if (answer) {
                answer = opt[opt.length - 1]?.toUpperCase();
            }
            var k = 0;
            while (answer != "A" && answer != "B" && answer != "C" && answer != "D" && k != 3) {
                await speakText("Please gave answer in correct form for example option A option B option C option D");;
                answer = await takeInput();
                k++;
            }
            // const opt = answer.split(" ");
            const index = options.indexOf(answer);
            if (answers[index] === correctAnswer) {
                await speakText("Your answer is correct");
                score++;
            } else {
                await speakText("Your answer is incorrect");
            }
            if (i < data.length - 1) {
                await speakText("Next Question");
            }
        }
        await speakText(`Your Score is ${score}`);
    } catch (error) {
        console.error(error);
    }
}

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default gkquize;