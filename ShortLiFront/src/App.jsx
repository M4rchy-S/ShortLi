import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import MainPage from './pages/MainPage'
import GetLinkPage from './pages/GetLinkPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>} />
        <Route path="/get/:shorturl" element={<GetLinkPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
