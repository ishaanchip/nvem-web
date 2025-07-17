import axios from 'axios'


//TEMP VARIABLE: heading text description [to be replaced w backend call to certain article]
export const starterText = {
    mini_description: "explore the ins and outs of AI. ever wonder how chatGPT can complete your homework in an instant, or how google Gemini can answer all your burning questions? if this is you, your in the right place"
}




//FUNCTIONALITY
    //1. transform paragraph strings into arrays
    export const transformArticleData = (articleData) =>{
        let finalArticle = [];

        //refactoring articleData: spliting paragraphs to sentences essentially, keeping rest of fields constant
        for (let i = 0; i < articleData.length; i++){
            finalArticle.push(
                {
                header:articleData[i]['header'],
                paragraph:articleData[i]['paragraphs'],
                sentencedParagraph:paragraphToSentence(articleData[i]['paragraphs'])
                }
            )
        }

        return finalArticle

    
    }

        //1a. helper func for sentencedParagraph creation
        const paragraphToSentence = (paragraphs) =>{
            let finalArr = [];
            for (let i = 0; i < paragraphs.length; i++){
                let sentences = paragraphs[i].split(".");
                sentences.pop()
                finalArr.push(sentences);
            }
            return finalArr;
        }

    //2. checking whether sentence highlight or not
        export const isSentenceHighlighted = (highlights, sentencePos) =>{

            for (let i = 0; i < highlights.length; i++){
            if (sentencePos[0] === highlights[i][0][0] && 
                sentencePos[1] === highlights[i][0][1] &&
                sentencePos[2] === highlights[i][0][2]){
                    return true;
                }
            }
            return false;
        }
  


//ROUTES
    //updating highlights data field in mongodb   
    export const updateHighlightData = async (course_name, email, highlights) =>{
        try{
            let postData = {course_name:course_name, email:email, highlights: highlights}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}account/update-highlight-data`, postData);

        }
        catch(err){
            console.log(`there was frontend error updating highlight data -> ${err}`)
        }
    }

