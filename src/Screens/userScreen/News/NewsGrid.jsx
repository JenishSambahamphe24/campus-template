import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllpublication } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
import { cleanDescription, formatDateShort } from '../../../Components/utilityFunctions';
import { Grid } from '@mui/material';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

function NewsGrid() {
    const [allNewsEvents, setAllNews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; 

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllpublication();
            const newsData = data.filter((item) => item.categoryName === 'News and Events' && item.displayStatus === true);
            setAllNews(newsData);
        };
        fetchData();
    }, []);

    const latestNews = allNewsEvents.length > 0 ? allNewsEvents.slice().sort((a, b) => b.id - a.id)[0] : null;
    const otherNews = latestNews ? allNewsEvents.filter(item => item.id !== latestNews.id) : [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedNews = otherNews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(otherNews.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto py-8 px-20 relative">
            <div>
                <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-4">
                    News and Events  
                </h2>
            </div>
            {allNewsEvents.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mt-[10px]">
                        {latestNews && (
                            <Link to={`/publication/${latestNews.id}`} className="sm:col-span-5">
                                <div
                                    className="bg-cover text-center overflow-hidden"
                                    style={{
                                        minHeight: "300px",
                                        backgroundImage: latestNews.thumbnailImage
                                            ? `url(${IMAGE_URL}/thumb/${latestNews.thumbnailImage})`
                                            : `url(${defaultImage})`
                                    }}
                                    title="Latest News Thumbnail"
                                ></div>
                                <div className="mt-2 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
                                    <div>
                                        <div className="text-[11px] text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                            {`${formatDateShort(latestNews.createdAt || '2024-01-01')} , ${latestNews.subCategoryName}`}
                                        </div>
                                        <div className="block text-gray-900 font-bold text-[14px] mb-2 hover:text-indigo-600 transition duration-500 ease-in-out">
                                            {latestNews.title}
                                        </div>
                                        <p className="text-gray-700 text-base mt-1 line-clamp-4">
                                            <div
                                                style={{ fontSize: '13px' }}
                                                dangerouslySetInnerHTML={{ __html: cleanDescription(latestNews.description) }}
                                            />
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        <div className="sm:col-span-7 grid grid-cols-2 lg:grid-cols-3 gap-5 ">
                            {paginatedNews.sort((a, b) => b.id - a.id).map((item) => (
                                <Link to={`/publication/${item.id}`} key={item.id}>
                                    <div
                                        className="h-40 bg-cover text-center overflow-hidden"
                                        style={{
                                            backgroundImage: item.thumbnailImage
                                                ? `url(${IMAGE_URL}/thumb/${item.thumbnailImage})`
                                                : `url(${defaultImage})`
                                        }}
                                        title="News Thumbnail"
                                    ></div>
                                    <h5 className="px-1 text-[11px] italic text-indigo-500 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                        {`${formatDateShort(item.createdAt || '2024-01-01')} , ${item.subCategoryName}`}
                                    </h5>
                                    <div className="text-gray-900 px-1 inline-block font-semibold text-[14px] my-1 line-clamp-2 hover:text-indigo-600 transition duration-500 ease-in-out">
                                        {item.title} 
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                    {totalPages > 0 && (
                        <div className="flex items-center justify-end gap-8 mt-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <p className="text-slate-600">
                                Page <strong className="text-slate-800">{currentPage}</strong> of&nbsp;<strong className="text-slate-800">{totalPages}</strong>
                            </p>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <Grid sm={12} sx={{ minHeight: '200px' }} textAlign={'center'} justifyContent='center' alignContent='center' >
                    <p className="text-xl text-red-600">No News uploaded yet !!</p>
                </Grid>
            )}
        </div>
    );
}

export default NewsGrid;