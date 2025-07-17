import axios from 'axios'



//ROUTING

    //ACCOUNT ROUTES
        //getting account data
        export const fetchNvemAccount = async(email, dataField) =>{
            try{
                const result = await axios.get(`${import.meta.env.VITE_API_URL}account/get-nvem-account/${email}`)
                /*
                POSSIBLE DATA FIELDS
                    email
                    first_name
                    course_history
                    last_name
                */
                return result.data.result[dataField]
        
            }
            catch(err){
                console.log(`there was frontend error getting account info: ${err}`)
            }
        }



    //COURSE ROUTES
        //getting course data
        export const fetchNvemCourse = async(course_name, dataField) =>{
            try{
                const result = await axios.get(`${import.meta.env.VITE_API_URL}course/get-nvem-course/${course_name}`)
                /*
                POSSIBLE DATA FIELDS
                    course_name
                    content
                    waitlist
                */
                return result.data.result[dataField]
        
            }
            catch(err){
                console.log(`there was frontend error getting account info: ${err}`)
            }
        }