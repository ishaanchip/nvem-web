import React from 'react'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Home from './components/Home/Home.jsx'
const Router = () => {
return (
  <BrowserRouter basename='/'>
      <Routes>
          <Route path="/" element={<Home/>}></Route>
      </Routes>
  </BrowserRouter>
)


}


export default Router