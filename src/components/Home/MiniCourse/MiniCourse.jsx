import React, {useState, useEffect, use} from 'react'
import "./MiniCourse.css"

//images & icons
import {ChevronLeftIcon} from "@heroicons/react/24/solid"


//intercomponent imports
import { getYoutubeVideo } from '../../generalHelper/youtubeAPI'

//external dependenices
import { Heading, Button, CloseButton, Dialog, Portal} from "@chakra-ui/react"
import { useQuery } from '@tanstack/react-query'
import { useClerk, SignUpButton } from '@clerk/clerk-react'


const MiniCourse = ({currentVideoId}) => {
  //1.getting video associated data
    const [youtubeVideo, setYoutubeVideo] = useState([])
    const [youtubeImg, setYoutubeImg] = useState({})

    const {data:youtubeData} = useQuery({
        queryKey:['youtube-mini-video'],
        queryFn:async () => getYoutubeVideo(currentVideoId),
        staleTime:0
    })

    useEffect(() =>{
        if (youtubeData){
            setYoutubeVideo(youtubeData[0])
            setYoutubeImg(youtubeData[0].snippet.thumbnails.maxres)
        }
    }, [youtubeData])

    //2.sign up on click of any mini components
    const [isOpen, setIsOpen] = useState(false)
    const { openSignUp } = useClerk();
  
    const handleSignUpClick = () => {
      setIsOpen(false); // close Chakra Dialog first
      openSignUp(); // open Clerk modal
    };




   
    
  return (
    <Dialog.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)} size="lg" placement="center" motionPreset="slide-in-bottom">
    <Dialog.Trigger asChild>
      {
        Object.keys(youtubeImg).length > 0 
        ?
        <img src={youtubeImg.url} />
        :
        <div></div>
      }
    </Dialog.Trigger>
    <Portal>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content maxW="800px"  width="90%" maxH="500px" height="60%">
          <Dialog.Header>
            <Heading m="1% 2%" fontSize="2xl">Introduction to AI</Heading>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Header>
          <Dialog.Body>
            <div className="contents">
                <div className="video-player">
                    <iframe src={`https://www.youtube.com/embed/${youtubeVideo.id}?autoplay=1&mute=1`} allow="accelerometer; autoplay; encrypted-media; gyroscope" ></iframe>
                </div>
                <div className="course-overview">
                    <div className="course-item in-progress"><p>Watch Video</p><ChevronLeftIcon style={{maxWidth:'20px'}}></ChevronLeftIcon></div>
                    <div className="course-item" onClick={handleSignUpClick}><p>Read Article</p></div>
                    <div className="course-item" onClick={handleSignUpClick}><p>Programming Challenge</p></div>
                    <div className="course-item" onClick={handleSignUpClick}><p>Course Quiz</p></div>
                </div>
            </div>
            <div className='account-note' onClick={handleSignUpClick}><p>create free account to unlock full course</p></div>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Positioner>
    </Portal>
  </Dialog.Root>
  )
}

export default MiniCourse