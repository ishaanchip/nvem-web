import React, {useState, useEffect, useRef} from 'react'
import ".././Course.css"
import "./Quiz.css"

//images & icons


//intercomponent imports
import Header from '../../Header/Header.jsx'
import QuizResults from './QuizResults'
import { navigateFontSize } from '../courseHelper'
import { fetchNvemAccount, fetchNvemCourse } from '../../generalHelper/simpleRoutes.js'
import { starterText, numberToLetter  } from './quizHelper.js'


//external dependenices
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon,  } from '@heroicons/react/24/solid'
import { Button } from '@chakra-ui/react'
import { Alert, CloseButton } from '@chakra-ui/react'



const Quiz = () => {
    //essential information
    const {course_name} = useParams(); 
    let accountEmail = localStorage.getItem('the_current_user');


    //0. scrolling to top of article on load
    useEffect(() =>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [])


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
        const [incompleteQuizSubmission, setIncompleteQuizSubmission] = useState(false);
        const [quizSubmitted, setQuizSubmitted] = useState(false)


        const handleQuizFullyAnswered = () =>{
            const tempAnswerSheet = [...currentSelectionInteger].sort((a, b) => b - a).slice(0, currentSelectionInteger.length - 1)
            for (let i = 0; i < tempAnswerSheet.length; i++){
                if (tempAnswerSheet[i] == -1){
                    setValidSubmission(false)
                    return false
                }
            }
            setValidSubmission(true)
            return true;
        }

        const handleQuestionSelection = (choice, index) =>{
            //core variables for quiz status
                let tempStringSelection = [];
                let tempIntegerSelection = [];

            //setting states to update changes
                setCurrentSelectionString(previousSelections => {
                    tempStringSelection = [...previousSelections]
                    tempStringSelection[index] = choice;
                    return tempStringSelection
                })
                setCurrentSelectionInteger(previousSelections => {
                    tempIntegerSelection = [...previousSelections]
                    tempIntegerSelection[index] = questionQuizData[index].indexOf(choice);
                    return tempIntegerSelection
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





    //fetch past quiz attempt data
    const {data: quizHistory, isFetching:quizHistoryFetching} = useQuery({
        queryKey:['quiz-history-data'],
        queryFn:async () => fetchNvemAccount(accountEmail, 'course_history'),
        staleTime:0, 
    })


    useEffect(() =>{
        if (quizHistory){
            console.log(quizHistory)
            if (quizHistory[0][course_name].quiz_attempts > 0){
                console.log('made!')
                let pastQuizChoices = quizHistory[0][course_name].quiz_history
                setCurrentSelectionInteger(pastQuizChoices);
                setIncompleteQuizSubmission(false)
                for (let i = 0; i < currentSelectionString.length; i++){
                    setCurrentSelectionString(previousSelections => {
                        let tempStringSelection = [...previousSelections]
                        tempStringSelection[i] = quizData?.question_bank[i].answer_choices[pastQuizChoices[i]];
                        return tempStringSelection
                    })
                }
            }


        }
    }, [quizHistory])




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
                            {
                            quizHistoryFetching === false && 
                            <div className="quiz-choices">
                                {quizQuestion.answer_choices.map((choices) =>(
                                    <div className="quiz-choice" 
                                        style={
                                        currentSelectionString[i] === (choices) 
                                        ? {backgroundColor:'rgba(50, 90, 192, 0.7)', color:'whitesmoke'} 
                                        : {}}
                                        onClick={() => {
                                            handleQuestionSelection(choices, i)
                                            handleQuizFullyAnswered()
                                            if (i !== currentSelectionString.length - 1)
                                                handleQuestionScroll(i)
                                            }
                                        }
                                            
                                        
                                    >
                                        <p style={{fontSize:wordSize.p}}>{choices}</p>
                                    </div>
                                ))}
                            </div>
                            }
                        </div>
                        {
                        quizSubmitted === true 
                        && 
                        <div className="quiz-explanation">
                            <h3 style={{fontSize:wordSize.h3}}>Question Explanation</h3>
                            <p style={{fontSize:wordSize.p}}>{quizQuestion.explanation}</p>
                        </div>
                        }


                        
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

                {
                validSubmission
                ?
                <QuizResults 
                    course_name={course_name}
                    accountEmail={accountEmail}
                    setQuizSubmitted={setQuizSubmitted} 
                    completeQuizData={completeQuizData}
                    currentSelectionInteger={currentSelectionInteger}
                    currentSelectionString={currentSelectionString}
                    setCurrentSelectionInteger={setCurrentSelectionInteger}
                    setCurrentSelectionString={setCurrentSelectionString}
                />
                :
                <Button 
                    w="35%" m="2%" variant="outline" size="sm" className='button' 
                    onClick={() => setIncompleteQuizSubmission(true)}
                >
                    Submit Quiz
                </Button>
                }

                

            </div>

        </div>
        {
        (incompleteQuizSubmission === true) &&
            <Alert.Root status="error" className='alert-tag'>
                <Alert.Indicator />
                <Alert.Content>
                    <Alert.Title>Incomplete Submission</Alert.Title>
                    <Alert.Description>
                    Answer all questions to submit!
                    </Alert.Description>
                </Alert.Content>
                <CloseButton pos="relative" top="0" insetEnd="0" onClick={() => setIncompleteQuizSubmission(false)}/>
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