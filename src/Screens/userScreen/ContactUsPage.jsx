import React, { useState } from 'react'
import { Button } from '@mui/material'
import { addNewFeedback } from '../cmsScreen/cms-components/Feedback/feedbackApi';
import { toast } from 'react-toastify';
const map_iframe = import.meta.env.VITE_MAP_IFRAME
const address = import.meta.env.VITE_ADDRESS
const email = import.meta.env.VITE_EMAIL
const phone = import.meta.env.VITE_PHONE


function ContactUsPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: '',
    contactNo: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newData = await addNewFeedback(formData)
      toast.success('Your feedback has been succesfully sent to our support')
      setFormData({
        fullName: '',
        email: '',
        message: '',
        contactNo: ''
      });
    } catch (error) {
      toast.error('There was an error sending your feedback. Please try again.');
      console.log(error)
    }
  }


  return (
    <div className='p-4 lg:px-20 '>
      <section className=" text-gray-600 body-font relative">
        <div className="container px-5 py-4 lg:py-16 mx-auto flex sm:flex-nowrap flex-wrap">
          <div
            className="w-full min-h-52 lg:w-2/3 md:w-2/3  rounded-lg overflow-hidden sm:mr-10 p-6 flex items-end justify-start relative"
          >
            <iframe
              width="100%"
              height="100%"
              className="absolute inset-0"
              frameBorder="0"
              title="map"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              src={map_iframe}
            ></iframe>

            <div className="bg-white hidden lg:relative lg:flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-bold text-[#1169bf]  text-sm">ADDRESS</h2>
                <p className="mt-1"> {address} </p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-bold text-[#1169bf]  text-sm">EMAIL</h2>
                <a className="text-blue-900 leading-relaxed"> {email} </a>
                <h2 className="title-font font-bold text-[#1169bf]  text-sm">PHONE</h2>
                <p className="leading-relaxed">{phone}</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-2 mt-8 md:mt-0">
            <form onSubmit={handleSubmit}>
              <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
              <p className="leading-relaxed mb-2 text-gray-600">
                We're always here to listen! Your feedback is valuable to us, and we welcome any suggestions or thoughts you have.
              </p>
              <div className="relative mb-1">
                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                <input
                  type="text"
                  required
                  id="name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-1">
                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-1">
                <label htmlFor="contactNo" className="leading-7 text-sm text-gray-600">contact No</label>
                <input
                  id="contactNo"
                  name="contactNo"
                  required
                  value={formData.contactNo}
                  onChange={handleChange}
                  className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
              <div className="relative mb-1">
                <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full bg-white rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                ></textarea>
              </div>
              <Button type='submit' variant='contained' size='small'>
                send feedback
              </Button>
            </form>
          </div>
        </div>
      </section >
    </div>

  )
}

export default ContactUsPage