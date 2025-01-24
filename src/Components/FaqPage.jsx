import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllFaq } from '../Screens/cmsScreen/cms-components/cms-faq/faqApi';

function FaqPage() {
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [allFaqs, setAllFaqs] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllFaq()
            const activeData = data.filter(item => item.status === true)
            setAllFaqs(activeData)
        };
        fetchData()
    }, [])

    const toggleAnswer = (index) => {
        if (activeQuestion === index) {
            setActiveQuestion(null);
        } else {
            setActiveQuestion(index);
        }
    };

    const faqs = allFaqs.map((item) => ({
        question: item.question,
        answer: item.answer
    }))

    console.log(faqs)
    return (
        <div>
            <section className="py-10 bg-gray-50 ">
                <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                    <div>
                        <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">Frequently Asked Questions</h2>
                    </div>
                    <div className="max-w-3xl mx-auto  space-y-2 md:mt-10">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleAnswer(index)}
                                    className="flex items-center justify-between w-full px-4 py-5 sm:p-6"
                                >
                                    <span className="flex text-lg font-semibold text-black">{faq.question}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${activeQuestion === index ? 'rotate-0' : '-rotate-180'}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                <div
                                    className={`px-4 pb-5 sm:px-6 sm:pb-6 transition-all duration-200 ${activeQuestion === index ? 'block' : 'hidden'}`}
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-600 text-base mt-9">
                        Still have questions ?{' '}
                        <Link to='/contact'>
                            <span className="cursor-pointer font-medium text-tertiary transition-all duration-200 hover:text-tertiary focus:text-tertiary hover-underline">
                                Contact us
                            </span>
                        </Link>
                    </p>
                </div>
            </section>
        </div>
    )
}

export default FaqPage