import React, {useState, useEffect, useRef} from 'react'
import "./QuizResults.css"

//images & icons


//intercomponent imports
import { getCorrectAnswers, numberToLetter, updateUserQuiz } from './quizHelper'


//external dependenices
import {Dialog, Portal, Heading, Button, CloseButton} from "@chakra-ui/react"
import { useQuery } from '@tanstack/react-query'
import { fetchNvemAccount} from '../../generalHelper/simpleRoutes'


const QuizResults = ({course_name, accountEmail, setQuizSubmitted,  completeQuizData, currentSelectionInteger, setCurrentSelectionInteger, setCurrentSelectionString}) => {
    



    const [quizResultData, setQuizResultData] = useState(null)
    //modal open status
    const [isOpen, setIsOpen] = useState(false)
    const handleViewQuiz = () => {
        setIsOpen(false); // close Chakra Dialog first
    };

    const handleSubmitQuiz = () =>{
        setQuizSubmitted(true)
        let {score, answerComparison} = getCorrectAnswers(completeQuizData, currentSelectionInteger)
        updateUserQuiz(course_name, accountEmail, score, currentSelectionInteger)
        setQuizResultData(answerComparison)
    }
  return (
    <Dialog.Root size="lg" placement="center" motionPreset="slide-in-bottom" open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
    <Dialog.Trigger asChild>
        <Button onClick={() => {
            handleSubmitQuiz()            
        }}
        w="35%" m="2%" variant="outline" size="sm" className='button' 
        >  
        Submit Quiz
        </Button>
    </Dialog.Trigger>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content maxW="800px"  width="90%" maxH="1200px" height="90%">
                <Dialog.Header>
                    <Heading m="1% 2%" fontSize="2xl">Quiz Results</Heading>
                    <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Header>
                <Dialog.Body>
                <div className="question-breakdown-area"> 

                    {
                        quizResultData != null &&
                        quizResultData?.map((comparison, i) =>(
                        <div className="question-breakdown">
                            <h1>Question #{i + 1}: {comparison[0]}</h1>
                            <p>User Answer: {numberToLetter[comparison[1]]}</p>
                            <p>Answer Key: {numberToLetter[comparison[2]]}</p>
                            {
                                comparison[3] === true
                                ?
                                <p style={{backgroundColor:'rgb(0, 255, 0)'}} className='question-indicator'>correct</p>
                                :
                                <p style={{backgroundColor:'rgb(255, 0, 0)'}} className='question-indicator'>incorrect</p>
                            }
                        </div>
                        ))
                        
                    }


                </div>
                <div className="nav-options">
                    <Button onClick={() => handleViewQuiz()} w="25%">View Explanations</Button>
                </div>

                </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
    </Dialog.Root>
  )
}

export default QuizResults