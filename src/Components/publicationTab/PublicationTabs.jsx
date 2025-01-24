import React, { useState, useEffect } from 'react'
import { MdOutlineFileDownload } from "react-icons/md";
import { Grid, Button, Typography, Box, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllpublication } from '../../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import { cleanDescription } from '../utilityFunctions';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const FILE_URL = import.meta.env.VITE_FILE_URL
import { formatDate } from '../utilityFunctions';



function PublicationTabs() {
    const defaultImage = 'https://www.agastiyarzones.com/assets/img/service/Journal_Publication.png'
    const [allPublication, setAllPublication] = useState([])
    useEffect(() => {
        const fetchdata = async () => {
            const data = await getAllpublication()
            const filteredData = data.filter(item => item.categoryName === "News and Events")
            const sortedData = filteredData.sort((a, b) => b.id - a.id)
            const top4Data = sortedData.slice(0, 4)
            setAllPublication(top4Data)
        };
        fetchdata()
    }, [])

    return (
        <Grid container rowGap='20px' >
            <Divider style={{ width: '100%', backgroundColor: '#c2c2c2' }} />
            <h1 className=' text-2xl'>
                News & Events
            </h1>
            <Grid spacing='20px' display='flex' container >
                {
                    allPublication.map((item, index) => (
                        <Grid key={index} item xs={6} lg={2} >
                            <article style={{ minHeight: '220px' }} className="flex flex-col bg-gray-200 hover:bg-blue-300 overflow-hidden rounded-lg border border-gray-400  shadow-sm transition-transform transform hover:scale-105 hover:cursor-pointer">

                                <Link className='flex-grow' to={`/publication/${item.id}`}>
                                    <img
                                        alt=""
                                        src={`${IMAGE_URL}${item.thumbnailImage}`}
                                        className="h-36 w-full object-cover"
                                    />
                                    <div className='flex justify-between mt-auto px-2 italic'>
                                        <p className='text-xs '>{item.subCategoryName}</p>
                                        <span className='ml-2 text-blue-500 text-xs'>
                                            {formatDate(item.publishedAt)}
                                        </span>
                                    </div>
                                    <div className="p-1 sm:p-2 ">
                                        <p className="line-clamp-3 text-xs text-gray-700">
                                            <div
                                                dangerouslySetInnerHTML={{ __html: cleanDescription(item.description) }}
                                            />
                                        </p>
                                    </div>
                                </Link>

                            </article>
                        </Grid>
                    ))
                }
            </Grid>
            <div className='w-full flex justify-center'>
                <Button sx={{ textTransform: 'none' }} size="small" variant="outlined" className="flex items-center gap-2">
                    <Link to='/news'>
                        <Typography >
                            All nerws & events
                        </Typography>
                    </Link>
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
            </div>
        </Grid >
    )
}

export default PublicationTabs