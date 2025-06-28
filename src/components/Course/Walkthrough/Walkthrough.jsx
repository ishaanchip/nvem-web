import React, {useState, useEffect} from 'react'
import ".././Course.css"
import "./Walkthrough.css"

//images & icons


//intercomponent imports
import Header from '../../Header/Header.jsx'
import { fetchNvemCourse } from '../../generalHelper/simpleRoutes.js'
import { starterText } from './walkthroughHelper'


//external dependenices
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'


const Walkthrough = () => {

   const {course_name} = useParams(); 

   //1. fetch backend data concerning course
    const [videoId, setVideoId] = useState("");
    const {data: videoCourseData, isFetched: videoCourseDataFetched} = useQuery({
        queryKey:['video-course-data'],
        queryFn:async() => fetchNvemCourse(course_name, 'content'),
        staleTime:0
      })
      useEffect(() =>{
        if (videoCourseData){
          setVideoId(videoCourseData.video_id);
          console.log(videoCourseData)
        }
      }, [videoCourseData])


    


  return (
    <div className='walkthrough-shell'>
        <Header />
        <div className="title-area">
            <div className="article-data">
                <h1>Video Walkthrough: {course_name}</h1>
                <p className='intro-text'> {starterText.mini_description}</p>
                <div className="feature-bar">
                    <div className='feature-component'>
                        <p>07/01/25</p>
                    </div>
                </div>

            </div>
            <div className="course-progress">
                    <Link to={`/video-walkthrough/${course_name}`} className="course-step current-step"><p>Watch Video</p><ChevronLeftIcon style={{maxWidth:'20px', color:'black'}}></ChevronLeftIcon></Link>
                    <Link to={`/article/${course_name}`} className="course-step"><p>Read Article</p></Link>
                    <Link to={`/code-task/${course_name}`} className="course-step"><p>Programming Challenge</p></Link>
                    <Link to={`/quiz/${course_name}`} className="course-step"><p>Course Quiz</p></Link>
            </div>
        </div>
        <div className="video-watch-area">
            <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`} allow="accelerometer; autoplay; encrypted-media; gyroscope" ></iframe>
        </div>
        <div className="navigation-area">
            <div className="prev-nav">
            </div>
            <Link className="next-nav" to={`/article/${course_name}`}>
                <p>Next Up: Article</p>
                <ChevronRightIcon style={{maxWidth:'20px', color:'black'}}></ChevronRightIcon>
            </Link>
        </div>        
    </div>
  )
}

export default Walkthrough