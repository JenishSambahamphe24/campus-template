import React from 'react'
import { Outlet } from 'react-router-dom'
import QAANavbar from './QAANavbar'
import Footer from '../Components/Footer'

function QAALayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <QAANavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default QAALayout
