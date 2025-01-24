import React, { useState, useEffect } from 'react';
import { Carousel, } from "@material-tailwind/react";
import { Box, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { getAllGallery } from '../Screens/cmsScreen/cms-components/cms-gallery/galleryApii';
import { getAllLink } from '../Screens/cmsScreen/cms-components/cms-links/linkApi';
import { getAllTeams } from '../Screens/cmsScreen/cms-components/cms-team/teamApi';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const defaultImage = 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80';

function Slider() {
  const [newSlider, setNewSlider] = useState([]);
  const [allLinks, setAllLinks] = useState([])
  const [teams, setTeams] = useState([])

  const fetchTeams = async () => {
    const response = await getAllTeams()
    setTeams(response.filter(item => item.index === 1))
  }
  const fetchLinks = async () => {
    const response = await getAllLink()
    setAllLinks(response)
  }

  const fetchSliderImages = async () => {
    const data = await getAllGallery();
    const sliderGallery = data.filter(item => item.galleryType === "Slider").sort((a, b) => b.id - a.id).slice(0, 2);
    const latestThreeSlider = sliderGallery.map(item => ({
      image: item.thumbnailImage,
      name: item.galleryName,
      description: item.galleryDescription
    }));
    setNewSlider(latestThreeSlider);
  };

  useEffect(() => {
    fetchTeams()
    fetchLinks()
    fetchSliderImages()
  }, []);

  return (
    <div className="grid grid-cols-10 mt-1 grid-rows-4 gap-2  px-2 h-[400px]">
      {/* application */}
      <div className="col-span-2 row-span-4 ">
        <fieldset className="flex flex-col border h-full justify-between text-xl max-w-md rounded-lg px-4 min-h-[100%]">
          <div className="flex flex-col gap-1 text-sm">
            <h1 className="px-1 text-lg font-semibold mt-3 text-center">  External Links</h1>
            {
              allLinks.length >= 1 ? (
                allLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-300 ease-in-out hover:text-red-600"
                  >
                    {item.name}
                  </a>
                ))
              )
                :
                (
                  <h1 className='text-center text-sm'> No any items !!</h1>
                )
            }
          </div>
        </fieldset>
      </div>
      {/* image */}

      <div className="col-span-6 row-span-4 col-start-3 row-start-1">
        <Carousel className="relative ">
          {newSlider.length > 0 ? newSlider.map((item, index) => (
            <Box height='100%' key={index} >
              <img
                src={`${IMAGE_URL}/${item.image}`}
                className="h-full w-full object-cover"
                onError={(e) => { e.target.src = defaultImage; }}
              />
            </Box>
          )) : (
            <img
              src={defaultImage}
              alt="default-slide"
              className="h-full w-full object-cover"
            />
          )}
        </Carousel>
      </div>

      <div className="col-span-2 row-span-4 ">
        <fieldset className="flex border flex-col h-full justify-between text-xl max-w-md rounded-lg px-4 min-h-[100%]">
          <div className="flex flex-col gap-1 text-sm">
            <h1 className="px-1 text-lg font-semibold mt-3 text-center">  Our pillars of Excellence</h1>
            {
              teams.map((item, index) => (
                <div key={index} className='mx-auto'>
                  <img
                    className='w-[160px] h-[120px] object-cover'
                    alt=""
                    src={item.ppImage ? `${IMAGE_URL}${item.ppImage}` : defaultImage}
                  />
                  <h1 className='text-sm font-semibold text-center'>Chairman</h1>
                  <p className='text-sm text-center tracking-tighter'> {`${item.firstName} ${item.middleName} ${item.lastName}`}</p>
                </div>
              ))
            }
          </div>
          <Link style={{ width: '100%', display: 'flex', textDecoration: 'none', justifyContent: 'center', marginBottom: '5px' }} to='/team'>
            <Button sx={{ textTransform: 'none', }} size='small' className="flex  items-center gap-1">
              View team
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
        </fieldset>
      </div>
    </div >

  );
}

export default Slider;
