import axios  from "axios"

//UI
    export const starterText = {
        mini_description: "it's time to put your learning to the test!"
    }

    export const numberToLetter = {
        '-1':"-",
        '0':"A",
        '1':"B",
        '2':"C",
        '3':"D"
    }



//FUNCTIONALITY 

    export const getCorrectAnswers = (questionBank, userKey)  => {
        //generate answer key
            let answerKey = Array(questionBank.length).fill(-1)
            let answerComparison = []
            let score = 0;
            for (let i = 0; i < questionBank.length; i++){
                answerKey[i] = questionBank[i].answer_choices.indexOf(questionBank[i].correct_choice);
                answerComparison.push([questionBank[i].question, userKey[i], answerKey[i]])
                //check if same
                if (answerKey[i] == userKey[i]){
                    score++;
                    answerComparison[i].push(true)
                }
                else{
                    answerComparison[i].push(false)
                }
            }
        

        let quizSubmissionData = {
            answerComparison: answerComparison,
            score:score,
        };

        console.log(quizSubmissionData)
        return quizSubmissionData
        
    }



//ROUTING
    export const updateUserQuiz = async (course_name, email, quiz_score, quiz_history) =>{
        try{
            let postData = {course_name:course_name, email:email, quiz_score: quiz_score, quiz_history: quiz_history}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}account/update-quiz-history`, postData);

        }
        catch(err){
            console.log(`there was frontend error updating quiz data -> ${err}`)
        }
    }
