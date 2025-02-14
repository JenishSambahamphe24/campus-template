import React, { useState, useEffect } from 'react'
import { Grid, Box, Typography, Button, Stack, Divider } from '@mui/material'
import { BsTwitterX } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { formatDateShort, cleanDescription } from '../../../Components/utilityFunctions';
import { getAllpublication, getPublicationById } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL


function NewsPage() {
    const [allNewsEvents, setAllNewsEvents] = useState([]);
    const [newsDetail, setNewsDetail] = useState({});
    const { id } = useParams()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const imageForSideCard = 'https://media.istockphoto.com/id/1407890983/vector/newspaper-realistic-vector-illustration-background-of-the-page-headline-and-cover-of-old.jpg?s=612x612&w=0&k=20&c=uyB-_t4SbgkZxpc2CPk8_ELgNcnHTuUBPenHTIiRZIc='

    const defaultImage = 'https://media.istockphoto.com/id/1389157460/photo/newspaper-and-digital-tablet-on-wooden-table.jpg?s=612x612&w=0&k=20&c=CNKIHIEE4HnEnqDpUCyvnEfbf8nn90jRfX6TmhbGBxc='

    useEffect(() => {
        const fetchAllNewsData = async () => {
            const data = await getAllpublication()
            const allData = data.filter((item) => item.categoryName === 'News and Events')
            setAllNewsEvents(allData)
        };
        const fetchData = async () => {
            const data = await getPublicationById(id)
            setNewsDetail(data)
        };
        fetchData()
        fetchAllNewsData()
    }, [newsDetail])

    return (
        <Box>
            <Grid position='relative' item xs={12}>
                <div className="mx-auto">
                    <img
                        src={newsDetail.thumbnailImage ? `${IMAGE_URL}${newsDetail.thumbnailImage}` : defaultImage}
                        className="h-[250px] w-full object-cover"
                        alt="..." />
                </div>
                <Box width={isMobile ? '100%' : '70%'} sx={{ position: 'absolute', bottom: '20%', padding: '20px', marginLeft: '20px', borderLeft: '10px solid yellowgreen', }}>
                    <h1 className='text-white text-2xl font-bold'>
                        {newsDetail.title}
                    </h1>
                </Box>
            </Grid>

            <Grid container className='px-4 lg:px-20 mx-auto' spacing='15px' my='20px'>
                <Grid item xs={12} sm={12} lg='2' rowGap='20px' display='flex' flexDirection={isMobile ? 'row' : 'column'} justifyContent={isMobile ? 'space-between' : 'flex-start'} >
                    <Stack width='100%' spacing='5px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Published Date </Typography>
                        <Typography variant='subtitle2'>
                            {`${formatDateShort(newsDetail.createdAt)}`}
                        </Typography>
                    </Stack>
                    <Stack width='100%' spacing='5px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Category </Typography>
                        <Typography variant='subtitle2'>
                            {newsDetail.subCategoryName}
                        </Typography>
                    </Stack>
                    <Stack width='100%' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>social media</Typography>
                        <Stack direction='row' mt={isMobile ? '-10px' : '0'} spacing='10px'>
                            <Link to="https://www.facebook.com/www.aepc.gov.np/"
                                target="_blank">
                                <BsFacebook style={{ fontSize: '18px' }} />
                            </Link>
                            <Link to='https://x.com/i/flow/login?redirect_after_login=%2FRerlNepal' >
                                <BsTwitterX style={{ fontSize: '18px' }} />
                            </Link>
                            <Link>
                                <FaLink style={{ fontSize: '18px' }} />
                            </Link>
                        </Stack>
                    </Stack>
                </Grid>
                {
                    isMobile && (
                            <Divider  style={{ width: '100%', backgroundColor: '#c2c2c2', marginBlock: '10px' }} />
                    )
                }
                <Grid display='flex' flexDirection='column' item md={7}>
                    <Typography variant='h5' mb={4} fontSize='18px' fontWeight='bold'> {newsDetail.title} </Typography>
                    <Stack direction='column' spacing='20px'>
                        <div
                            style={{ fontSize: '16px' }}
                            dangerouslySetInnerHTML={{ __html: cleanDescription(newsDetail.description) }}
                        />
                    </Stack>
                </Grid>

                <Grid item xs='12'   sx={{ minHeight: '94px' }}  >
                    <div className='mb-3 bg-[#0368b0]'>
                        <h5 className='font-medium text-lg text-center text-white py-1'>Latest News</h5>
                    </div>
                    <Stack spacing='1rem'>
                        {
                            allNewsEvents.filter(item => item.id !== Number(id)).sort((a, b) => b.id - a.id).slice(0, 4).map((item, index) => (
                                <Link key={index} to={`/news/${item.id}`}>
                                    <Grid item xs={12}  >
                                        <div className="flex w-full overflow-hidden bg-gray-200 rounded-lg shadow-lg ">
                                            <img
                                                className=" w-2/6  bg-cover"
                                                style={{
                                                    backgroundImage: `url(${item.thumbnailImage ? `${IMAGE_URL}${item.thumnailImage}` : imageForSideCard})`
                                                }}
                                                onError={(e) => { e.target.src = imageForSideCard }}
                                            />
                                            <div className="w-2/3 p-1 md:p-1">
                                                <h1 className="line-clamp-1 text-[14px] font-bold text-gray-800 ">{item.title}</h1>
                                                <p className="text-sm text-gray-700 line-clamp-2 ">
                                                    <div
                                                        style={{ fontSize: '16px' }}
                                                        dangerouslySetInnerHTML={{ __html: cleanDescription(item.description) }}
                                                    />
                                                </p>
                                                <div className="flex text-sm items-center">
                                                    {formatDateShort(item.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                </Link>
                            ))
                        }

                        <Grid item justifyContent='flex-end' sm={12}>
                            <Link style={{ width: '100%' }} to='/news'>
                                <Button sx={{ textTransform: 'none', mt: '5px', mb: '30px', width: '100%' }} variant="outlined" className="flex  items-center gap-3 bg-red-900">
                                    view all
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
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    )
}

export default NewsPage