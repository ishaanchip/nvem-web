import React, {useState, useEffect} from 'react'
import "./Home.css"

//images & icons

//intercomponent imports
import Header from '../Header/Header'
import MiniCourse from './MiniCourse/MiniCourse';
import { suggestedVideoData, createNvemAccount, nvemLandingText} from './homeHelper';
import { getYoutubeVideo } from '../generalHelper/youtubeAPI';


//external dependenices
import {  useUser as clerkUseUser } from "@clerk/clerk-react";
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';


const Home = () => {
  //1.creating logging into account func
    //clerk status
    const {user, isSignedIn} = clerkUseUser()
    useEffect(()=>{
        if (isSignedIn){
            createNvemAccount(user.firstName, user.lastName, user.emailAddresses[0].emailAddress)
            localStorage.setItem("the_current_user", user.emailAddresses[0].emailAddress)
        }
    }, [isSignedIn])

  //2. fetching youtube data for mini course suggestor [link to course]
      let currentVideoId = suggestedVideoData.videoId
      const [displayImg, setDisplayImg] = useState({})
  
      const {data:fullYoutubeData} = useQuery({
          queryKey:['youtube-mini-video'],
          queryFn:async () => getYoutubeVideo(currentVideoId),
          staleTime:0
      })
  
      useEffect(() =>{
          if (fullYoutubeData){
              setDisplayImg(fullYoutubeData[0].snippet.thumbnails.maxres)
          }
      }, [fullYoutubeData])


  return (
    <div>
        <Header />
        <div className="landing-page-text">
          <h3>{nvemLandingText.mainText}</h3>
          <p>{nvemLandingText.subText}</p>
        </div>
        <div className="latest-course-video-area">
          <h3>Check out our Latest Lesson</h3>
          <div className="img-holder">
            {
              isSignedIn ? <Link to="/course-catalog"><img src={displayImg.url} /></Link>:  <MiniCourse currentVideoId={currentVideoId}></MiniCourse>
            }

          </div>
        </div>
    </div>
  )
}

export default Home