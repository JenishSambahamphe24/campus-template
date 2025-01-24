import React, { useState } from 'react'
import { Button } from '@mui/material'
import { addNewFeedback } from '../cmsScreen/cms-components/Feedback/feedbackApi';
import { toast } from 'react-toastify';

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
    <div className='px-20 '>
      <section className=" text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
          <div
            className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-6 flex items-end justify-start relative"
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3518.783681196535!2d81.57242149999999!3d28.1226218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399861dfde7ef4db%3A0xb74a0fe71e10f79d!2sGyanodaya%20Multiple%20Public%20Campus!5e0!3m2!1sen!2snp!4v1737265903384!5m2!1sen!2snp"
            ></iframe>

            <div className="bg-white relative flex flex-wrap py-6 rounded shadow-md">
              <div className="lg:w-1/2 px-6">
                <h2 className="title-font font-bold text-[#0368b0]  text-sm">ADDRESS</h2>
                <p className="mt-1"> Khajura, Banke, Lumbini Province</p>
              </div>
              <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                <h2 className="title-font font-bold text-[#0368b0]  text-sm">EMAIL</h2>
                <a href="rerl@aepc.gov.np" className="text-blue-900 leading-relaxed"> rerl@aepc.gov.np </a>
                <h2 className="title-font font-bold text-[#0368b0]  text-sm">PHONE</h2>
                <p className="leading-relaxed">01-5544146</p>
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