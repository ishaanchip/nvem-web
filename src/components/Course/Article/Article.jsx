import React, {useState, useRef, useEffect} from 'react'
import ".././Course.css"
import "./Article.css"

//images & icons


//intercomponent imports
import Header from '../../Header/Header.jsx'
import { navigateFontSize } from '../courseHelper'
import { fetchNvemAccount, fetchNvemCourse } from '../../generalHelper/simpleRoutes.js'
import { starterText, transformArticleData, updateHighlightData, isSentenceHighlighted  } from './articleHelper'


//external dependenices
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpIcon, ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'



const Article = () => {
    
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


   //1. fetch backend data concerning course
        const [articleContent, setArticleContent] = useState([]);
        let articleInfo = [];
        const {data: article, isFetched: articleFetched, isLoading, refetch} = useQuery({
            queryKey:['article-course-data'],
            queryFn:async() => fetchNvemCourse(course_name, 'content'),
            staleTime:0
        })

        useEffect(() =>{
            if (article){
                setArticleContent(transformArticleData(article.article))
                articleInfo = transformArticleData(article.article)

            }
        }, [article])

    //2. highlighter functionality
        //2a. changes in frontend
        const [currentHiglights, setCurrentHighlights] = useState([]);
        const {data: highlightData} = useQuery({
            queryKey:['highlight-data'],
            queryFn:async() => fetchNvemAccount(accountEmail, 'course_history'),
            staleTime:0
          })
          useEffect(() =>{
            if (highlightData){
              console.log(highlightData)
              setCurrentHighlights(highlightData[0][course_name].article_highlights);

            }
          }, [highlightData])

          //2b. updating highlight data in mongodb
          const handleHighlightChange = async(highlightCoordinates, highlightText) =>{
            let localHighlights = currentHiglights;
            let i = highlightCoordinates[0];
            let j = highlightCoordinates[1];
            let k = highlightCoordinates[2];
            let coordinateIndex = -1;
            for (let index = 0; index < localHighlights.length; index++){
                if (i == localHighlights[index][0][0] && j == localHighlights[index][0][1] && k == localHighlights[index][0][2]){
                    coordinateIndex = index;
                }
            }
            if (coordinateIndex === -1){
                localHighlights.push([highlightCoordinates, highlightText]);
                setCurrentHighlights(localHighlights)
                updateHighlightData(course_name, accountEmail, localHighlights) //backend func to update highlights

            }
            else{
                localHighlights.splice(coordinateIndex, 1)
                setCurrentHighlights(localHighlights);
                updateHighlightData(course_name, accountEmail, localHighlights) //backend func to update highlights
            }
            setArticleContent([...articleContent])
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
    <div className='article-shell'>
        <Header />
        <div className="title-area" >
            <div className="article-data">
                <h1>Article: {course_name}</h1>
                <p className='intro-text' > {starterText.mini_description}</p>
                <div className="feature-bar">
                    <div className='feature-component'>
                        <p >07/01/25</p>
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
                    <Link to={`/article/${course_name}`} className="course-step current-step"><p>Read Article</p><ChevronLeftIcon style={{maxWidth:'20px', color:'black'}}></ChevronLeftIcon></Link>
                    <Link to={`/code-task/${course_name}`} className="course-step"><p>Programming Challenge</p></Link>
                    <Link to={`/quiz/${course_name}`} className="course-step"><p>Course Quiz</p></Link>
            </div>
        </div>
        <div className="article-area" >

            <div className="article-content">
            {
            articleContent?.map((section, i) =>(
                <div>
                    <h1 style={{'fontSize':`${wordSize.h1}px`}}>{section.header}</h1>
                    {section.sentencedParagraph.map((paragraph, j) => (
                        <div> 
                        <p style={{fontSize:wordSize.p}}>
                        {
                        paragraph.map((sentence, k) => {
                            return (
                                <span
                                    key={k}
                                    className={isSentenceHighlighted(currentHiglights, [i, j, k]) ? 'sentence highlight' : 'sentence'}
                                    onClick={() => 
                                        handleHighlightChange([i, j, k], sentence)
                                        
                                    }
                                >
                                    {sentence}.
                                </span>
                                );
                            })
                        }
                        </p>
                        <p className='paragraph-buffer'></p>
                        </div>
                        
                    ))}
                </div>
            ))
            }   
                
                <div className="reference-area"> 
                    <h3 style={{'fontSize':`${wordSize.h3}px`}}>Related Resources</h3>
                    <p style={{'fontSize':`${wordSize.p}px`}}>“How AI Works.” Khan Academy, 1.9 years ago, Khan Academy, https://www.khanacademy.org/college-careers-more/ai-for-education/x68ea37461197a514:ai-for-education-unit-1/x68ea37461197a514:ai-how-ai-works/v/how-ai-works. Accessed 22 June 2025.</p>
                </div>
            </div>
            {/* <div className="article-ads">
                <div className="slot">
                    <div className="slot-one">
                        <h1>Support CSToday</h1>
                        <p>CSToday delivers free, reliable, and up-to-date computer science news, empowering learners and professionals to stay informed and inspired daily.</p>
                    </div>

                </div>
                <div className="slot">
                    <div className="slot-two">
                            <img src={homeArticleFullSet[id].sponserOne.img} alt="recent-article-image" /> 
                            <p>Free Code Camp is a non-profit that provides free online coding courses and certifications in various fields, including web development, data science, and more.</p>
                    </div>
                </div>
            </div> */}

        </div>

        <div className="navigation-area" >
            <Link className="prev-nav" to={`/video-walkthrough/${course_name}`}>
                <ChevronLeftIcon style={{maxWidth:'20px', color:'black'}}></ChevronLeftIcon>
                <p>Step Back: Walkthrough Video</p>
            </Link>
            <Link className="next-nav" to={`/code-task/${course_name}`}>
                <p>Next Up: Coding Task</p>
                <ChevronRightIcon style={{maxWidth:'20px', color:'black'}}></ChevronRightIcon>
            </Link>
        </div>        
    </div>
  )
}

export default Article