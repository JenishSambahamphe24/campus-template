import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Divider, Typography } from '@mui/material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, } from '@heroicons/react/20/solid'
import { useAuth } from '../../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const address = import.meta.env.VITE_ADDRESS;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;

function AdminNavbar() {
    const navigate = useNavigate()
    const { email } = useAuth();

    const handleLogout = () => {
        localStorage.clear()
        toast.success('succesfully logged out', { autoClose: 300 })
        setTimeout(() => {
            navigate('/signIn')
        }, 1000);
    }
    return (
        <div>
            <nav className="relative bg-white shadow ">
                <div className="py-1 pb-0 mx-auto">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="px-20 h-full items-center mx-auto flex justify-between w-full">
                        <Link className="flex items-center" to="/">
                            <img
                                className="w-[80px] h-auto"
                                src="https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Tribhuvan_University_logo.svg/800px-Tribhuvan_University_logo.svg.png"
                                alt="Logo"
                            />
                            <div className="ml-4 flex flex-col justify-center">
                                <h1 className="text-2xl tracking-tight">{collegeName}</h1>
                                <p className="text-lg">{address}</p>
                            </div>
                        </Link>
                    </div>
                </div>
                    </div>
                    {/* main navigation */}
                    <div style={{ backgroundColor: '#0368B0' }} className="flex justify-between px-20 p-3  mt-3 overflow-y-auto whitespace-nowrap scroll-hidden md:flex-row md:items-start">
                        <div className="flex ">
                            <div className='flex'>
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/admin">Home</Link>

                                <Menu as="div" className="inline-block text-left z-10">
                                    <MenuButton className="mx-4 flex leading-2 text-sm text-white">
                                        Academics
                                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                    </MenuButton>
                                    <MenuItems
                                        style={{ backgroundColor: '#0368b0' }}
                                        transition
                                        className="absolute left-45% z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none"
                                    >
                                        <div className="py-1">
                                            <MenuItem>
                                                <Link
                                                    to="faculties"
                                                    className="block px-4 py-2 text-sm text-white hover:text-gray-900"
                                                >
                                                    Faculties
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    to="programs"
                                                    className="block px-4 py-2 text-sm text-white hover:text-gray-900"
                                                >
                                                    Programs
                                                </Link>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Menu>
                                <Menu as="div" className="inline-block text-left z-10">
                                    <MenuButton className="mx-4 flex leading-2 text-sm text-white">
                                        Publications
                                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                    </MenuButton>
                                    <MenuItems
                                        style={{ backgroundColor: '#0368b0' }}
                                        transition
                                        className="absolute left-45% z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none"
                                    >
                                        <div className="py-1">
                                            <MenuItem>
                                                <Link
                                                    to="publications"
                                                    className="block px-4 py-2 text-sm text-white hover:text-gray-900"
                                                >
                                                    Publication management
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    to="publicationCategories"
                                                    className="block px-4 py-2 text-sm text-white hover:text-gray-900"
                                                >
                                                    Publication categories
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    to="aboutUs"
                                                    className="block px-4 py-2 text-sm text-white hover:text-gray-900"
                                                >
                                                    Institutional Info
                                                </Link>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Menu>
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="viewGallery">Gallery</Link>
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="viewTeam">Team</Link>
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="feedback">Feedbacks</Link>
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="faq">FAQs</Link>
                                {/* <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="testimonials">Testimonials</Link> */}
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="links">External Links</Link>
                            </div>
                        </div>

                        <div className="flex ">
                            <Menu as="div" className="inline-block text-left ">
                                <MenuButton
                                    className="mx-4 flex leading-2 text-sm text-white">
                                    Profile
                                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                </MenuButton>
                                <MenuItems className="absolute bg-gray-300 rounded-md  rounded-t-none right-[0px] bottom-[-46%] text-black z-10 mt-2 w-44 overflow-hidden">
                                    <MenuItem>
                                        <h1 className="text-sm px-4 pt-2">
                                            Signed in as
                                        </h1>
                                    </MenuItem>
                                    <MenuItem>
                                        <h2 className="px-4 font-bold text-sm">
                                            {email}
                                        </h2>
                                    </MenuItem>
                                    <Divider />

                                    <MenuItem>
                                        <Link type='Button' onClick={handleLogout} className="hover:bg-[#0368b0] block px-4 py-2 text-sm">
                                            Logout
                                        </Link>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>

                </div>
            </nav>
        </div>
    )
}

export default AdminNavbar