import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import { getAllGallery } from '../../Screens/cmsScreen/cms-components/cms-gallery/galleryApii';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
import { videoIdParser } from '../utilityFunctions';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material';

const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNQFWmSUrapQhK9X9UyXp5mhc1rmSaumLIkw&s'

function VideoPlayer() {
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [activeTab, setActiveTab] = useState('image')
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllGallery()
            const videoGallery = data.filter(item => item.galleryType === "Video")
            const photoGallery = data.filter(item => item.galleryType === "Image")
            setImages(photoGallery)
            setVideos(videoGallery)
        };
        fetchData()
    }, [])

    return (
        <Grid container direction='column' rowGap='20px' columnGap='15px'>
            <Divider style={{ width: '100%', backgroundColor: '#c2c2c2', }} />
            <Grid container rowGap='20px' sm={12}>
                <Grid container gap='10px' justifyContent={isMobile ? 'flex-start' : 'flex-start'} rowGap='25px' sm={12} lg={5.8} >
                    <Grid className=' text-white' sm={12} >
                        <h1 className='inline-block p-1 bg-[#0368b0]  text-md'> Image Gallery</h1>
                    </Grid>
                    {
                        images.sort((a, b) => b.id - a.id).slice(0, 3).map((item, index) => (
                            <Grid key={index} mx={isMobile ? 'auto' : ''} item xs={10} sm={3}  >
                                <Link to={`/galleryGrid/${item.id}`} className="group relative m-0 flex h-[180px] w-full rounded-xl  ring-gray-900/5 sm:mx-auto sm:max-w-lg">
                                    <Grid className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-100 transition duration-300 ease-in-out  dark:border-gray-700 ">
                                        <img
                                            src={item.thumbnailImage ? `${IMAGE_URL}${item.thumbnailImage}` : defaultImage}
                                            className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center  transition duration-300 group-hover:scale-110"
                                            alt="Azores"
                                        />
                                    </Grid>
                                    <div className="absolute w-full bottom-[-10px] z-10 bg-[#F36710] rounded-b-lg  p-1">
                                        <h1 className="font-serif text-md font-bold text-center tracking-tighter line-clamp-1 text-white">{item.galleryName}</h1>
                                    </div>
                                </Link>
                            </Grid>
                        ))
                    }
                </Grid>
                <Divider orientation={isMobile ? 'horizontal' : 'vertical'} flexItem style={{ margin: '0 15px', backgroundColor: '#0368b0' }} />
                <Grid container gap='10px' justifyContent={isMobile ? 'flex-start' : 'flex-start'} rowGap='25px' sm={12} lg={5.8} >
                    <Grid className=' text-white' sm={12} >
                        <h1 className='inline-block p-1 bg-[#0368b0]  text-md'> Video Gallery</h1>
                    </Grid>
                    {videos.slice(0, 2).map((item, index) => {
                        const videoId = videoIdParser(item.videoUrl)
                        return (
                            <Grid key={index} mx={isMobile ? 'auto' : ''} item xs={10} sm={3}  >
                                <YouTube
                                    videoId={videoId}
                                    className="video-player"
                                    opts={{
                                        width: '100%',
                                        height: '180px'
                                    }}
                                />
                            </Grid>
                        );
                    })}
                </Grid>

            </Grid>
            <div className='w-full flex justify-center'>
                <Button sx={{ textTransform: 'none' }} size="small" variant="outlined" className="flex items-center gap-2">
                    <Link to='/gallery'>
                        <Typography >
                            More Gallery
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
        </Grid>
    )
}

export default VideoPlayer