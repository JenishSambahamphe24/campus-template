import React, { useState, useEffect } from 'react'
import { Grid, Box, Typography, Button, Stack, Divider } from '@mui/material'
import { BsTwitterX } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { extractDate, formatDateShort } from '../../../Components/utilityFunctions';
import { getAllpublication, getPublicationById } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
import DownloadIcon from '@mui/icons-material/Download';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';

function PublicationPage() {
    const [allPubData, setAllPubData] = useState([]);
    const [publicationDetail, setPublicationDetail] = useState({});
    const { id } = useParams()
    const theme = useTheme();

    const defaultImage = 'https://gyanodayampc.edu.np/assets/Logo.png'
    useEffect(() => {
        const fetchAllPubData = async () => {
            const data = await getAllpublication()
            const allData = data.filter((item) => item.categoryName === 'Publication')
            setAllPubData(allData)
        };
        const fetchData = async () => {
            const data = await getPublicationById(id)
            setPublicationDetail(data)
        };
        fetchData()
        fetchAllPubData()
    }, [])



    return (
        <Grid container className='px-10  sm:px-2 md:px-4 lg:px-20 py-10' display='flex' justifyContent='center' gap='10px'>
            <Grid display='flex' justifyContent='space-between' flexDirection='column' item xs={12} sm={7.4} md={8.3} lg={8.8} order={{ xs: 2, sm: 2, md: 2, lg: 1 }}>
                <div>
                    <Typography fontFamily='fantasy'>
                        <div
                            style={{ fontSize: '16px' }}
                            dangerouslySetInnerHTML={{ __html: publicationDetail.description } || "No CV details available"}
                        />
                    </Typography>
                </div>

                <Link to='/publication'>
                    <Button sx={{ textTransform: 'none', mt: '30px' }} size="small" variant="outlined" className="flex items-center gap-3 bg-red-900">
                        See all Publications
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

            <Grid item xs={12} sm={4.3} md={3.5} lg={3} className='border border-gray-100' order={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                <div className="full group relative block overflow-hidden">
                    <img
                        src={publicationDetail.thumbnailImage ? `${IMAGE_URL}content/${publicationDetail.thumbnailImage}` : defaultImage}
                        alt="Team Member"
                        onError={(e) => { e.target.src = defaultImage; }}
                        className={`h-52 transition duration-500 sm:h-52 object-cover ${publicationDetail.thumbnailImage ? "w-full group-hover:scale-105" : "w-2/3 mx-auto"
                            }`}
                    />
                    <div className="relative px-2 bg-white">
                        <h3 className="mt-1 text-md font-medium text-gray-900">{`${publicationDetail.title}`}</h3>
                        <h3 className="mt-1 text-md font-medium text-gray-900">{`${publicationDetail.subCategoryName}`}</h3>
                        <h3 className="text-sm font-medium text-gray-900"> <span className='text-sm mr-2'>Published at :</span> {extractDate(publicationDetail.publishedAt)}</h3>
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}

export default PublicationPage