import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContextProvider';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
    const { activeAboutusId } = useAuth()

    return (
        <nav className="relative bg-white shadow ">
            <div className=" py-1 pb-0 mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="px-20 h-full items-center mx-auto flex justify-between w-full">
                        <Link className="flex items-center" to="/">
                            <img
                                className="w-[80px] h-auto"
                                src="https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Tribhuvan_University_logo.svg/800px-Tribhuvan_University_logo.svg.png"
                                alt="Logo"
                            />
                            <div className="ml-4 flex flex-col justify-center">
                                <h1 className="text-2xl tracking-tight">Gyanodaya Multiple Public Campus</h1>
                                <p className="text-lg">Banke, Khajura</p>
                            </div>
                        </Link>
                    </div>
                </div>
                {/* main navigation */}
                <div style={{ backgroundColor: '#0368B0' }} className="flex  justify-between px-20 py-3 mt-2 overflow-y-auto whitespace-nowrap scroll-hidden md:flex-row md:items-start md:justify-start">
                    <div className="hidden md:flex w-full">
                        <div className="flex">
                            <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white " to="/">Home</Link>
                            <Menu as="div" className="inline-block text-left">
                                <MenuButton className="mx-4 flex leading-2 text-sm text-white">
                                    About us
                                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                </MenuButton>
                                <MenuItems
                                    style={{ backgroundColor: '#0368b0' }}
                                    transition
                                    className="absolute left-45% z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link to={`/about/${activeAboutusId}`} className="block px-4 py-2 text-sm text-white">Introduction</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/team" className="block px-4 py-2 text-sm text-white">Our Team</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/faq" className="block px-4 py-2 text-sm text-white">FAQ</Link>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                            <Menu as="div" className="inline-block text-left">
                                <MenuButton className="mx-4 flex leading-2 text-sm text-white">
                                    Publication
                                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                </MenuButton>
                                <MenuItems style={{ backgroundColor: '#0368b0' }} className="absolute left-45% z-10 mt-2 w-48">
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link to="/report" className="block px-4 py-2 text-sm text-white">Reports & Notices</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/publication" className="block px-4 py-2 text-sm text-white">Our publication</Link>
                                        </MenuItem>

                                    </div>
                                </MenuItems>
                            </Menu>

                            <Link to="/news" className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" >News and Events</Link>

                            <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/program-list">Programs</Link>
                            <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/gallery">Gallery</Link>
                            <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/contact">Contact Us</Link>
                        </div>
                        {/* Admin login link on the far right */}
                        <div className="ml-auto">
                            <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/signIn" >
                                <PersonIcon sx={{ marginTop: '-3px', fontSize: '18px', marginRight: '5px' }} />
                                Admin login
                            </Link>
                        </div>
                    </div>
                    <div className="md:hidden pl-6 text-left"  >
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="text-white focus:outline-none "
                            aria-label="toggle menu"
                        >
                            {!isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    style={{ backgroundColor: '#0368b0' }}
                    className={`${isOpen ? 'relative' : 'absolute'} inset-x-0 z-20 w-full px-6 pt-0 pb-4 transition-all duration-200 ease-in-out  top-54  md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${isOpen ? 'translate-x-0 opacity-100 ' : 'opacity-0 -translate-x-full'
                        }`}
                >
                    <div className="flex flex-col md:hidden">
                        <Link className="my-1 text-sm leading-5 text-white transition-colors duration-300 transform  hover:text-blue-600 dark:hover:text-blue-400 " to="#">Home</Link>
                        <div className="divide-y divide-gray-100">
                            <details className="group" open={mobileAboutOpen} onToggle={(e) => setMobileAboutOpen(e.target.open)}>
                                <summary className='flex my-1 text-sm leading-5 text-white transition-colors duration-300 transform text-white hover:cursor-pointer' style={{ listStyle: 'none' }}>
                                    About
                                    <div className="flex items-center">
                                        {mobileAboutOpen ? (
                                            <ChevronUpIcon aria-hidden="true" className="h-5 w-5 text-white" />
                                        ) : (
                                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-white" />
                                        )}
                                    </div>
                                </summary>
                                <Link className="block   py-1 text-sm text-gray-200 transition-colors duration-300 transform  hover:text-blue-400">Introduction</Link>
                                <Link className="block text-gray-200  text-sm text-white transition-colors duration-300 transform  hover:text-blue-400">Our Team</Link>

                            </details>
                        </div>
                        <Link className="my-1 text-sm leading-5 text-white transition-colors duration-300 transform  hover:text-blue-600 dark:hover:text-blue-400 " to="#">Contact Us</Link>
                        <Link className="my-1 text-sm leading-5 text-white transition-colors duration-300 transform  hover:text-blue-600 dark:hover:text-blue-400 " to="#">Publications</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar