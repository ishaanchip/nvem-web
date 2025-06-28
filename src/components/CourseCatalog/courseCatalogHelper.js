import axios from 'axios'

//course information
export const recentCourseData = {
    name:"Introduction to AI",
    selection_data:{
        mini_description:"This beginner-friendly course introduces key AI concepts like machine learning, neural networks, and natural language processing. Gain a strong foundation to understand how AI powers tools like chatbots, recommendation systems, and image recognition.",
    },
    release_date:"07/01/25",
    author:"ishaan chiplunkar",
    course_content:{
        video:undefined, // youtube video ID (STRING), can use youtube function to fetch vid from there
        article:[
            {
                header:"",
                paragraphs:["", ""]
            },
            {
                header:"",
                paragraphs:["", ""]
            },
        ],
        code_task:{
            task_description:{
                header:"",
                paragraph:["", ""]
            },
            starter_code:"",
            expected_output:"",
        },
        quiz:{
            question_bank:[
                {
                    question:"",
                    question_choices:["", ""],
                    correct_answer:"",
                },
                {
                    question:"",
                    question_choices:["", ""],
                    correct_answer:"",
                },
            ]
        }
    }

    
}



//FUNCTIONALITY 

//ROUTES

    export const addAccountWaitlist = async (course_name, email) =>{
        try{
            let postData = {course_name:course_name, email:email}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}course/add-to-waitlist`, postData);
            console.log(result.data);

        }
        catch(err){
            console.log(`there was frontend error adding account to waitlist -> ${err}`)
        }
    }

