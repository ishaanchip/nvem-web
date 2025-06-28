import React from 'react'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import CourseCatalog from './components/CourseCatalog/CourseCatalog.jsx'
import Walkthrough from './components/Course/Walkthrough/Walkthrough.jsx'
import Article from './components/Course/Article/Article.jsx'
import CodeTask from './components/Course/CodeTask/CodeTask.jsx'
import Quiz from './components/Course/Quiz/Quiz.jsx'

const Router = () => {
return (
  <BrowserRouter basename='/'>
      <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/course-catalog" element={<CourseCatalog/>}></Route>
          <Route path="/video-walkthrough/:course_name" element={<Walkthrough/>}></Route>
          <Route path="/article/:course_name" element={<Article/>}></Route>
          <Route path="/code-task/:course_name" element={<CodeTask/>}></Route>
          <Route path="/quiz/:course_name" element={<Quiz />}></Route>
      </Routes>
  </BrowserRouter>
)


}


export default Router