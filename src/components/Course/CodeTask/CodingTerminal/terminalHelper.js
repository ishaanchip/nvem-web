import axios from 'axios'
import { fetchNvemCourse } from '../../../generalHelper/simpleRoutes'


//ROUTING

const PYTHON_VERSION = "3.10.0"
    export const runCode = async(course_name, accountEmail, code) =>{
        try{

            //getting result of their code
            const res = await axios.post('https://emkc.org/api/v2/piston/execute', {
                "language":"python",
                "version":PYTHON_VERSION,
                "files":[
                    {
                        content:code
                    }
                ]
            })
            if (code.length !== 0){

            //updating code to backend
            updateUserCode(course_name, accountEmail, code)

            }

            return res.data;

        }
        catch(err){
            console.log(`Error in frontend running user code: ${err}`)
        }
    }

    const updateUserCode = async (course_name, email, code_history) =>{
        try{
            let postData = {course_name:course_name, email:email, code_history: code_history}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}account/update-code-history`, postData);

        }
        catch(err){
            console.log(`there was frontend error updating code history data -> ${err}`)
        }
    }

    export const verifyCode = async (course_name, userOutput) =>{
        let courseCodeData = await fetchNvemCourse(course_name, "content");
        courseCodeData = courseCodeData.coding_task.examples
        let expectedOutput = courseCodeData.map((ej) => ej.solution)
        console.log(expectedOutput)
        let userOutputArray = userOutput?.split("\n")
        userOutputArray?.splice(userOutputArray.length - 1)
        console.log(userOutputArray)

        return {
            solution_1 : (expectedOutput[0] == userOutputArray[0]),
            solution_2 : (expectedOutput[1] == userOutputArray[1]),
            solution_3 : (expectedOutput[2] == userOutputArray[2]),
        }
        
    }





