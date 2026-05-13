import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { LuMenu } from 'react-icons/lu'
import PersonIcon from '@mui/icons-material/Person'
import { Divider } from '@mui/material'
import { useAuth } from '../context/AuthContextProvider'
import { toast } from 'react-toastify'

const logoURL = import.meta.env.VITE_LOGO_URL;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;
const collegeNameNepali = import.meta.env.VITE_COLLEGE_NAME_NEPALI;
const address = import.meta.env.VITE_ADDRESS;
const addressNepali = import.meta.env.VITE_ADDRESS_NEPALI;
const affiliationNepali = import.meta.env.VITE_AFFILIATION_NEPALI;
const affiliationEn = import.meta.env.VITE_AFFILIATION_EN;
const textColor = import.meta.env.VITE_NAV_TEXT;
const bgColor = import.meta.env.VITE_NAV_BG;

function QAANavbar() {
    const navigate = useNavigate()
    const location = useLocation()
    const { email } = useAuth()
    const currentPath = location.pathname + location.search
    const [isOpen, setIsOpen] = useState(false)
    const [mobileAcademicOpen, setMobileAcademicOpen] = useState(false)

    const activeStyle = "text-[#f58d4c] font-medium"
    const inactiveStyle = "text-white hover:text-[#f36710] transition-colors duration-300 transform"

    const isActive = (path) => location.pathname === path
    const isTabActive = (tab) => location.pathname === `/qaa/${tab}`
    const isAnyActive = (tabs) => tabs.some(tab => location.pathname === `/qaa/${tab}`)

    const handleLogout = () => {
        sessionStorage.clear()
        toast.success('Successfully logged out', { autoClose: 300 })
        setTimeout(() => {
            navigate('/signIn')
            window.location.reload()
        }, 1000)
    }

    return (
        <nav className="relative bg-white shadow">
            <div className="pb-0 mx-auto">
                {/* Branding Section */}
                <div className={`px-4 lg:px-20 bg-[${bgColor}] py-4 md:py-1 h-full items-center mx-auto flex flex-col sm:flex-column md:flex-row justify-between w-full`}>
                    <Link className="flex items-center" to="/qaa/qaa">
                        <img className="w-[120px] h-auto" src={logoURL} alt="Logo" />
                    </Link>
                    <div className={`ml-2 mt-4 text-[${textColor}] md:mt-1 lg:ml-4 flex flex-col justify-center`}>
                        <h1 className={`text-xs text-center lg:text-xs text-[${textColor}] font-medium tracking-wide`}>{affiliationNepali}</h1>
                        <p className={`text-xs text-${textColor} text-center lg:text-xs`}>{affiliationEn}</p>
                        <h1 className={`text-md lg:text-xl font-bold text-[${textColor}] text-center`}>{collegeNameNepali}</h1>
                        <h1 className={`text-xs lg:text-lg font-bold text-[${textColor}] uppercase text-center`}>{collegeName}</h1>
                        <h1 className={`text-xs font-medium text-[${textColor}] uppercase text-center`}>{addressNepali}</h1>
                        <h1 className={`text-xs font-medium text-[${textColor}] text-center`}>{address}</h1>
                    </div>
                    <div className='hidden lg:block'>
                        <img src="https://media.tenor.com/MCKjaHTU0kwAAAAj/nepal.gif" className='w-32 h-32' alt="Flag" />
                    </div>
                </div>

                {/* Main Navigation Bar */}
                <div style={{ backgroundColor: '#1169bf' }} className="flex justify-between px-4 lg:px-20 py-3 md:flex-row md:items-start md:justify-start">
                    {/* Desktop Menu */}
                    <div className="hidden md:flex w-full items-center">
                        <Link
                            className={`mx-4 leading-5 ${isTabActive('qaa') ? activeStyle : inactiveStyle}`}
                            to="/qaa/qaa"
                        >
                            QAA
                        </Link>

                        {/* Academics Dropdown */}
                        <Menu as="div" className="relative inline-block text-left">
                            <MenuButton
                                className={`mx-4 flex leading-3 items-center ${isAnyActive(['faculties', 'programs']) ? activeStyle : inactiveStyle}`}
                            >
                                Academics
                                <ChevronDownIcon className={`-mr-1 h-5 w-5 ${isAnyActive(['faculties', 'programs']) ? 'text-[#f36710]' : 'text-white'}`} />
                            </MenuButton>
                            <MenuItems
                                style={{ backgroundColor: '#1169bf' }}
                                className="absolute left-0 z-10 mt-2 w-max origin-top-left rounded-md bg-white shadow-lg transition focus:outline-none"
                            >
                                <div className="py-1">
                                    <MenuItem>
                                        <Link
                                            to="/qaa/faculties"
                                            className={`block px-4 py-2 text-sm ${isTabActive('faculties') ? 'text-[#f58d4c]' : 'text-white hover:bg-blue-900'}`}
                                        >
                                            Faculties
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link
                                            to="/qaa/programs"
                                            className={`block px-4 py-2 text-sm ${isTabActive('programs') ? 'text-[#f58d4c]' : 'text-white hover:bg-blue-900'}`}
                                        >
                                            Programs
                                        </Link>
                                    </MenuItem>
                                </div>
                            </MenuItems>
                        </Menu>

                        <Link
                            className={`mx-4 leading-5 ${isTabActive('publications') ? activeStyle : inactiveStyle}`}
                            to="/qaa/publications"
                        >
                            Contents
                        </Link>

                        <Link
                            className={`mx-4 leading-5 ${isTabActive('team') ? activeStyle : inactiveStyle}`}
                            to="/qaa/team"
                        >
                            Team
                        </Link>

                        <div className="hidden lg:flex ml-auto">
                            <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="mx-4 flex items-center leading-5 text-white hover:text-[#f36710] transition-colors duration-300 transform">
                                    Profile
                                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-white" />
                                </MenuButton>
                                <MenuItems className="absolute right-0 z-10 mt-3 w-48 origin-top-right rounded-md bg-white shadow-lg overflow-hidden">
                                    <div className="py-1 bg-gray-300">
                                        <div className="px-4 pt-2 text-sm text-gray-700">Signed in as</div>
                                        <div className="px-4 pb-2 text-xs text-gray-500 truncate">{email}</div>
                                        <Divider />
                                        <MenuItem>
                                            <Link to="/qaa/password-settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Password Change
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                Logout
                                            </button>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>
                    </div>

                    {/* Mobile Toggle Button */}
                    <div className="md:hidden relative right-[5px] text-left">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="text-white focus:outline-none"
                            aria-label="toggle menu"
                        >
                            {!isOpen ? (
                                <LuMenu className="w-6 h-6" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Container */}
                <div
                    className={`${isOpen ? 'relative' : 'absolute'} bg-[#1169bf] inset-x-0 z-20 w-full px-3 pt-0 pb-4 transition-all duration-200 ease-in-out md:hidden ${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full hidden'}`}
                >
                    <div className="flex flex-col">
                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isTabActive('qaa') ? activeStyle : inactiveStyle}`} to="/qaa/qaa">QAA</Link>
                        
                        <div className="divide-y divide-gray-100">
                            <details className="group" open={mobileAcademicOpen || isAnyActive(['faculties', 'programs'])} onToggle={(e) => setMobileAcademicOpen(e.target.open)}>
                                <summary className={`flex my-1 leading-2 transition-colors duration-300 transform cursor-pointer text-md ${isAnyActive(['faculties', 'programs']) ? activeStyle : inactiveStyle}`} style={{ listStyle: 'none' }}>
                                    Academics
                                    <div className="flex items-center">
                                        {(mobileAcademicOpen || isAnyActive(['faculties', 'programs'])) ? <ChevronUpIcon className={`h-5 w-5 ${isAnyActive(['faculties', 'programs']) ? 'text-[#f36710]' : 'text-white'}`}/> : <ChevronDownIcon className={`h-5 w-5 ${isAnyActive(['faculties', 'programs']) ? 'text-[#f36710]' : 'text-white'}`}/>}
                                    </div>
                                </summary>
                                <div className='flex flex-col space-y-1'>
                                    <Link to="/qaa/faculties" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isTabActive('faculties') ? activeStyle : inactiveStyle}`}>Faculties</Link>
                                    <Link to="/qaa/programs" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isTabActive('programs') ? activeStyle : inactiveStyle}`}>Programs</Link>
                                </div>
                            </details>
                        </div>

                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isTabActive('publications') ? activeStyle : inactiveStyle}`} to="/qaa/publications">Contents</Link>
                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isTabActive('team') ? activeStyle : inactiveStyle}`} to="/qaa/team">Team</Link>
                        
                        <div className="mt-4 pt-4 border-t border-blue-800">
                            <Link to="/qaa/password-settings" className={`block my-2 leading-2 transition-colors duration-300 transform text-md ${isActive('/qaa/password-settings') ? activeStyle : inactiveStyle}`}>Password Change</Link>
                            <button onClick={handleLogout} className="mt-2 flex items-center w-max border-[1px] border-[#f36710] py-1 pl-1 pr-2 rounded-md text-sm leading-5 hover:text-[#f36710] transition-colors duration-300 transform text-white">
                                <PersonIcon sx={{ marginTop: '-3px', fontSize: '18px', marginRight: '4px' }} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default QAANavbar
