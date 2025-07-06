import React, {useState, useEffect, useRef} from 'react'
import ".././Course.css"
import "./Quiz.css"

//images & icons


//intercomponent imports
import Header from '../../Header/Header.jsx'
import { navigateFontSize } from '../courseHelper'
import { fetchNvemAccount, fetchNvemCourse } from '../../generalHelper/simpleRoutes.js'
import { starterText, numberToLetter  } from './quizHelper.js'


//external dependenices
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon,  } from '@heroicons/react/24/solid'
import { Button } from '@chakra-ui/react'
import { toaster } from "../../ui/toaster"
import { Alert, CloseButton } from '@chakra-ui/react'



const Quiz = () => {
    //0. fetch essential info
        const {course_name} = useParams(); 
        let accountEmail = localStorage.getItem('the_current_user');


    //1. quiz rendering and selection relation functionality

        const {data: quizData, isFetched: quizDataFetched} = useQuery({
            queryKey:['quiz-course-data'],
            queryFn:async() => fetchNvemCourse(course_name, 'content'),
            staleTime:0
        })
  
        const [completeQuizData, setCompleteQuizData] = useState([]);
        const [questionQuizData, setQuestionQuizData] = useState([]);
        //getting dynamic scroll on questions
        const questionViewRef = useRef([])

        useEffect(() =>{
            if (quizData){
                console.log(quizData)
                setCompleteQuizData(quizData.question_bank)
                setQuestionQuizData( quizData.question_bank.map((question) => question.answer_choices))
                questionViewRef.current = quizData.question_bank.map(
                    (_, i) => questionViewRef.current[i] ?? React.createRef()
                  );
            }
        }, [quizData])

    //2. handling quiz question selection
        const [currentSelectionString, setCurrentSelectionString] = useState(["", "", "", "", ""])
        const [currentSelectionInteger, setCurrentSelectionInteger] = useState([-1, -1, -1, -1, -1])
        const [validSubmission, setValidSubmission] = useState(false);
        const [questionAttempted, setQuestionAttempted] = useState(false)
        const handleQuestionSelection = (choice, index) =>{
            setCurrentSelectionString(previousSelections => {
                const tempSelection = [...previousSelections]
                tempSelection[index] = choice;
                return tempSelection
            })
            setCurrentSelectionInteger(previousSelections => {
                const tempSelection = [...previousSelections]
                tempSelection[index] = questionQuizData[index].indexOf(choice);
                return tempSelection
            })
        }

        const handleQuestionScroll = (currentIndex) =>{
            const scrollSpecs = {
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest',
            }

            const nextItemIndex = (currentIndex + 1) % currentSelectionString.length;
            if (questionViewRef.current[nextItemIndex]?.current){
                questionViewRef.current[nextItemIndex].current.scrollIntoView(scrollSpecs)
            }
        }

        const handleQuizFullyAnswered = () =>{
            for (let i = 0; i < currentSelectionInteger.length; i++){
                if (currentSelectionInteger[i] == -1){
                    setValidSubmission(false)
                    setQuestionAttempted(true)
                    return false
                }
            }
            setValidSubmission(true)
            return true;
        }

        const handleQuizResults = () =>{
            let score = 0;
            for (let i =0; i < currentSelectionString.length; i++){
                if (currentSelectionString[i] === completeQuizData[i].correct_choice){
                    score++;
                }
            }
            return score;
        }




    //3. font adjuster
      //ADJUSTING FONT: word size variables
        const [wordSize,  setWordSize] = useState({
            "h1":30,
            "h3":24,
            "p":16
        })
        const [wordSizeType, setWordSizeType] = useState(1);

        const [fontData, setFontData] = useState({
            fontSet:{
                "h1":30,
                "h3":24,
                "p":16
            },
            size:1
        })

        const handleNavigateFontSize = (direction) =>{
            setFontData(navigateFontSize(wordSizeType, direction))
        }

        useEffect(() =>{
            setWordSize(fontData.fontSet);
            setWordSizeType(fontData.size);
        }, [fontData])





    return (
    <div className='quiz-shell'>
        <Header />

        <div className="title-area">
            <div className="article-data">
                <h1>Quiz: {course_name}</h1>
                <p className='intro-text'> {starterText.mini_description}</p>
                <div className="feature-bar">
                    <div className='feature-component'>
                        <p>07/01/25</p>
                    </div>
                    <div className="feature-component" onClick={() => handleNavigateFontSize("inc")} >
                        <p style={wordSizeType == 2 ? {'color':'gray'} : {'color':'white'}}>A </p>
                        <ArrowUpIcon style={wordSizeType == 2 ? {'color':'gray'} : {'color':'white'}} className='icons' ></ArrowUpIcon>
                    </div>
                    <div className="feature-component" onClick={() => handleNavigateFontSize("dec")}>
                        <p  style={wordSizeType == 0 ? {'color':'gray'} : {'color':'white'}}>a </p>
                        <ArrowDownIcon style={wordSizeType == 0 ? {'color':'gray'} : {'color':'white'}} className='icons' ></ArrowDownIcon>
                    </div>
                </div>
            </div>
            <div className="course-progress">
                    <Link to={`/video-walkthrough/${course_name}`} className="course-step complete-step"><p>Watch Video</p></Link>
                    <Link to={`/article/${course_name}`} className="course-step complete-step"><p>Read Article</p></Link>
                    <Link to={`/code-task/${course_name}`} className="course-step complete-step"><p>Programming Challenge</p></Link>
                    <Link to={`/quiz/${course_name}`} className="course-step current-step"><p>Course Quiz</p><ChevronLeftIcon style={{maxWidth:'20px', color:'black'}}></ChevronLeftIcon></Link>
            </div>
        </div>
        <div className="quiz-area">
            <div className="quiz-questions">
            {
                completeQuizData.map((quizQuestion, i) =>(

                    <div className="quiz-question" ref={questionViewRef.current[i]}>
                        <div className="quiz-content">
                            <h3 style={{fontSize:wordSize.h3}}>{i+1}. {quizQuestion?.question}</h3>
                            <div className="quiz-choices">
                                {quizQuestion.answer_choices.map((choices) =>(
                                    <div className="quiz-choice" 
                                        style={
                                        currentSelectionString[i] === (choices) 
                                        ? {backgroundColor:'rgba(50, 90, 192, 0.7)', color:'whitesmoke'} 
                                        : {}}
                                        onClick={() => {
                                            handleQuestionSelection(choices, i)
                                            if (i !== currentSelectionString.length - 1)
                                                handleQuestionScroll(i)
                                            }}
                                        
                                    >
                                        <p style={{fontSize:wordSize.p}}>{choices}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="quiz-explanation">
                            <h3 style={{fontSize:wordSize.h3}}>Question Explanation</h3>
                            <p style={{fontSize:wordSize.p}}>{quizQuestion.explanation}</p>
                        </div>

                        
                    </div>

                ))
            }
            </div>
            
            <div className="quiz-status">
                <div className='question-state-area'>
                    {
                        currentSelectionInteger.map((selection, i) => (
                            <p className="question-state" onClick={() => handleQuestionScroll(i - 1)}>
                                Question #{i + 1}: {numberToLetter[selection]}
                            </p>
                        ))
                    }
                </div>
                <Button 
                    w="35%" m="2%" variant="outline" size="sm"className='button' 
                    onClick={() => {
                        if (handleQuizFullyAnswered() === true){
                            console.log('complete!')
                        }
                    }}
                >
                    Submit Quiz
                </Button>
                

            </div>

        </div>
        {
        (validSubmission === false && questionAttempted === true) &&
            <Alert.Root status="error" className='alert-tag'>
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>Incomplete Submission</Alert.Title>
                    <Alert.Description>
                    Answer all questions to submit!
                    </Alert.Description>
                </Alert.Content>
                <CloseButton pos="relative" top="0" insetEnd="0" onClick={() => setValidSubmission(true)}/>
            </Alert.Root>
        }

        <div className="navigation-area">
            <Link className="prev-nav" to={`/code-task/${course_name}`}>
                <ChevronLeftIcon style={{maxWidth:'20px', color:'black'}}></ChevronLeftIcon>
                <p>Step Back: Code Task</p>
            </Link>
            <Link className="next-nav" to={`/`}>
                <p>Return Home</p>
                <ChevronRightIcon style={{maxWidth:'20px', color:'black'}}></ChevronRightIcon>
            </Link>
        </div>  


    </div>
  )
}

export default Quiz