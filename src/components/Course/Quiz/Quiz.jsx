import React, {useState, useEffect} from 'react'
import ".././Course.css"
import "./Quiz.css"

//images & icons


//intercomponent imports
import Header from '../../Header/Header.jsx'
import { navigateFontSize } from '../courseHelper'
import { fetchNvemAccount, fetchNvemCourse } from '../../generalHelper/simpleRoutes.js'
import { starterText  } from './quizHelper.js'


//external dependenices
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon,  } from '@heroicons/react/24/solid'



const Quiz = () => {
    //0. fetch essential info
        const {course_name} = useParams(); 
        let accountEmail = localStorage.getItem('the_current_user');


    //1. quiz answers in state
        const [currentSelections, setCurrentSelections] = useState(["", "", "", "", "", "", ""])



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
            <div className="quiz-question">
                <h3>1. What is the first question?</h3>
                <div className="quiz-choices">
                    <div className="quiz-choice">
                        <p>This is the first choice</p>
                    </div>
                    <div className="quiz-choice">
                        <p>This is the second choice</p>
                    </div>
                    <div className="quiz-choice">
                        <p>This is the third choice</p>
                    </div>
                    <div className="quiz-choice">
                        <p>This is the fourth choice</p>
                    </div>
                </div>
            </div>
        </div>

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