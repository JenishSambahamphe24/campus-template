import { Grid, } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaYoutube } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoMdCall } from "react-icons/io";
import { getAllTeams } from '../Screens/cmsScreen/cms-components/cms-team/teamApi';
import { getAllLink } from '../Screens/cmsScreen/cms-components/cms-links/linkApi';
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { FaFacebook } from "react-icons/fa6";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const map_iframe = import.meta.env.VITE_MAP_IFRAME
const collegeName = import.meta.env.VITE_COLLEGE_NAME;
const defaultImage = import.meta.env.VITE_LOGO_URL
const email = import.meta.env.VITE_EMAIL
const phone = import.meta.env.VITE_PHONE

function Footer() {
    const [officeInfo, setOfficerInfo] = useState({})
    const [otherLinks, setLinks] = useState([])

    const [fbLink, setFbLink] = useState({})
    const [ytLink, setYTLink] = useState({})

    const fetchInfoOfficer = async () => {
        const response = await getAllTeams()
        if(response){
            setOfficerInfo(response.find(item => item.subCategory === 'Information Officer'))
        }else{
            setOfficerInfo({})
        }
    }

    const fetchLinks = async () => {
        const response = await getAllLink()
        if(response){
            const otherLinks = response.filter((item) => item.type === 'otherLink')
            setLinks(otherLinks)
            setFbLink(response.find(item => item.name === 'facebook'))
            setYTLink(response.find(item => item.name === 'youtube'))
        } else {
            setLinks([])
            setFbLink({})
            setYTLink({})
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        fetchInfoOfficer()
        fetchLinks()
    }, []);

    return (
        <>
            <footer className='bg-[#1169bf] px-[2rem]  py-8'>
                <div className="mx-auto w-full">
                    <Grid container columnGap='10px' rowGap='20px' justifyContent='center'>
                        <Grid item xs={12} sm={12} md={5.8} lg={2.9} >
                            <p className="font-medium text-2xl text-white mb-2 border-b-1">Information Officer</p>
                            {officeInfo ? (
                                <>
                                    <img
                                        className='w-[70%] h-32 object-cover'
                                        src={officeInfo.ppImage ? `${IMAGE_URL}/team/${officeInfo.ppImage}` : defaultImage}
                                        alt=""
                                    />
                                    <div className=" mt-2 text-white gap-y-[2px] text-sm flex flex-col">
                                        <p className='text-sm font-medium'>{officeInfo.firstName ? `${officeInfo.firstName} ${officeInfo.middleName} ${officeInfo.lastName}` : 'No data uploaded'}</p>
                                        <div className='flex text-white'>
                                            <MdOutlineMarkEmailRead className='text-lg mt-[2px] mr-1' /> <span className='text-sm'>{officeInfo.email}</span>
                                        </div>
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
                            <p className="font-medium text-2xl text-white mb-2"> Related Links</p>
                            <ul className="space-y-4 text-sm ">
                                {
                                    otherLinks.sort((a, b) => b.id > a.id).slice(0, 5).map((item, index) => (
                                        <li key={index}>
                                            <a href={item.url} className="text-white transition hover:opacity-75" target='_blank' rel="noreferrer"> {item.name} </a>
                                        </li>

                                    ))
                                }
                            </ul>
                        </Grid>

                        <Grid item xs={12} sm={12} md={5.8} lg={2.9}>
                            <p className="font-medium text-white text-2xl mb-2" >Contact Us</p>
                            <div className='flex flex-col  space-y-4'>
                                <div className='flex  text-white'>
                                    <IoMdMail className='text-lg mt-[2px] mr-1' /> <span className='text-sm'>{email}</span>
                                </div>
                                <div className='flex text-white'>
                                    <IoMdCall className='text-lg mt-[2px] mr-1' /> <span className='text-sm'>{phone}</span>
                                </div>
                                <div className='flex space-x-4 '>
                                    <Link target='_blank' to={ytLink?.url}>
                                        <FaYoutube className="h-10 w-10  text-red-600 " />
                                    </Link>
                                    <Link target='_blank' to={fbLink?.url}>
                                        <FaFacebook className="h-9 w-9  text-white " />
                                    </Link>
                                </div>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={12} md={5.8} lg={2.9}  >
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
            <Grid item lg={12} justifyContent='space-between' className='flex bg-gray-700 px-[2rem] py-2'>
                <p className="text-sm text-white lowe"> Copyright&copy;2025-{new Date().getFullYear()}, <span className='text-[13px]'>{collegeName}</span>, ALL RIGHTS RESERVED.</p>
                <p className="text-sm text-white"> Developed & Managed By @<Link to='https://dibugsoft.com/' target='_blank' className='text-[#f26710]'>Debugsoft</Link></p>
            </Grid>
        </>
    )
}

export default Footer