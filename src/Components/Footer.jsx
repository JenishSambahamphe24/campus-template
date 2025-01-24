import { Typography, Grid, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsFacebook } from "react-icons/bs";
import { BsTwitterX } from "react-icons/bs";
import { BsYoutube } from 'react-icons/bs';
import { useAuth } from '../context/AuthContextProvider';

function Footer() {
    const [isLogged, setIsLoggedIn] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true)
        }
    }, []);
    const { activeAboutusId } = useAuth();
    return (
        <>
            <footer className='bg-[#0368b0] px-[2rem] py-8'>
                <div className="mx-auto max-w-screen-xl space-y-4 lg:space-y-4  ">
                    <Grid container >
                        <Grid item md={12} lg={8.5}>
                            <Stack direction='column' >


                                {
                                    isLogged && (
                                        <Grid container  >
                                            <Grid item md={4}>
                                                <p className="font-medium text-2xl text-white">Menu</p>
                                                <ul className="mt-2 space-y-1 text-sm">
                                                    <li>
                                                        <Link to='/' className="text-white transition hover:opacity-75 "> Home </Link>
                                                    </li>
                                                    <li>
                                                        <Link to='/publication' className="text-white transition hover:opacity-75"> publication </Link>
                                                    </li>

                                                    <li>
                                                        <Link to='/news' className="text-white transition hover:opacity-75"> News & events </Link>
                                                    </li>
                                                    <li>
                                                        <Link to='/gallery' className="text-white transition hover:opacity-75"> Gallery </Link>
                                                    </li>
                                                </ul>
                                            </Grid>

                                            <Grid item md={4}>
                                                <p className="font-medium text-2xl text-white "> About Us</p>
                                                <ul className="mt-2 space-y-1 text-sm">
                                                    <li>
                                                        <Link to={`/about/${activeAboutusId}`} className="text-white transition hover:opacity-75" > About </Link>
                                                    </li>
                                                    <li>
                                                        <Link to='team' className="text-white  transition hover:opacity-75"> Meet the Team </Link>
                                                    </li>
                                                </ul>
                                            </Grid>

                                            <Grid item md={4}>
                                                <p className="font-medium text-white text-2xl" >Quick links</p>
                                                <ul className="mt-2 space-y-1 text-sm">
                                                    <li>
                                                        <Link to='/contact' className="text-white ransition hover:opacity-75"> Contact Us</Link>
                                                    </li>
                                                    <li>
                                                        <Link to='faq' className="text-white ransition hover:opacity-75"> FAQs </Link>
                                                    </li>
                                                </ul>
                                            </Grid>
                                            <div className='flex'>
                                                <div className=' mt-3'>

                                                    <ul className="mt-2 flex gap-3 ">
                                                        <Stack mt='5px' direction='row' spacing='10px'>
                                                            <Link
                                                                to="https://www.facebook.com/www.aepc.gov.np/"
                                                                target="_blank"
                                                            >
                                                                <BsFacebook color='white' style={{ fontSize: '18px' }} />
                                                            </Link>
                                                            <Link to='https://x.com/i/flow/login?redirect_after_login=%2FRerlNepal' target="_blank">
                                                                <BsTwitterX color='white' style={{ fontSize: '18px' }} />
                                                            </Link>
                                                            <Link to='https://www.youtube.com/@RERL-ec5wi' target="_blank">
                                                                <BsYoutube color='white' style={{ fontSize: '20px' }} />
                                                            </Link>
                                                        </Stack>
                                                    </ul>
                                                </div>
                                            </div>
                                        </Grid>
                                    )
                                }
                            </Stack>
                        </Grid>

                        <Grid item md={12} lg={3.5} className=" h-[210px] bg-gray-300 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
                            <iframe
                                width="100%"
                                height="100%"
                                className="absolute inset-0 "
                                frameBorder="0"
                                title="map"
                                marginHeight="0"
                                marginWidth="0"
                                scrolling="no"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3518.783681196535!2d81.57242149999999!3d28.1226218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399861dfde7ef4db%3A0xb74a0fe71e10f79d!2sGyanodaya%20Multiple%20Public%20Campus!5e0!3m2!1sen!2snp!4v1737265903384!5m2!1sen!2snp"
                            ></iframe>
                        </Grid>
                    </Grid>
                </div>
            </footer>
            <Grid item lg={12} className='bg-gray-700 px-20 py-2'>
                <p className="text-xs text-white"> Developed and managed by &copy;debugsoft pvt. ltd.</p>
            </Grid>
        </>
    )
}

export default Footer