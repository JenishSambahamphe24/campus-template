import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, } from '@heroicons/react/20/solid'
import { useAuth } from '../../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const address = import.meta.env.VITE_ADDRESS;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;
const addressNepali = import.meta.env.VITE_ADDRESS_NEPALI;
const collegeNameNepali = import.meta.env.VITE_COLLEGE_NAME_NEPALI;
const logoURL = import.meta.env.VITE_LOGO_URL
const textColor = import.meta.env.VITE_NAV_TEXT
const bgColor = import.meta.env.VITE_NAV_BG


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
                <div className="pb-0 mx-auto">
                <div className={`px-4 lg:px-20 bg-[${bgColor}] py-4  md:py-1  h-full items-center mx-auto flex flex-col sm:flex-column md:flex-row justify-between w-full`}>
                        <Link className="flex items-center" to="/">
                            <img
                                className="w-[120px] h-auto"
                                src={logoURL}
                                alt="Logo"
                            />
                        </Link>
                        <div className={`ml-2 mt-4 text-[${textColor}] md:mt-1 lg:ml-4 flex flex-col justify-center`}>
                            <h1 className={`text-xs text-center lg:text-xs text-[${textColor}]  font-medium tracking-wide`}> त्रिभुवन विश्वविद्यालयबाट सम्बन्धन प्राप्त </h1>
                            <p className={`text-xs text-${textColor} text-center lg:text-xs`}> Affiliated to Tribhuwan University </p>
                            <h1 className={`text-md lg:text-xl font-bold text-[${textColor}] text-center`}>{collegeNameNepali}</h1>
                            <h1 className={`text-xs lg:text-lg font-bold text-[${textColor}] uppercase text-center`}>{collegeName}</h1>
                            <h1 className={`text-xs font-medium text-[${textColor}] uppercase text-center`}>{addressNepali}</h1>
                            <h1 className={`text-xs font-medium text-[${textColor}]  text-center`}>{address}</h1>
                        </div>
                        <div className='hidden lg:block'>
                            <img src="https://media.tenor.com/MCKjaHTU0kwAAAAj/nepal.gif" className='w-32 h-32' alt="" />
                        </div>
                    </div>
                    {/* main navigation */}
                    <div style={{ backgroundColor: '#1169bf' }} className="flex justify-between px-20 p-3   overflow-y-auto whitespace-nowrap scroll-hidden md:flex-row md:items-start">
                        <div className="flex ">
                            <div className='flex'>
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="/admin">Home</Link>

                                <Menu as="div" className="inline-block text-left z-10">
                                    <MenuButton className="mx-4 flex leading-2 text-sm text-white">
                                        Academics
                                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                    </MenuButton>
                                    <MenuItems
                                        style={{ backgroundColor: '#1169bf' }}
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
                                        Contents
                                        <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                    </MenuButton>
                                    <MenuItems
                                        style={{ backgroundColor: '#1169bf' }}
                                        transition
                                        className="absolute left-45% z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none"
                                    >
                                        <div className="py-1">
                                            <MenuItem>
                                                <Link
                                                    to="publications"
                                                    className="block px-4 py-2 text-sm text-white hover:text-gray-900"
                                                >
                                                    Content management
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link
                                                    to="addCategory"
                                                    className="block px-4 py-2 text-sm text-white hover:text-gray-900"
                                                >
                                                    Content categories
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
                               
                                <Link className="mx-4 text-sm leading-5 hover:text-gray-900 transition-colors duration-300 transform text-white" to="links">External Links</Link>
                            </div>
                        </div>

                        <div className="flex ">
                            <Menu as="div" className="inline-block  text-left ">
                                <MenuButton
                                    className="mx-4 flex leading-2 text-sm text-white">
                                    Profile
                                    <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-white" />
                                </MenuButton>
                                <MenuItems className="absolute bg-gray-300 rounded-md  rounded-t-none right-[0px] bottom-[-58%] text-black z-10 mt-2 w-44 overflow-hidden">
                                    <MenuItem>
                                        <h1 className="text-sm px-4 pt-2">
                                            Signed in as
                                        </h1>
                                    </MenuItem>
                                    <MenuItem>
                                        <h2 className="px-4  text-xs">
                                            {email}
                                        </h2>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem>
                                        <Link type='Button' to='password-settings' className="hover:bg-[#1169bf] block px-4 py-2 text-sm">
                                            password change
                                        </Link>
                                    </MenuItem>
                                    <MenuItem>
                                        <Link type='Button' onClick={handleLogout} className="hover:bg-[#1169bf] block px-4 py-2 text-sm">
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