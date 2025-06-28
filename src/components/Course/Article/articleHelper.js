import axios from 'axios'

export const starterText = {
    mini_description: "explore the ins and outs of AI. ever wonder how chatGPT can complete your homework in an instant, or how google Gemini can answer all your burning questions? if this is you, your in the right place"
}




//functionaltity
    //1. transform paragraph strings into arrays
    export const transformArticleData = (articleData) =>{
        let finalArticle = [];

        for (let i = 0; i < articleData.length; i++){
            console.log(articleData[i])
            finalArticle.push(
                {
                header:articleData[i]['header'],
                paragraph:articleData[i]['paragraphs'],
                sentencedParagraph:paragraphToSentence(articleData[i]['paragraphs'])
                }
            )
        }

        return finalArticle
        // let finalArticle = [
        //     {
        //         header:'',
        //         paragraph:['stop. this.', 'f'],
        //         sentencedParagraph:[["stop", "this"], ["f"]]
        //     }
        // ]
    
    }

        //1a. helper func for one field
        const paragraphToSentence = (paragraphs) =>{
            let finalArr = [];
            console.log(paragraphs)
            for (let i = 0; i < paragraphs.length; i++){
                let sentences = paragraphs[i].split(".");
                sentences.pop()
                finalArr.push(sentences);
            }
            return finalArr;
        }

    //2. checking whether sentence highlight or not
    export const isSentenceHighlighted = (highlights, sentencePos) =>{
        console.log("highlighter: " + highlights)
        console.log(sentencePos)
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

    export const updateHighlightData = async (course_name, email, highlights) =>{
        try{
            let postData = {course_name:course_name, email:email, highlights: highlights}
            const result = await axios.put(`${import.meta.env.VITE_API_URL}account/update-highlight-data`, postData);
            console.log(result.data);

        }
        catch(err){
            console.log(`there was frontend error updating highlight data -> ${err}`)
        }
    }

