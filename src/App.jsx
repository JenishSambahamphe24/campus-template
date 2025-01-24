import { useState } from 'react'
import Navbar from './Components/Navbar'
import './App.css'
import Footer from './Components/Footer'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ScrollToTop from './ScrollToTop'

function App() {
  return (
    <div >
      <ScrollToTop />
      <ToastContainer />
      <Navbar />
      <div style={{ minHeight: '250px', marginBottom: '25px' }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default App
