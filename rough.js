import React, { useState, useEffect } from 'react'
import { Grid, Box, Typography, Button, Stack, Divider } from '@mui/material'
import { BsTwitterX } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { formatDate, formatDateShort } from '../../../Components/utilityFunctions';
import { getAllpublication, getPublicationById } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL


function NewsPage() {
    const [allNewsEvents, setAllNewsEvents] = useState([]);
    const [newsDetail, setNewsDetail] = useState({});
    const { id } = useParams()

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
    }, [])

    console.log(allNewsEvents)

    return (
        <Box>
            <Grid my='1rem' padding='10px 30px' spacing='20px' container>
                <Grid item xs='12' sm='1.5' display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                    <Stack width='5rem' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Date </Typography>
                        <Typography variant='subtitle2'>{formatDateShort(newsDetail.createdAt)}</Typography>
                        <Divider sx={{ color: 'red', marginTop: '10px' }} />
                    </Stack>
                    <Stack width='5rem' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Category </Typography>
                        <Typography variant='subtitle2'>{newsDetail.subCategoryName}</Typography>
                        <Divider sx={{ color: 'red', marginTop: '10px' }} />
                    </Stack>
                    <Stack width='5rem' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>social media</Typography>
                        <Stack mt='5px' direction='row' spacing='10px'>
                            <BsFacebook style={{ fontSize: '18px' }} />
                            <BsTwitterX style={{ fontSize: '18px' }} />
                            <FaLink style={{ fontSize: '18px' }} />
                        </Stack>
                        <Divider sx={{ color: 'red', marginTop: '10px' }} />
                    </Stack>
                </Grid>
                <Grid item xs='12' sm='6' >
                    <div className='mb-5'>
                        <h5 className='font-medium text-lg text-center'>{newsDetail.title}</h5>
                    </div>
                    <Grid container justifyContent='center'>
                        <img
                            alt=""
                            src={newsDetail.thumbnailImage ? `${IMAGE_URL}${newsDetail.thumbnailImage}` : defaultImage}
                            className="h-56  w-full  object-cover sm:h-64 lg:h-72"
                        />
                    </Grid>
                    <div
                        style={{ fontSize: '16px' }}
                        dangerouslySetInnerHTML={{ __html: newsDetail.description }}
                    />
                </Grid>
                <Grid item xs='12' md='4' sm='8' sx={{
                    ml: { lg: 4 }
                }}>
                    <div className='mb-5'>
                        <h5 className='font-medium text-lg text-center'>Popular News</h5>
                        <Divider />
                    </div>
                    <Stack spacing='1rem'>
                        <Grid item xs={12}  >
                            <div className="flex w-full overflow-hidden bg-gray-200 rounded-lg shadow-lg ">
                                <div
                                    className=" w-2/6  bg-cover"
                                    style={{
                                        backgroundImage: "url('https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80')",
                                    }}
                                ></div>
                                <div className="w-2/3 p-1 md:p-1">
                                    <h1 className="text-md font-bold text-gray-800 ">Backpack</h1>
                                    <p className="text-sm text-gray-700 line-clamp-2 ">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit In odit
                                    </p>
                                    <div className="flex text-sm items-center">
                                        1 august 20204
                                    </div>

                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}  >
                            <div className="flex w-full overflow-hidden bg-gray-200 rounded-lg shadow-lg ">
                                <div
                                    className=" w-2/6  bg-cover"
                                    style={{
                                        backgroundImage: "url('https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80')",
                                    }}
                                ></div>
                                <div className="w-2/3 p-1 md:p-1">
                                    <h1 className="text-md font-bold text-gray-800 ">Backpack</h1>
                                    <p className="text-sm text-gray-700 line-clamp-2 ">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit In odit
                                    </p>
                                    <div className="flex text-sm items-center">
                                        1 august 20204
                                    </div>

                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}  >
                            <div className="flex w-full overflow-hidden bg-gray-200 rounded-lg shadow-lg ">
                                <div
                                    className=" w-2/6  bg-cover"
                                    style={{
                                        backgroundImage: "url('https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80')",
                                    }}
                                ></div>
                                <div className="w-2/3 p-1 md:p-1">
                                    <h1 className="text-md font-bold text-gray-800 ">Backpack</h1>
                                    <p className="text-sm text-gray-700 line-clamp-2 ">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit In odit
                                    </p>
                                    <div className="flex text-sm items-center">
                                        1 august 20204
                                    </div>

                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}  >
                            <div className="flex w-full overflow-hidden bg-gray-200 rounded-lg shadow-lg ">
                                <div
                                    className=" w-2/6  bg-cover"
                                    style={{
                                        backgroundImage: "url('https://images.unsplash.com/photo-1494726161322-5360d4d0eeae?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80')",
                                    }}
                                ></div>
                                <div className="w-2/3 p-1 md:p-1">
                                    <h1 className="text-md font-bold text-gray-800 ">Backpack</h1>
                                    <p className="text-sm text-gray-700 line-clamp-2">
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit In odit Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos, nihil!
                                    </p>
                                    <div className="flex text-sm items-center">
                                        1 august 20204
                                    </div>

                                </div>
                            </div>
                        </Grid>
                        <Grid item justifyContent='flex-end' sm={12}>
                            <Link style={{ width: '100%' }} to='/news'>
                                <Button sx={{ textTransform: 'none', mt: '5px', mb: '30px', width: '50%' }} variant="outlined" className="flex  items-center gap-3 bg-red-900">
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