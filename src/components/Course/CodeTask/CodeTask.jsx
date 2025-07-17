import React, {useState, useEffect} from 'react'
import ".././Course.css"
import "./CodeTask.css"

//images & icons


//intercomponent imports
import Header from '../../Header/Header.jsx'
import CodingTerminal from './CodingTerminal/CodingTerminal'
import { navigateFontSize } from '../courseHelper'
import { fetchNvemCourse } from '../../generalHelper/simpleRoutes.js'


//external dependenices
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon, ArrowTurnDownRightIcon } from '@heroicons/react/24/solid'




const CodeTask = () => {

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


   //0. fetch backend data concerning course
        const [codingTaskHeader, setCodingTaskHeader] = useState('');
        const [codingTaskIntro, setCodingTaskIntro] = useState('');
        const [codingTaskExamples, setCodingTaskExamples] = useState([]);

        const {data: task, isFetched: taskFetched} = useQuery({
            queryKey:['code-task-course-data'],
            queryFn:async() => fetchNvemCourse(course_name, 'content'),
            staleTime:0
        })

        useEffect(() =>{
            if (task){
                setCodingTaskHeader(task.coding_task.header)
                setCodingTaskIntro(task.coding_task.overview)
                setCodingTaskExamples(task.coding_task.examples)
            }
        }, [task])

    //1. getting data concerning progress of code task
        const [codeTaskProgress, setCodeTaskProgress] = useState({solution_1:true, solution_2:true, solution_3:true})


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
            console.log(codeTaskProgress)
        }, [fontData])

        
    


  return (
    <div className='codetask-shell'>
        <Header />
        <div className="title-area">
            <div className="article-data">
                <h1>Coding Task: {course_name}</h1>
                <p className='intro-text'> {codingTaskHeader}: {codingTaskIntro}</p>
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
                    <Link to={`/code-task/${course_name}`} className="course-step current-step"><p>Programming Challenge</p><ChevronLeftIcon style={{maxWidth:'20px', color:'black'}}></ChevronLeftIcon></Link>
                    <Link to={`/quiz/${course_name}`} className="course-step"><p>Course Quiz</p></Link>
            </div>
        </div>
        <div className="code-area">
            {
            codingTaskExamples.map((example, i) =>(
                <div className="example">
                    <div className="example-description">
                        <h3 style={{fontSize:wordSize.h3}}>Example #{i + 1}</h3>
                        
                        <button style={{fontSize:wordSize.p}}>
                                {codeTaskProgress?.[`solution_${i + 1}`] === true  ? "Complete" : "In Progress"}
                        </button>
 
                    </div>

                    <p style={{fontSize:wordSize.p}}>input: {example.input}</p>
                    <div className="output-area">
                        <ArrowTurnDownRightIcon style={{maxWidth:'20px', color:'black', marginRight:'10px'}}></ArrowTurnDownRightIcon>
                        <p style={{fontSize:wordSize.p}}>output: {example.output}</p>
                    </div>
                </div>
                ))
            }
        </div>

        <CodingTerminal course_name={course_name} accountEmail={accountEmail} setCodeTaskProgress={setCodeTaskProgress}/>

        <div className="navigation-area">
            <Link className="prev-nav" to={`/article/${course_name}`}>
                <ChevronLeftIcon style={{maxWidth:'20px', color:'black'}}></ChevronLeftIcon>
                <p>Step Back: Article</p>
            </Link>
            <Link className="next-nav" to={`/quiz/${course_name}`}>
                <p>Next Up: Quiz [production]</p>
                <ChevronRightIcon style={{maxWidth:'20px', color:'black'}}></ChevronRightIcon>
            </Link>
        </div>        
    </div>
  )
}

export default CodeTask