import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllaboutUs } from '../Screens/cmsScreen/cms-components/cms-aboutUs/aboutsAPI';
import { getAllTeams } from '../Screens/cmsScreen/cms-components/cms-team/teamApi';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_LOGO_URL


function MessageSection() {
    const [isHovered, setIsHovered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [introduction, setIntroduction] = useState({
        heading: '',
        description: ''
    });
    const [chiefMessage, setChiefMessage] = useState({
        heading: '',
        description: ''
    });
    const [chairmanMessage, setChairmanMessage] = useState({
        heading: '',
        description: ''
    });
    const [teamInfo, setTeamInfo] = useState({
        chairman: '',
        chief: ''
    });

    useEffect(() => {
        const fetchAboutUs = async () => {
            setLoading(true);
            try {
                const response = await getAllaboutUs();

                if (!response || !Array.isArray(response)) {
                    throw new Error("Invalid response format from API");
                }

                const intro = response.find(item => item?.heading === 'Introduction');
                const chief = response.find(item => item?.heading === 'Message-campus-chief');
                const chairman = response.find(item => item?.heading === 'Message-chairman');

                setIntroduction(intro || { heading: 'Introduction', description: 'Information not available' });
                setChiefMessage(chief || { heading: 'Message-campus-chief', description: 'Message not available' });
                setChairmanMessage(chairman || { heading: 'Message-chairman', description: 'Message not available' });

            } catch (error) {
                console.error("Failed to fetch About Us data:", error);
                setError("Failed to load content. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchAboutUs();
    }, []);

    useEffect(() => {
        const fetchTeamInfo = async () => {
            try {
                const response = await getAllTeams();

                if (!response || !Array.isArray(response)) {
                    throw new Error("Invalid team data format");
                }

                const chairmanData = response.find(item => item?.subCategory === 'Chairman');
                const chiefData = response.find(item => item?.subCategory === 'Campus Chief');

                setTeamInfo({
                    chairman: chairmanData
                        ? `${chairmanData.firstName || ''} ${chairmanData.middleName || ''} ${chairmanData.lastName || ''}`.trim()
                        : 'Chairman information not available',
                    chief: chiefData
                        ? `${chiefData.firstName || ''} ${chiefData.middleName || ''} ${chiefData.lastName || ''}`.trim()
                        : 'Campus Chief information not available',
                });

            } catch (error) {
                console.error("Failed to fetch team data:", error);
                setTeamInfo({
                    chairman: 'Unable to load chairman information',
                    chief: 'Unable to load campus chief information'
                });
            }
        };

        fetchTeamInfo();
    }, []);

    console.log(teamInfo)

const renderSafeHTML = (content) => {
  if (!content) return '';

  try {
    return content
      .replace(/<pre><code[^>]*>/g, '')
      .replace(/<\/code><\/pre>/g, '')
      .replace(/ style="[^"]*"/g, ''); 
  } catch (e) {
    console.error("Error processing HTML content:", e);
    return 'Content unavailable';
  }
};


    if (loading) {
        return (
            <div className="w-full px-4 py-8 flex items-center justify-center">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-600">Loading content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full px-4 py-8 flex items-center justify-center">
                <div className="text-center py-12 max-w-md mx-auto">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded text-sm"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full  py-8">
            <div className="flex flex-col lg:flex-row gap-6">
                <Link to='/introduction' className="w-full lg:w-2/6 flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="flex flex-col md:flex-row h-full"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div className="w-full md:w-2/5 overflow-hidden h-full">
                            <img
                              src={introduction.aboutUsImage ? `${IMAGE_URL}/aboutUs/${introduction.aboutUsImage}` : defaultImage}
                                // src={`${IMAGE_URL}/aboutus/${introduction.aboutUsImage}`}
                                className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                            />
                        </div>

                        {/* Content container */}
                        <div className="w-full md:w-3/5 px-4 pt-2 pb-3">
                            <h2 className="text-lg text-[#1169bf] font-bold  ">
                                About Us
                            </h2>
                            {introduction?.description ? (
                                <p
                                   className="text-sm line-clamp-4"
                                    dangerouslySetInnerHTML={{
                                        __html: renderSafeHTML(introduction.description)
                                    }}
                                />
                            ) : (
                                <p className="text-gray-600">No information available</p>
                            )}
                        </div>
                    </div>
                </Link>
                <Link to='/message-from-chairman' className="w-full lg:w-2/6 flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="flex flex-1 flex-col px-4 pt-4 mb-2 space-y-2">
                        <svg
                            width="16"
                            height="12"
                            viewBox="0 0 24 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#1169bf]  fill-current"
                        >
                            <path
                                d="M24 7.3h-5.1L22.3.4H17l-3.4 6.9v10.3H24V7.3zM10.3 17.6V7.3H5L8.6.4H3.4L0 7.3v10.3h10.3z"
                                fill="currentColor"
                            ></path>
                        </svg>
                        {chairmanMessage?.description ? (
                            <p
                                className="text-sm line-clamp-3"
                                dangerouslySetInnerHTML={{
                                    __html: renderSafeHTML(chairmanMessage.description)
                                }}
                            />
                        ) : (
                            <p className="text-sm text-gray-600">Message from Chairman not available at the moment.</p>
                        )}
                    </div>
                    <div className="flex space-x-1 bg-gray-200 px-6 pt-1 pb-3 rounded-b-xl">
                        <div className="flex flex-col justify-center">
                            <p className="font-medium text-sm m-0 text-[#f36710]">
                                {teamInfo?.chairman || 'Name unavailable'}
                            </p>
                            <p className="text-xs  m-0 mt-1 text-[#f36710]">Chairman</p>
                        </div>
                    </div>
                </Link>
                <Link to='/message-from-campus_chief' className="w-full lg:w-2/6 flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <div className="flex flex-1 flex-col px-4 pt-4 mb-2 space-y-2">
                        <svg
                            width="16"
                            height="12"
                            viewBox="0 0 24 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-[#1169bf] fill-current"
                        >
                            <path
                                d="M24 7.3h-5.1L22.3.4H17l-3.4 6.9v10.3H24V7.3zM10.3 17.6V7.3H5L8.6.4H3.4L0 7.3v10.3h10.3z"
                                fill="currentColor"
                            ></path>
                        </svg>
                        {chiefMessage?.description ? (
                            <p
                                className="text-sm line-clamp-3"
                                dangerouslySetInnerHTML={{
                                    __html: renderSafeHTML(chiefMessage.description)
                                }}
                            />
                        ) : (
                            <p className="text-sm ">Message from Campus Chief not available at the moment.</p>
                        )}
                    </div>
                    <div className="flex space-x-1 bg-gray-200 px-4 pt-1 pb-3 rounded-b-xl">
                        <div className="flex flex-col justify-center">
                            <p className="font-medium text-sm m-0 text-[#f36710]">
                                {teamInfo?.chief || 'Name unavailable'}
                            </p>
                            <p className="text-xs text-[#f36710] m-0 mt-1">Campus Chief</p>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default MessageSection;