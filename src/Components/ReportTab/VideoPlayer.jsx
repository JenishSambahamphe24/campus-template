import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import { Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import { getAllGallery } from '../../Screens/cmsScreen/cms-components/cms-gallery/galleryApii';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
import { videoIdParser } from '../utilityFunctions';

const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNQFWmSUrapQhK9X9UyXp5mhc1rmSaumLIkw&s'

function VideoPlayer() {
    const [images, setImages] = useState([])
    const [videos, setVideos] = useState([])
    const [activeTab, setActiveTab] = useState('image')
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

            <Grid container sm={12}>
                <Grid container sm={6} >
                    {
                        images.sort((a, b) => b.id - a.id).slice(0, 3).map((item, index) => (
                            <Grid key={index} item sm={4}  >
                                <h1 className='text-xl mb-2'>
                                    Image Gallery
                                </h1>
                                <Link to={`/galleryGrid/${item.id}`} className="group relative m-0 flex h-[200px] w-full rounded-xl  ring-gray-900/5 sm:mx-auto sm:max-w-lg">
                                    <Grid className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200 opacity-80 transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 dark:opacity-70">
                                        <img
                                            src={item.thumbnailImage ? `${IMAGE_URL}${item.thumbnailImage}` : defaultImage}
                                            className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                                            alt="Azores"
                                        />
                                    </Grid>
                                    <div className="absolute bottom-[-10px] z-20 m-0 pb-4 ps-4 transition duration-300 ease-in-out group-hover:-translate-y-1 group-hover:translate-x-3 group-hover:scale-110">
                                        <h1 className="font-serif text-md font-bold text-zinc-950  line-clamp-1 ">{item.galleryName}</h1>
                                    </div>
                                </Link>
                            </Grid>
                        ))
                    }
                </Grid>
                <Grid container sm={6} >
                    {videos.slice(0, 2).map((item, index) => {
                        const videoId = videoIdParser(item.videoUrl)
                        return (
                            <Grid key={index} item sm={4}>
                                <h1 className='text-xl mb-2'>
                                    Video Gallery
                                </h1>
                                <YouTube
                                    videoId={videoId}
                                    className="video-player"
                                    opts={{
                                        width: '100%',
                                        height: '200px'
                                    }}
                                />
                            </Grid>
                        );
                    })}
                </Grid>

            </Grid>

        </Grid>
    )
}

export default VideoPlayer