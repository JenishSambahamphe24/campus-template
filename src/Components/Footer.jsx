import { Grid, } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CiYoutube } from "react-icons/ci";
import { IoMdMail } from "react-icons/io";
import { IoMdCall } from "react-icons/io";
import { getAllTeams } from '../Screens/cmsScreen/cms-components/cms-team/teamApi';
import { Divider } from '@mui/material';
import { getAllLink } from '../Screens/cmsScreen/cms-components/cms-links/linkApi';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const map_iframe = import.meta.env.VITE_MAP_IFRAME
const defaultImage = 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80';
const email = import.meta.env.VITE_EMAIL
const phone = import.meta.env.VITE_PHONE

function Footer() {
    const [officeInfo, setOfficerInfo] = useState({})
    // const [links, setLinks] = useState([])
    const links = [
        { id: 1, name: "Google", url: "https://www.google.com" },
        { id: 2, name: "GitHub", url: "https://github.com" },
        { id: 3, name: "Stack Overflow", url: "https://stackoverflow.com" },
        { id: 4, name: "MDN Web Docs", url: "https://developer.mozilla.org" },
        { id: 5, name: "React Docs", url: "https://react.dev" },
        { id: 6, name: "Tailwind CSS", url: "https://tailwindcss.com" }
      ];
    const [fbLink, setFbLink] = useState({})
    const [xLink, setXLink] = useState({})
    const [ytLink, setYTLink] = useState({})

    const [isLogged, setIsLoggedIn] = useState(false)

    const fetchInfoOfficer = async () => {
        const response = await getAllTeams()
        setOfficerInfo(response.find(item => item.subCategory === 'informationOfficer'))
    }

    const fetchLinks = async () => {
        const response = await getAllLink()
        setFbLink(response.find(item => item.name === 'facebook'))
        setXLink(response.find(item => item.name === 'twitter'))
        setYTLink(response.find(item => item.name === 'youtube'))
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true)
        }
        fetchInfoOfficer()
        fetchLinks()
    }, []);

    return (
        <>
            <footer className='bg-[#0368b0] px-[2rem]  py-8'>
                <div className="mx-auto w-full">
                    <Grid container columnGap='10px' rowGap='20px' justifyContent='center'>
                        <Grid item  xs={12} sm={12} md={5.8} lg={2.9} >
                            <p className="font-medium text-2xl text-white mb-2 border-b-1">Information Oficer</p>
                            {officeInfo ? (
                                <>
                                    <img
                                        className='w-[70%] h-32 object-cover'
                                        src={officeInfo.ppImage ? `${IMAGE_URL}${officeInfo.ppImage}` : defaultImage}
                                        onError={(e) => { e.target.src = defaultImage; }}
                                        alt=""
                                    />
                                    <div className=" mt-2 text-white gap-y-[2px] text-sm flex flex-col">
                                        <p className='text-sm font-medium'>{ officeInfo.firstName ? `${officeInfo.firstName} ${officeInfo.middleName} ${officeInfo.lastName}`: 'No data uploaded'}</p>
                                        <div className='flex text-white'>
                                            <IoMdCall className='text-lg mt-[2px] mr-1' /> <span className='text-sm'>{officeInfo.phoneNo}</span>
                                        </div>
                                    </div>
                                </>

                            ) : (
                                <p className="text-white">No data uploaded</p>
                            )}
                        </Grid>
                       
                        <Grid item xs={12} sm={12} md={5.8} lg={2.9}>
                            <p className="font-medium text-2xl text-white mb-2"> Similar Links</p>
                            <ul className="space-y-4 text-sm ">
                                {
                                    links.sort((a, b) => b.id > a.id).slice(0, 5).map((item, index) => (
                                        <li key={index}>
                                            <Link to={item.url} className="text-white transition hover:opacity-75" target='_blank' > {item.name} </Link>
                                        </li>

                                    ))
                                }
                            </ul>
                        </Grid>
                       
                        <Grid item  xs={12} sm={12} md={5.8} lg={2.9}>
                            <p className="font-medium text-white text-2xl mb-2" >Contact Us</p>
                            <div className='flex flex-col  space-y-4'>
                                <div className='flex  text-white'>
                                    <IoMdMail className='text-lg mt-[2px] mr-1' /> <span className='text-sm'>{email}</span>
                                </div>
                                <div className='flex text-white'>
                                    <IoMdCall className='text-lg mt-[2px] mr-1' /> <span className='text-sm'>{phone}</span>
                                </div>
                                <div >
                                    <ul className="mb-4 -ml-2 flex md:order-1 md:mb-0">
                                        <li>
                                            <a
                                                className="text-muted inline-flex items-center rounded-lg  text-white hover:text-black p-2.5 text-sm hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200  "
                                                aria-label="Youtube"
                                                href={ytLink?.url}
                                            >
                                                <CiYoutube height='24' width='24' viewBox="0 0 24 24" className="h-5 w-5 hover:text-red-900" />
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="text-muted inline-flex items-center  text-white hover:text-black rounded-lg p-2.5 text-sm hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
                                                aria-label="Facebook"
                                                href={fbLink?.url}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-5 w-5 hover:text-blue-800"
                                                >
                                                    <path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                className="text-muted inline-flex items-center rounded-lg p-2.5 text-sm text-white hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200  "
                                                aria-label="Twitter"
                                                href={xLink?.url}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-5 w-5"
                                                >
                                                    <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" />
                                                </svg>
                                            </a>
                                        </li>
                                    
                                    </ul>
                                </div>

                            </div>
                        </Grid>
                       
                        <Grid item  xs={12} sm={12} md={5.8} lg={2.9}  >
                            <p className="font-medium text-white text-2xl mb-2" >Find Us</p>
                            <Grid className="w-full h-[180px] bg-gray-300 rounded-lg overflow-hidden sm:mr-10  flex items-end justify-start relative">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    className="absolute inset-0 "
                                    title="map"
                                    src={map_iframe}
                                ></iframe>

                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </footer>
            <Grid item lg={12} className='bg-gray-700 px-[2rem] py-2'>
                <p className="text-sm text-white"> Developed and managed by &copy;debugsoft</p>
            </Grid>
        </>
    )
}

export default Footer