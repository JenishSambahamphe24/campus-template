import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { LuMenu } from 'react-icons/lu';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import PersonIcon from '@mui/icons-material/Person';
import { getAllGallery } from '../Screens/cmsScreen/cms-components/cms-gallery/galleryApii';
const address = import.meta.env.VITE_ADDRESS;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;
const addressNepali = import.meta.env.VITE_ADDRESS_NEPALI;
const collegeNameNepali = import.meta.env.VITE_COLLEGE_NAME_NEPALI;
const logoURL = import.meta.env.VITE_LOGO_URL

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false)
    const [mobilePubOpen, setMobilePubOpen] = useState(false)

    const [logo, setLogo] = useState('')
    const fetchLogo = async () => {
        const response = await getAllGallery()
        setLogo(response.find(item => item.galleryType === 'Logo').thumbnailImage)
    } 
    
    useEffect(() => {
     fetchLogo()
    }, [])
    

    return (
        <nav className="relative bg-white shadow ">
            <div className="bg-[#024282] pb-0 mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="px-4 lg:px-20 bg-[#024282] py-4  md:py-0  h-full items-center mx-auto flex flex-col sm:flex-column md:flex-row justify-between w-full">
                        <Link className="flex items-center" to="/">
                            <img
                                className="w-[120px] h-auto"
                                src={logoURL}
                                alt="Logo"
                            />
                        </Link>
                        <div className="ml-2 mt-4  md:mt-1 lg:ml-4 flex flex-col justify-center">
                            <h1 className="text-xs text-center lg:text-sm text-white  font-bold tracking-wide"> त्रिभुवन विश्वविद्यालयबाट सम्बन्धन प्राप्त </h1>
                            <p className="text-xs text-white text-center lg:text-xs"> Affiliated to Tribhuwan University </p>
                            <h1 className='text-md lg:text-xl font-bold text-white text-center mt-1'>{collegeNameNepali}</h1>
                            <h1 className='text-xs lg:text-lg font-bold text-white uppercase text-center'>{collegeName}</h1>
                            <h1 className='text-sm font-bold text-white uppercase text-center'>{addressNepali}</h1>
                            <h1 className='text-xs font-bold text-white  text-center'>{address}</h1>
                        </div>
                        <div className='hidden lg:block'>
                            <img src="https://media.tenor.com/MCKjaHTU0kwAAAAj/nepal.gif" className='w-32 h-32' alt="" />
                        </div>
                    </div>
                </div>
                {/* main navigation */}
                <div style={{ backgroundColor: '#1169bf' }} className="flex justify-between px-20 py-3 mt-[2px] overflow-y-auto whitespace-nowrap scroll-hidden md:flex-row md:items-start md:justify-start">
                    <div className="hidden md:flex w-full">
                        <div className="flex">
                            <Link className="mx-4 font-bold text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white " to="/">Home</Link>
                            <Menu as="div" className="inline-block text-left">
                                <MenuButton className="mx-4 flex font-bold leading-2 text-sm text-white">
                                    About us
                                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                </MenuButton>
                                <MenuItems
                                    style={{ backgroundColor: '#1169bf' }}
                                    transition
                                    className="absolute left-45% z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link to="/introduction" className="block px-4 py-1 text-sm text-white ">Introduction</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/team" className="block px-4 py-1 text-sm text-white">Our Team</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/faq" className="block px-4 py-1 text-sm text-white">FAQ</Link>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                            <Menu as="div" className="inline-block text-left">
                                <MenuButton className="mx-4 font-bold flex leading-2 text-sm text-white">
                                    Contents
                                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                </MenuButton>
                                <MenuItems style={{ backgroundColor: '#1169bf' }} className="absolute left-45% z-10 mt-2 w-48">
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link to="/publication" className="block px-4 py-1 text-sm text-white">Publication</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/report" className="block px-4 py-1 text-sm text-white">Reports</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/notices" className="block px-4 py-1 text-sm text-white">Notices</Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link to="/curriculum" className="block px-4 py-1 text-sm text-white">Curriculum</Link>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                            <Link className="mx-4 text-sm font-bold leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/program-list">Programs</Link>
                            <Link className="mx-4 text-sm font-bold leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/downloads">Downloads</Link>
                            <Link to="/news" className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white font-bold" >News and Events</Link>
                            <Link className="mx-4 text-sm leading-5 font-bold hover:text-gray-900 transition-colors duration-300 transform text-white" to="/gallery">Gallery</Link>
                            <Link className="mx-4 text-sm leading-5 font-bold hover:text-gray-900 transition-colors duration-300 transform text-white" to="/contact">Contact Us</Link>
                        </div>

                        <div className="hidden lg:flex ml-auto">
                            <Link target='_blank' className="font-bold mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/signIn" >
                                <PersonIcon sx={{ marginTop: '-3px', fontSize: '18px', marginRight: '5px' }} />
                                Login
                            </Link>
                        </div>
                    </div>

                    <div className="md:hidden relative right-[70px]  text-left"  >
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="text-white focus:outline-none "
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

                {/* Mobile Menu */}
                <div
                    className={`${isOpen ? 'relative' : 'absolute'} bg-[#1169bf] inset-x-0 z-20 w-full px-3 pt-0 pb-4 transition-all duration-200 ease-in-out  top-54  md:mt-0 md:p-0 md:top-0 md:relative md:bg-transparent md:w-auto md:opacity-100 md:translate-x-0 md:flex md:items-center ${isOpen ? 'translate-x-0 opacity-100 ' : 'opacity-0 -translate-x-full'
                        }`}
                >
                    <div className="flex  mt-[-14px] flex-col md:hidden">
                        <Link className="my-1 leading-2  text-white transition-colors duration-300 transform  hover:text-[#f36710] text-md" to="/">Home</Link>

                        <div className="divide-y divide-gray-100">
                            <details className="group" open={mobileAboutOpen} onToggle={(e) => setMobileAboutOpen(e.target.open)}>
                                <summary className='flex my-1 leading-2  text-white transition-colors duration-300 transform cursor-pointer hover:text-[#f36710] text-md' style={{ listStyle: 'none' }}>
                                    About
                                    <div className="flex items-center">
                                        {mobileAboutOpen ? (
                                            <ChevronUpIcon aria-hidden="true" className="h-5 w-5 text-white" />
                                        ) : (
                                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-white" />
                                        )}
                                    </div>
                                </summary>
                                <div className='flex flex-col space-y-1'>
                                    <Link
                                        className="relative  ml-2 leading-2 text-white transition-colors duration-300 transform  text-sm hover:text-[#f36710] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5"
                                        to="/introduction"
                                    >
                                        Introduction
                                    </Link>
                                    <Link
                                        className="relative  ml-2 leading-2 text-white transition-colors duration-300 transform  text-sm hover:text-[#f36710] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5"
                                        to="/team"
                                    >
                                        Our Team
                                    </Link>
                                    <Link
                                        className="relative  ml-2 leading-2 text-white transition-colors duration-300 transform  text-sm hover:text-[#f36710] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5"
                                        to="/faq"
                                    >
                                        Faq
                                    </Link>
                                </div>
                            </details>
                        </div>

                        <div className="divide-y divide-gray-100">
                            <details className="group" open={mobilePubOpen} onToggle={(e) => setMobilePubOpen(e.target.open)}>
                                <summary className='flex my-1 leading-2  text-white transition-colors duration-300 transform cursor-pointer hover:text-[#f36710] text-md' style={{ listStyle: 'none' }}>
                                    Publications
                                    <div className="flex items-center">
                                        {mobilePubOpen ? (
                                            <ChevronUpIcon aria-hidden="true" className="h-5 w-5 text-white" />
                                        ) : (
                                            <ChevronDownIcon aria-hidden="true" className="h-5 w-5 text-white" />
                                        )}
                                    </div>
                                </summary>
                                <div className='flex flex-col space-y-1'>
                                    <Link
                                        className="relative  ml-2 leading-2 text-white transition-colors duration-300 transform  text-sm hover:text-[#f36710] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5"
                                        to="/publication"
                                    >
                                        Publication
                                    </Link>
                                    <Link
                                        className="relative  ml-2 leading-2 text-white transition-colors duration-300 transform  text-sm hover:text-[#f36710] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5"
                                        to="/report"
                                    >
                                        Reports
                                    </Link>
                                    <Link
                                        className="relative  ml-2 leading-2 text-white transition-colors duration-300 transform  text-sm hover:text-[#f36710] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5"
                                        to="/notices"
                                    >
                                        Notices
                                    </Link>
                                    <Link
                                        className="relative  ml-2 leading-2 text-white transition-colors duration-300 transform  text-sm hover:text-[#f36710] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5"
                                        to="/curriculum"
                                    >
                                        Curriculum
                                    </Link>

                                </div>
                            </details>
                        </div>
                        <Link className="my-1 leading-2  text-white transition-colors duration-300 transform cursor-pointer hover:text-[#f36710] text-md" to="/program-list">Programs</Link>
                        <Link className="my-1 leading-2  text-white transition-colors duration-300 transform cursor-pointer hover:text-[#f36710] text-md" to="/downloads">Downloads</Link>
                        <Link className="my-1 leading-2  text-white transition-colors duration-300 transform cursor-pointer hover:text-[#f36710] text-md" to="/news">News & events</Link>
                        <Link className="my-1 leading-2  text-white transition-colors duration-300 transform cursor-pointer hover:text-[#f36710] text-md" to="/gallery">Gallery</Link>
                        <Link className="my-1 leading-2  text-white transition-colors duration-300 transform cursor-pointer hover:text-[#f36710] text-md" to="/contact">Contact Us</Link>
                        <div className="">
                            <Link target='_blank' className=" border-[1px] border-[#f36710] py-1 pl-1 pr-2 rounded-md text-sm leading-5 hover:text-[#f36710]  transition-colors duration-300 transform text-white" to="/signIn" >
                                <PersonIcon sx={{ marginTop: '-3px', fontSize: '18px', marginRight: '2px' }} />
                                Login
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    )
}

export default Navbar