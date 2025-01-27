import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Button } from '@mui/material'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { Link, useParams } from 'react-router-dom';
import YouTube from 'react-youtube';
import { getAllGallery } from '../../cmsScreen/cms-components/cms-gallery/galleryApii';
import { videoIdParser } from '../../../Components/utilityFunctions';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNQFWmSUrapQhK9X9UyXp5mhc1rmSaumLIkw&s'

function GalleryPage() {
    const { tab } = useParams();
    const [videos, setVideos] = useState([])
    const [imageGallery, setImageGallery] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllGallery()
            const videoGallery = data.filter(item => item.galleryType === 'Video')
            setVideos(videoGallery)
            const images = data.filter(item => item.galleryType === 'Image' && item.status === 'true' || item.status === true)
            setImageGallery(images)
        };
        fetchData()
    }, [])

    const [activeTab, setActiveTab] = React.useState(tab || "image");
    const data = [
        {
            label: "Image Gallery",
            value: "image",
        },
        {
            label: "Video gallery",
            value: "video",
        },
        {
            label: "Audio gallery",
            value: "audio",
        }
    ];

    return (
        <Grid container className='px-20' my='25px'>
                <h2 className="w-full text-center text-2xl font-bold text-gray-900  font-manrope leading-normal pb-4 ">Our Gallery</h2>

            <Grid mx='30px' item md={12}>
                <Tabs value={activeTab}>
                    <Grid item md={12} >
                        <TabsHeader
                            style={{ background: '#0368B0', color: 'white', zIndex: '1' }}
                            className='rounded'
                        >
                            {data.map(({ label, value }) => (
                                <Tab
                                    key={value}
                                    value={value}
                                    onClick={() => setActiveTab(value)}
                                    className={activeTab === value ? "text-gray-900" : ""}
                                >
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                    </Grid>

                    <TabsBody>
                        {
                            activeTab === 'image' ? (
                                <TabPanel style={{ padding: '0px', marginTop: '20px' }} value='image'>
                                    <Box sx={{ width: '100%' }}>
                                        <Grid container spacing='2rem'>
                                            {
                                                imageGallery.sort((a, b) => b.id - a.id).map((item, index) => (
                                                    <Grid key={index} item xs={12} sm={6} md={3}>
                                                        <Link to={`/galleryGrid/${item.id}`} className="group relative m-0 flex h-72 w-full rounded-xl  ring-gray-900/5 sm:mx-auto sm:max-w-lg">
                                                            <div className="z-10 h-full w-full overflow-hidden rounded-xl border border-gray-200  transition duration-300 ease-in-out group-hover:opacity-100 dark:border-gray-700 ">
                                                                <img
                                                                    src={item.thumbnailImage ? `${IMAGE_URL}${item.thumbnailImage}` : defaultImage}
                                                                    className="animate-fade-in block h-full w-full scale-100 transform object-cover object-center opacity-100 transition duration-300 group-hover:scale-110"
                                                                    alt="Azores"
                                                                />
                                                            </div>
                                                            <div className="absolute  rounded-b-xl w-[100%] bg-[#F36710]  p-2  bottom-0 z-20 text-center text-white">
                                                                <h1  className="font-serif text-md font-bold text-center tracking-tighter line-clamp-1 text-white">{item.galleryName}</h1>
                                                            </div>
                                                        </Link>
                                                    </Grid>
                                                ))
                                            }
                                        </Grid>
                                    </Box>
                                </TabPanel>
                            ) :
                                (
                                    <TabPanel value='video' style={{ padding: '0px', marginTop: '20px' }}>
                                        <Grid container spacing='20px'>
                                            {videos.map((item, index) => {
                                                const videoId = videoIdParser(item.videoUrl)
                                                return (
                                                    <Grid key={index} item sm={4}>
                                                        <YouTube
                                                            videoId={videoId}
                                                            className="video-player"
                                                            opts={{
                                                                width: '100%',
                                                                height: '300px'
                                                            }}
                                                        />
                                                    </Grid>
                                                );
                                            })}

                                        </Grid>
                                    </TabPanel>
                                )
                        }
                    </TabsBody>
                </Tabs>
            </Grid>

        </Grid >
    )
}

export default GalleryPage