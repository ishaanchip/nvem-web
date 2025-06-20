import axios from "axios";

//MINI COURSE
    export const suggestedVideoData = {
        videoId:"OmtkvAp2OL0"
    }

//UI Helper
    export const nvemLandingText = {
        mainText:"Educating Tomorrow’s Innovators",
        subText:"NVEM works to empower youth through coding competitions, tech fundraisers, and upcoming AI-focused digital courses—bridging opportunity gaps and inspiring the next generation of creators and problem solvers."
    }

//ROUTING
    //initializes nvem account
    export const createNvemAccount = async(firstName, lastName, email)=>{
        try{
            let postData = {firstName:firstName, lastName:lastName, email:email}
            const result = await axios.post(`${import.meta.env.VITE_API_URL}create-nvem-account`, postData)
            if (result.data.success === true){
                console.log('creating || logging into account was a sucess!');
            }
            else{
                console.log('creating account was NOT a success...');
            }
        }
        catch(err){
            console.log(`there was an error posting account data in frontend: ${err}`)
        }

        
    }


