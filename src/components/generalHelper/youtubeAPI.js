import axios from 'axios'

//FETCHING VIDEO FROM YOUTUBE
    const API_KEY =  import.meta.env.VITE_YOUTUBE_API_KEY
    const YOUTUBE_BASE_VIDEO_API = "https://www.googleapis.com/youtube/v3/videos"


    export const getYoutubeVideo = async (VIDEO_ID)=>{
        try{
        const res = await axios.get(YOUTUBE_BASE_VIDEO_API, {
            params:{
            part:'snippet',
            key:API_KEY,
            id:VIDEO_ID,
            }
        })
        const youtubeData = await res.data.items;
        return youtubeData;
        }
        catch(err){
        console.log(`there was an error: ${err}`)
        }
    }