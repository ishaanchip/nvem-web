import React, {useState, useEffect} from 'react'
import "./CourseCatalog.css"

//images & icons


//intercomponent imports
import Header from '../Header/Header'
import { fetchNvemCourse } from '../generalHelper/simpleRoutes'
import { suggestedVideoData } from '../Home/homeHelper'
import { recentCourseData, addAccountWaitlist } from './courseCatalogHelper'
import { getYoutubeVideo } from '../generalHelper/youtubeAPI'

//external dependenices
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@chakra-ui/react'

const WAITLIST_COURSE = 'test_course'

const CourseCatalog = () => {

    //1. fetching youtube data for course display 
      let currentVideoId = suggestedVideoData.videoId
      const [courseImg, setCourseImg] = useState({})

      const {data:youtubeData} = useQuery({
          queryKey:['main-youtube-course'],
          queryFn:async () => getYoutubeVideo(currentVideoId),
          staleTime:0
      })

      useEffect(() =>{
          if (youtubeData){
              setCourseImg(youtubeData[0].snippet.thumbnails.maxres)
          }
      }, [youtubeData])

    //2. WAITLIST FUNCTIONALITY
      let accountEmail = localStorage.getItem('the_current_user');
      const [waitlistMembers, setWaitlistMembers] = useState([]);

      //2a. adding an account email to waitlist
        const handleAddAccountWaitlist = async() =>{
          setWaitlistMembers([...waitlistMembers, accountEmail])
          await addAccountWaitlist(WAITLIST_COURSE, accountEmail);
        }

      //2b. checking if account on waitlist

        const {data: waitlistData, isFetched: waitListDataFetched} = useQuery({
          queryKey:['waitlist-data'],
          queryFn:async() => fetchNvemCourse(WAITLIST_COURSE, 'waitlist'),
          staleTime:0
        })
        useEffect(() =>{
          if (waitlistData){
            setWaitlistMembers(waitlistData);
            console.log(waitlistData)
          }
        }, [waitlistData])



        


  return (
    <div className='course-catalog-shell'>
      <Header/>
      <div className="course-selection">
      <Link to="/video-walkthrough/test_course" className='recent-course'>

          <div className="cover-image-area">
              <img src={courseImg.url} alt="recent-course-image" /> 
          </div>
          <div className="summary-text">
            <div className="info-tag">
              <p>Latest Release</p>
            </div>
            <div className="data">
              <h1 className='course-title'>{recentCourseData.name}</h1>
              <p className='course-description'>{recentCourseData.selection_data.mini_description}</p>
              <p className='metadata'>{recentCourseData.release_date}</p>
              <p className='metadata'>{recentCourseData.author}</p>
            </div>
          </div>
      </Link>
        <div className="waitlist-area">
          <h1>Join our Waitlist</h1>
          <p>Want email updates on our newest releases? Join the queue and be the first to access our next course: 'Using AI Models in Applications'</p>
          {
            ! (waitListDataFetched)
            ? <div></div> 
            :
            (
              waitlistMembers.includes(accountEmail) 
              ? <Button className="display-button" w="45%" style={{'cursor':'text'}}>Waitlist Member</Button> 
              :  <Button className='join-button' w="30%" onClick={handleAddAccountWaitlist} style={{'cursor':'default'}}>Click to Join</Button>
            )
          }
         
          
        </div>
      </div>
    </div>
  )
}

export default CourseCatalog