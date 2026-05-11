import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import { LuMenu } from 'react-icons/lu';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const address = import.meta.env.VITE_ADDRESS;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;
const addressNepali = import.meta.env.VITE_ADDRESS_NEPALI;
const collegeNameNepali = import.meta.env.VITE_COLLEGE_NAME_NEPALI;
const logoURL = import.meta.env.VITE_DEFAULT_IMG
const textColor = import.meta.env.VITE_NAV_TEXT
const bgColor = import.meta.env.VITE_NAV_BG

console.log(logoURL)
function AdminNavbar() {
    const navigate = useNavigate();
    const { email } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;
    const [isOpen, setIsOpen] = useState(false);
    const [mobileAcademicOpen, setMobileAcademicOpen] = useState(false);
    const [mobileContentOpen, setMobileContentOpen] = useState(false);
    const [mobileQaaOpen, setMobileQaaOpen] = useState(false);
    const activeStyle = "text-[#f58d4c] font-medium";
    const inactiveStyle = "text-white hover:text-[#f36710] transition-colors duration-300 transform";
    const isActive = (path) => currentPath === path;
    const isAnyActive = (paths) => paths.some(path => currentPath.startsWith(path));
    const academicPaths = ['/admin/faculties', '/admin/addFaculty', '/admin/programs', '/admin/addProgram', '/admin/editProgram'];
    const contentPaths = ['/admin/publications', '/admin/addPublication', '/admin/editPublication', '/admin/addCategory', '/admin/aboutUs', '/admin/addAboutUs', '/admin/editAboutUs'];
    const qaUserPaths = ['/admin/ugc-users', '/admin/qaa-documents'];

    const handleLogout = () => {
        sessionStorage.clear();
        toast.success('Successfully logged out', { autoClose: 300 });
        setTimeout(() => {
            navigate('/signIn');
        }, 1000);
    };

    return (
        <nav className="relative bg-white shadow ">
            <div className="pb-0 mx-auto">
                <div className={`px-4 lg:px-20 bg-[${bgColor}] py-4 md:py-1 h-full items-center mx-auto flex flex-col sm:flex-column md:flex-row justify-between w-full`}>
                    <Link className="flex items-center" to="/">
                        <img
                            className="w-[120px] h-auto"
                            src={logoURL}
                            alt="Logo"
                        />
                    </Link>
                    <div className={`ml-2 mt-4 text-[${textColor}] md:mt-1 lg:ml-4 flex flex-col justify-center`}>
                        <h1 className={`text-xs text-center lg:text-xs text-[${textColor}] font-medium tracking-wide`}> त्रिभुवन विश्वविद्यालयबाट सम्बन्धन प्राप्त </h1>
                        <p className={`text-xs text-${textColor} text-center lg:text-xs`}> Affiliated to Tribhuwan University </p>
                        <h1 className={`text-md lg:text-xl font-bold text-[${textColor}] text-center`}>{collegeNameNepali}</h1>
                        <h1 className={`text-xs lg:text-lg font-bold text-[${textColor}] uppercase text-center`}>{collegeName}</h1>
                        <h1 className={`text-xs font-medium text-[${textColor}] uppercase text-center`}>{addressNepali}</h1>
                        <h1 className={`text-xs font-medium text-[${textColor}] text-center`}>{address}</h1>
                    </div>
                    <div className='hidden lg:block'>
                        <img src="https://media.tenor.com/MCKjaHTU0kwAAAAj/nepal.gif" className='w-32 h-32' alt="" />
                    </div>
                </div>

                {/* Main navigation */}
                <div style={{ backgroundColor: '#1169bf' }} className="flex justify-between px-20 py-3 overflow-y-auto whitespace-nowrap scroll-hidden md:flex-row md:items-start md:justify-start">
                    <div className="hidden md:flex w-full">
                        <div className="flex">
                            <Link
                                className={`mx-4 leading-5 ${isActive('/admin') ? activeStyle : inactiveStyle}`}
                                to="/admin"
                            >
                                Home
                            </Link>
                            <Menu as="div" className="inline-block text-left">
                                <MenuButton
                                    className={`mx-4 flex leading-3 items-center ${isAnyActive(academicPaths) ? activeStyle : inactiveStyle}`}
                                >
                                    Academics
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className={`-mr-1 h-5 w-5 ${isAnyActive(academicPaths) ? 'text-[#f36710]' : 'text-white'}`}
                                    />
                                </MenuButton>
                                <MenuItems
                                    style={{ backgroundColor: '#1169bf' }}
                                    transition
                                    className="absolute left-45% z-10 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link
                                                to="/admin/faculties"
                                                className={`block px-4 py-1 ${isActive('/admin/faculties') ? 'text-[#f36710]' : 'text-white hover:bg-blue-900'}`}
                                            >
                                                Faculties
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                to="/admin/programs"
                                                className={`block px-4 py-1 ${isActive('/admin/programs') ? 'text-[#f36710]' : 'text-white hover:bg-blue-900'}`}
                                            >
                                                Programs
                                            </Link>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                            <Menu as="div" className="inline-block text-left">
                                <MenuButton
                                    className={`mx-4 flex items-center leading-3 ${isAnyActive(contentPaths) ? activeStyle : inactiveStyle}`}
                                >
                                    Contents
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className={`-mr-1 h-5 w-5 ${isAnyActive(contentPaths) ? 'text-[#f36710]' : 'text-white'}`}
                                    />
                                </MenuButton>
                                <MenuItems
                                    style={{ backgroundColor: '#1169bf' }}
                                    className="absolute left-45% z-10 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link
                                                to="/admin/publications"
                                                className={`block px-4 py-1 ${isActive('/admin/publications') ? 'text-[#f36710]' : 'text-white hover:bg-blue-900'}`}
                                            >
                                                Content Management
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                to="/admin/addCategory"
                                                className={`block px-4 py-1 ${isActive('/admin/addCategory') ? 'text-[#f36710]' : 'text-white hover:bg-blue-900'}`}
                                            >
                                                Content Categories
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                to="/admin/aboutUs"
                                                className={`block px-4 py-1 ${isActive('/admin/aboutUs') ? 'text-[#f36710]' : 'text-white hover:bg-blue-900'}`}
                                            >
                                                Institutional Info
                                            </Link>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                            <Menu as="div" className="inline-block text-left">
                                <MenuButton
                                    className={`mx-4 flex items-center leading-3 ${isAnyActive(qaUserPaths) ? activeStyle : inactiveStyle}`}
                                >
                                    QAA & Users
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className={`-mr-1 h-5 w-5 ${isAnyActive(qaUserPaths) ? 'text-[#f36710]' : 'text-white'}`}
                                    />
                                </MenuButton>
                                <MenuItems
                                    style={{ backgroundColor: '#1169bf' }}
                                    className="absolute left-45% z-10 mt-2 w-max origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none"
                                >
                                    <div className="py-1">
                                        <MenuItem>
                                            <Link
                                                to="/admin/ugc-users"
                                                className={`block px-4 py-1 ${isActive('/admin/ugc-users') ? 'text-[#f36710]' : 'text-white hover:bg-blue-900'}`}
                                            >
                                                UGC User Management
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                to="/admin/qaa-documents"
                                                className={`block px-4 py-1 ${isActive('/admin/qaa-documents') ? 'text-[#f36710]' : 'text-white hover:bg-blue-900'}`}
                                            >
                                                QAA Document Management
                                            </Link>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                            <Link
                                className={`mx-4 leading-5 ${isAnyActive(['/admin/viewGallery', '/admin/addGallery', '/admin/editGallery']) ? activeStyle : inactiveStyle}`}
                                to="/admin/viewGallery"
                            >
                                Gallery
                            </Link>
                            <Link
                                className={`mx-4 leading-5 ${isAnyActive(['/admin/viewTeam','/admin/addTeam','/admin/editTeam']) ? activeStyle : inactiveStyle}`}
                                to="/admin/viewTeam"
                            >
                                Team
                            </Link>
                            <Link
                                className={`mx-4 leading-5 ${isAnyActive(['/admin/feedback']) ? activeStyle : inactiveStyle}`}
                                to="/admin/feedback"
                            >
                                Feedbacks
                            </Link>
                            <Link
                                className={`mx-4 leading-5 ${isAnyActive(['/admin/faq','/admin/addFaq']) ? activeStyle : inactiveStyle}`}
                                to="/admin/faq"
                            >
                                FAQs
                            </Link>
                            <Link
                                className={`mx-4 leading-5 ${isAnyActive(['/admin/links', '/admin/addLink']) ? activeStyle : inactiveStyle}`}
                                to="/admin/links"
                            >
                                External Links
                            </Link>
                        </div>

                        <div className="hidden  lg:flex ml-auto">
                            <Menu as="div" className="inline-block  text-left">
                                <MenuButton
                                    className="mx-4 flex items-center leading-5 text-white hover:text-[#f36710] transition-colors duration-300 transform"
                                >
                                    Profile
                                    <ChevronDownIcon
                                        aria-hidden="true"
                                        className="-mr-1 h-5 w-5 text-white"
                                    />
                                </MenuButton>
                                <MenuItems
                                    className="absolute right-0 z-10 mt-3 w-48 origin-top-right rounded-md bg-white shadow-lg"
                                >
                                    <div className="py-1 bg-gray-300">
                                        <MenuItem>
                                            <div className="block px-4 pt-2 text-sm text-gray-700">
                                                Signed in as
                                            </div>
                                        </MenuItem>
                                        <MenuItem>
                                            <div className="block px-4 pb-2 text-xs text-gray-500">
                                                {email}
                                            </div>
                                        </MenuItem>
                                        <Divider />
                                        <MenuItem>
                                            <Link
                                                to="/admin/password-settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Password Change
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            </Menu>
                        </div>

                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden relative right-[20px] text-left">
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
                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isActive('/admin') ? activeStyle : inactiveStyle}`} to="/admin">Home</Link>
                        
                        {/* Academics */}
                        <div className="divide-y divide-gray-100">
                            <details className="group" open={mobileAcademicOpen || isAnyActive(academicPaths)} onToggle={(e) => setMobileAcademicOpen(e.target.open)}>
                                <summary className={`flex my-1 leading-2 transition-colors duration-300 transform cursor-pointer text-md ${isAnyActive(academicPaths) ? activeStyle : inactiveStyle}`} style={{ listStyle: 'none' }}>
                                    Academics
                                    <div className="flex items-center">
                                        {(mobileAcademicOpen || isAnyActive(academicPaths)) ? <ChevronUpIcon className={`h-5 w-5 ${isAnyActive(academicPaths) ? 'text-[#f36710]' : 'text-white'}`}/> : <ChevronDownIcon className={`h-5 w-5 ${isAnyActive(academicPaths) ? 'text-[#f36710]' : 'text-white'}`}/>}
                                    </div>
                                </summary>
                                <div className='flex flex-col space-y-1'>
                                    <Link to="/admin/faculties" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isActive('/admin/faculties') ? activeStyle : inactiveStyle}`}>Faculties</Link>
                                    <Link to="/admin/programs" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isActive('/admin/programs') ? activeStyle : inactiveStyle}`}>Programs</Link>
                                </div>
                            </details>
                        </div>

                        {/* Contents */}
                        <div className="divide-y divide-gray-100">
                            <details className="group" open={mobileContentOpen || isAnyActive(contentPaths)} onToggle={(e) => setMobileContentOpen(e.target.open)}>
                                <summary className={`flex my-1 leading-2 transition-colors duration-300 transform cursor-pointer text-md ${isAnyActive(contentPaths) ? activeStyle : inactiveStyle}`} style={{ listStyle: 'none' }}>
                                    Contents
                                    <div className="flex items-center">
                                        {(mobileContentOpen || isAnyActive(contentPaths)) ? <ChevronUpIcon className={`h-5 w-5 ${isAnyActive(contentPaths) ? 'text-[#f36710]' : 'text-white'}`}/> : <ChevronDownIcon className={`h-5 w-5 ${isAnyActive(contentPaths) ? 'text-[#f36710]' : 'text-white'}`}/>}
                                    </div>
                                </summary>
                                <div className='flex flex-col space-y-1'>
                                    <Link to="/admin/publications" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isActive('/admin/publications') ? activeStyle : inactiveStyle}`}>Content Management</Link>
                                    <Link to="/admin/addCategory" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isActive('/admin/addCategory') ? activeStyle : inactiveStyle}`}>Content Categories</Link>
                                    <Link to="/admin/aboutUs" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isActive('/admin/aboutUs') ? activeStyle : inactiveStyle}`}>Institutional Info</Link>
                                </div>
                            </details>
                        </div>

                        {/* QAA & Users */}
                        <div className="divide-y divide-gray-100">
                            <details className="group" open={mobileQaaOpen || isAnyActive(qaUserPaths)} onToggle={(e) => setMobileQaaOpen(e.target.open)}>
                                <summary className={`flex my-1 leading-2 transition-colors duration-300 transform cursor-pointer text-md ${isAnyActive(qaUserPaths) ? activeStyle : inactiveStyle}`} style={{ listStyle: 'none' }}>
                                    QAA & Users
                                    <div className="flex items-center">
                                        {(mobileQaaOpen || isAnyActive(qaUserPaths)) ? <ChevronUpIcon className={`h-5 w-5 ${isAnyActive(qaUserPaths) ? 'text-[#f36710]' : 'text-white'}`}/> : <ChevronDownIcon className={`h-5 w-5 ${isAnyActive(qaUserPaths) ? 'text-[#f36710]' : 'text-white'}`}/>}
                                    </div>
                                </summary>
                                <div className='flex flex-col space-y-1'>
                                    <Link to="/admin/ugc-users" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isActive('/admin/ugc-users') ? activeStyle : inactiveStyle}`}>UGC User Management</Link>
                                    <Link to="/admin/qaa-documents" className={`relative ml-2 leading-2 transition-colors duration-300 transform text-sm before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-[1px] before:bg-white before:mr-1 pl-5 ${isActive('/admin/qaa-documents') ? activeStyle : inactiveStyle}`}>QAA Document Management</Link>
                                </div>
                            </details>
                        </div>

                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isAnyActive(['/admin/viewGallery']) ? activeStyle : inactiveStyle}`} to="/admin/viewGallery">Gallery</Link>
                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isAnyActive(['/admin/viewTeam']) ? activeStyle : inactiveStyle}`} to="/admin/viewTeam">Team</Link>
                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isAnyActive(['/admin/feedback']) ? activeStyle : inactiveStyle}`} to="/admin/feedback">Feedbacks</Link>
                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isAnyActive(['/admin/faq']) ? activeStyle : inactiveStyle}`} to="/admin/faq">FAQs</Link>
                        <Link className={`my-1 leading-2 transition-colors duration-300 transform text-md ${isAnyActive(['/admin/links']) ? activeStyle : inactiveStyle}`} to="/admin/links">External Links</Link>
                        
                        <div className="mt-4 pt-4 border-t border-blue-800">
                            <Link to="/admin/password-settings" className={`block my-2 leading-2 transition-colors duration-300 transform text-md ${isActive('/admin/password-settings') ? activeStyle : inactiveStyle}`}>Password Change</Link>
                            <button onClick={handleLogout} className="mt-2 flex items-center w-max border-[1px] border-[#f36710] py-1 pl-1 pr-2 rounded-md text-sm leading-5 hover:text-[#f36710] transition-colors duration-300 transform text-white">
                                <PersonIcon sx={{ marginTop: '-3px', fontSize: '18px', marginRight: '4px' }} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
}
export default AdminNavbar
