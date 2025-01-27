import { useState, useEffect } from 'react';
import { FaRegFilePdf } from "react-icons/fa";
import { Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaBookReader } from 'react-icons/fa';
import { SlCalender } from "react-icons/sl";
import { getAllPrograms } from '../../Screens/cmsScreen/cms-components/cms-academics/academicsApi';
const FILE_URL = import.meta.env.VITE_FILE_URL;
import PaginationForReports from '../../Screens/userScreen/publications/component/PaginationForReports';
import { getAllpublication } from '../../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import { extractDate } from '../utilityFunctions';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL


const defaultImage = 'https://www.shutterstock.com/image-illustration/news-events-crosswords-part-business-260nw-214848502.jpg'

function NoticeTabs() {
    const [allNotices, setAllNotices] = useState([])
    const [allPrograms, setAllPrograms] = useState([])
    const [news, setNews] = useState([])

    const fetchData = async () => {
        const noticeResponse = await getAllpublication()
        const newsResponse = noticeResponse.filter(item => item.categoryName === "News and Events")
        const sortedData = newsResponse.sort((a, b) => b.id - a.id)
        const top4Data = sortedData.slice(0, 5)
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
    const itemsPerPage = 5;
    const totalPages = Math.ceil(allNotices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstOtherItem = indexOfLastItem - itemsPerPage;
    const paginatedItems = allNotices.slice(indexOfFirstOtherItem, indexOfLastItem);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    return (
        <Grid container sm={12} mx='auto' className='px-2 mt-12 mb-4 justify-between' >
            <Grid sm={3.8} className='relative border-2 border-[#0368b0] h-[27rem]'>
                <h1 className='bg-[#0368b0] text-white text-2xl text-center font-bold uppercase py-2'>Latest Notices</h1>
                <div className="flex flex-col h-full p-2">
                    <ul className="flex-grow list-disc pl-5 space-y-2 overflow-auto">
                        {paginatedItems.length > 0 ? (
                            paginatedItems.map((item, index) => (
                                <li key={index}>
                                    <div>
                                        <p className="flex justify-between text-sm">
                                            {item.title}
                                            <a href={`${FILE_URL}${item.file}`} download target="_blank" className='flex px-2 py-1 bg-[#F36710] rounded-lg' rel="noopener noreferrer" >
                                                <span className='text-xs mt-[1px] text-white'>
                                                    download
                                                </span>
                                                <FaRegFilePdf fontSize="17px" style={{ marginLeft: '5px', color: '#0368b0' }} />
                                            </a>
                                        </p>
                                        <p className="flex text-xs italic">
                                            <SlCalender fontSize="12px" style={{ color: '#0368b0', marginRight: '3px' }} />
                                            20/09/1990
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
            <Grid position='relative' sm={4} className='border-2 border-[#0368b0] h-[27rem]'>
                <h1 className='bg-[#0368b0] text-white text-2xl text-center font-bold uppercase py-2'>Offered Programs</h1>
                <Grid container padding='15px' gap='10px' rowGap='20px'>
                    {
                        allPrograms.map((item, index) => (
                            <Grid
                                item
                                key={index}
                                sm={3.8}
                                className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-200 h-32 px-4 pt-3 pb-2 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-3xl"
                            >
                                <Link to={`/program/${item.id}`}>
                                    <span className="absolute invisible group-hover:visible top-4 z-0 h-10 w-10 rounded-full bg-sky-500 transition-all duration-300 group-hover:scale-[8]"></span>
                                    <div className="relative z-10 flex flex-col items-center">
                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-[#0368b0] transition-all duration-300 group-hover:bg-sky-400">
                                            <FaBookReader className="h-6 w-6 text-white transition-all" />
                                        </span>
                                        <div className="pt-1 text-base font-semibold leading-6 text-center">
                                            <p className="text-[#0368b0] transition-all duration-300 group-hover:text-white text-sm">
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
            <Grid position='relative' sm={3.8} className='border-2 border-[#0368b0] h-[27rem]'>
                <h1 className='bg-[#0368b0] text-white text-2xl text-center font-bold uppercase py-2'>latest news & events</h1>
                <div className="mt-2 col-span-4 space-y-2 p-2">
                    {
                        news.map((item, index) => (
                            <Link to={`/publication/${item.id}`} key={index} className="flex border-2 items-center ">
                                <div className="inline-block mr-3">
                                    <div className="w-16 h-16">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={item.thumbnailImage ? `${IMAGE_URL}${item.thumbnailImage}` : defaultImage}
                                            onError={(e) => { e.target.src = defaultImage; }}
                                            alt=""
                                        />
                                    </div>
                                </div>
                                <div className="text-sm flex flex-col justify-center">
                                    <a href="#" className="text-gray-900 font-medium hover:text-indigo-600 leading-none line-clamp-2">
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
    );
}

export default NoticeTabs;
