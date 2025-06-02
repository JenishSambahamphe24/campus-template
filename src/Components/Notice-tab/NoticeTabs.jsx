import { useState, useEffect } from 'react';
import { FaRegFilePdf } from "react-icons/fa";
import { Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaBookReader } from 'react-icons/fa';
import { SlCalender } from "react-icons/sl";
import { getAllPrograms } from '../../Screens/cmsScreen/cms-components/cms-academics/academicsApi';
const FILE_URL = import.meta.env.VITE_FILE_URL;
import PaginationForReports from '../../Screens/userScreen/publications/component/PaginationForReports';
import { downloadPublicationFile, getAllpublication } from '../../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import { extractDate } from '../utilityFunctions';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL


const defaultImage = 'https://www.shutterstock.com/image-illustration/news-events-crosswords-part-business-260nw-214848502.jpg'

function NoticeTabs() {
    const [allNotices, setAllNotices] = useState([])
    const [allPrograms, setAllPrograms] = useState([])
    const [news, setNews] = useState([])
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
     

    const fetchData = async () => {
        const noticeResponse = await getAllpublication()
        const newsResponse = noticeResponse.filter(item => item.categoryName === "News and Events")
        const sortedData = newsResponse.sort((a, b) => b.id - a.id)
        const top4Data = sortedData.slice(0, 5)
        console.log(noticeResponse)
        setNews(top4Data)
        if (noticeResponse) {
            setAllNotices(noticeResponse.filter(item => item.categoryName === 'Notices'))
        } else {
            setAllNotices([])
        }
        if (noticeResponse) {
            setAllNotices(noticeResponse.filter(item => item.categoryName === 'Notices'))
        } else {
            setAllNotices([])
        }
        const response = await getAllPrograms()
        if (response) {
            setAllPrograms(response)
        } else {
            setAllPrograms([])
        }
    }
    useEffect(() => {
        fetchData()
    }, [])


    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 4;
    const totalPages = Math.ceil(allNotices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstOtherItem = indexOfLastItem - itemsPerPage;
    const paginatedItems = allNotices
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(indexOfFirstOtherItem, indexOfLastItem);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <Grid container justifyContent='center' gap='15px' sx={{ minHeight: { xs: 'auto', lg: '27rem' } }}>
            <Grid item xs={12} sm={5.8} md={5.8} lg={3} order={{ xs: 2, sm: 2, md: 2, lg: 1 }} className='relative rounded-l-lg border-2 border-[#1169bf] h-[27rem]'>
                <h1 className='bg-[#1169bf]  text-white text-lg text-center font-bold uppercase py-2'>Latest Notices</h1>
                <div className="flex flex-col h-full p-2">
                    <ul className="flex-grow list-disc pl-5 pt-1 space-y-4 overflow-auto">
                        {paginatedItems.length > 0 ? (
                            paginatedItems.map((item, index) => (
                                <li key={index}>
                                    <div className='line-clamp-1'>
                                        <span className="flex justify-between text-md  overflow-hidden">
                                            <p className='line-clamp-2'>
                                                {item.title}
                                            </p>
                                            <button onClick={() => downloadPublicationFile(item.file)} className='flex h-5 mt-1 ml-1 px-1 bg-[#F36710] rounded-lg'>
                                                <span className='text-xs mt-[1px] text-white'>
                                                    download
                                                </span>
                                                <FaRegFilePdf fontSize="16px" style={{ marginLeft: '5px', color: 'white', marginTop: '2px' }} />
                                            </button>
                                        </span>
                                        <p className="flex text-xs mt-[-2px] italic">
                                            <SlCalender fontSize="12px" style={{ color: '#1169bf', marginRight: '3px', marginTop: '2px' }} />
                                            { extractDate(item.publishedAt)}
                                        </p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <h1 className="text-center text-sm">No any items !!</h1>
                        )}

                    </ul>
                    <div className="absolute bottom-2 right-1 mt-3">
                        <PaginationForReports
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                </div>
            </Grid>
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={5.8}
                order={{ xs: 1, sm: 1, md: 1, lg: 2 }}
                className={`relative border-2 border-[#1169bf] ${isMobile ? 'h-[37rem]' : 'h-[27rem]'}`}
            >

                <h1 className='bg-[#1169bf] text-white text-lg text-center font-bold uppercase py-2'>Offered Programs</h1>
                <Grid container padding='15px' justifyContent={isMobile ? 'center' : 'flex-start'} gap='10px' rowGap='20px'>
                    {
                        allPrograms.sort((a, b) => b.id - a.id).slice(0, 6).map((item, index) => (
                            <Grid
                                item
                                key={index}
                                md={3.8}
                                xs={5.8}
                                className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#1169bf] h-36 px-4 pt-3 pb-2 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-3xl"
                            >
                                <Link to={`/program/${item.id}`}>
                                    <span className="absolute invisible group-hover:visible top-4 z-0 h-10 w-10 rounded-full bg-[#f36710]  transition-all duration-300 group-hover:scale-[8]"></span>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f36710]  transition-all duration-300 group-hover:bg-[#f36710]">
                                            <FaBookReader className="h-6 w-6 text-white transition-all" />
                                        </span>
                                        <div className="pt-1 text-base font-semibold leading-6 text-center">
                                            <p className="text-white transition-all duration-300 group-hover:text-white text-md">
                                                {item.shortName}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </Grid>
                        ))
                    }
                    <Link className='w-full flex justify-end mb-1 absolute bottom-0 right-1' to='/program-list'>
                        <Button sx={{ textTransform: 'none', }} size='small' className="flex  items-center gap-1">
                            View All programs
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                />
                            </svg>
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={5.8} md={5.8} lg={2.8} order={{ xs: 3, sm: 3, md: 3, lg: 3 }} className='relative border-2 rounded-r-lg  border-[#1169bf] h-[27rem]'>
                <h1 className='bg-[#1169bf] text-white text-lg text-center font-bold uppercase py-2'>latest news & events</h1>
                <div className="mt-2 col-span-4 space-y-2 p-2">
                    {
                        news.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 4).map((item, index) => (
                            <Link to={`/publication/${item.id}`} key={index} className="flex border-[1px] rounded-sm border-[#f36710] items-center ">
                                <div className="inline-block mr-3">
                                    <div className="w-16 h-16">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={item.thumbnailImage ? `${IMAGE_URL}/thumb/${item.thumbnailImage}` : defaultImage}
                                            onError={(e) => { e.target.src = defaultImage; }}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="text-sm flex flex-col justify-center">
                                    <a href="#" className="text-gray-900 font-medium hover:text-[#f36710] leading-none line-clamp-2">
                                        {item.title}
                                    </a>
                                    <p className="flex text-gray-600 text-xs items-center italic">
                                        {extractDate(item.publishedAt)} <span className='mr-1 ml-1'> | </span><span> {item.subCategoryName}</span>
                                    </p>
                                </div>
                            </Link>
                        ))
                    }

                </div>
                <Link className='w-full flex justify-end mb-1 absolute bottom-0 right-1' to='/news'>
                    <Button sx={{ textTransform: 'none', }} size='small' className="flex  items-center gap-1">
                        View All News & Events
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="h-4 w-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </Button>
                </Link>
            </Grid>
        </Grid>
    );
}
export default NoticeTabs;
