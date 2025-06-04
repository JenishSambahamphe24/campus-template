import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon, } from '@heroicons/react/20/solid'
import { useAuth } from '../../../context/AuthContextProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { Logout } from '@mui/icons-material';

const address = import.meta.env.VITE_ADDRESS;
const collegeName = import.meta.env.VITE_COLLEGE_NAME;
const addressNepali = import.meta.env.VITE_ADDRESS_NEPALI;
const collegeNameNepali = import.meta.env.VITE_COLLEGE_NAME_NEPALI;
const logoURL = import.meta.env.VITE_LOGO_URL || 'https://kanchancampus.edu.np/assets/Logo.png'
const textColor = import.meta.env.VITE_NAV_TEXT
const bgColor = import.meta.env.VITE_NAV_BG

console.log(logoURL)
function AdminNavbar() {
    const navigate = useNavigate();
    const { email } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;
    const activeStyle = "text-[#f58d4c] font-medium";
    const inactiveStyle = "text-white hover:text-[#f36710] transition-colors duration-300 transform";
    const isActive = (path) => currentPath === path;
    const isAnyActive = (paths) => paths.some(path => currentPath.startsWith(path));
    const academicPaths = ['/admin/faculties', '/admin/addFaculty', '/admin/programs', '/admin/addProgram', '/admin/editProgram'];
    const contentPaths = ['/admin/publications', '/admin/addPublication', '/admin/editPublication', '/admin/addCategory', '/admin/aboutUs', '/admin/addAboutUs', '/admin/editAboutUs'];

    const handleLogout = () => {
        localStorage.clear();
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
                                    className="absolute left-45% z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
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
                                    className="absolute left-45% z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg transition focus:outline-none"
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

                </div>


            </div>
        </nav>
    );
}
export default AdminNavbar
