import React, { useState, useEffect } from 'react';
import { Carousel } from "@material-tailwind/react";
import { Box, Button, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { getAllGallery } from '../Screens/cmsScreen/cms-components/cms-gallery/galleryApii';
import { getAllLink } from '../Screens/cmsScreen/cms-components/cms-links/linkApi';
import { getAllTeams } from '../Screens/cmsScreen/cms-components/cms-team/teamApi';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const defaultImage = 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80';

function Slider() {
  const [newSlider, setNewSlider] = useState([]);
  const [allLinks, setAllLinks] = useState([])
  const [chairmanInfo, setChairmanInfo] = useState({})
  const [chiefInfo, setChiefInfo] = useState({})

  const fetchTeams = async () => {
    const response = await getAllTeams()
    console.log(response)
    setChairmanInfo(response.find(item => item.subCategory === 'Chairman'))
    setChiefInfo(response.find(item => item.subCategory === 'Campus Chief'))
  }

  const fetchLinks = async () => {
    const response = await getAllLink()
    setAllLinks(response.filter(item => item.type === 'application'))
  }

  const fetchSliderImages = async () => {
    const data = await getAllGallery();
    const sliderGallery = data.filter(item => item.galleryType === "Slider").sort((a, b) => b.id - a.id);
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
    <Box className="py-4 px-4 sm:px-6 md:px-8">
      <Grid container spacing={2} sx={{ minHeight: { xs: 'auto', lg: '400px' } }}>
        <Grid item xs={12} sm={6} md={6} lg={2.5} order={{ xs: 2, sm: 2, md: 2, lg: 1 }}>
          <fieldset className="flex flex-col border-2 border-[#1169bf] h-full justify-between text-xl rounded-lg">
            <div className="flex flex-col gap-1 text-sm">
              <h1 className="bg-[#1169bf] text-sm font-semibold text-white py-2 text-center border-b-2">
                Application under Implementation
              </h1>
              <div className="flex flex-col space-y-4 px-4 py-2">
                {allLinks.length >= 1 ? (
                  allLinks.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      className="bg-[#F36710] p-3 text-md text-white text-lg font-bold transition-colors duration-300 ease-in-out"
                    >
                      {item.name}
                    </a>
                  ))
                ) : (
                  <h1 className="text-center text-sm py-4">No any items !!</h1>
                )}
              </div>
            </div>
          </fieldset>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={7} order={{ xs: 1, sm: 1, md: 1, lg: 2 }}>
          <Box sx={{ height: { xs: '250px', sm: '300px', md: '350px', lg: '400px' } }}>
            <Carousel autoplay={true} autoplayDelay={4000} loop={true} >
              {newSlider.length > 0 ? (
                newSlider.map((item, index) => (
                  <Box height="100%" key={index}>
                    <img
                      src={`${IMAGE_URL}/${item.image}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                      alt={`Slide ${index + 1}`}
                    />
                  </Box>
                ))
              ) : (
                <img
                  src={defaultImage}
                  alt="default-slide"
                  className="h-full w-full object-cover"
                />
              )}
            </Carousel>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={6} lg={2.5} order={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
          <fieldset className="flex border-2  bg-[#1169bf] flex-col h-full justify-between text-xl rounded-lg px-4">
            <div className="flex flex-col gap-2 mt-3 text-sm">
              <div className="mx-auto ">
                <img
                  className="w-[110px] h-[100px] bg-red-900 rounded-[50%] mx-auto object-contain"
                  alt="Chairman"
                  src={chairmanInfo?.ppImage ? `${IMAGE_URL}${chairmanInfo?.ppImage}` : defaultImage}
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
                <p className="text-sm text-center text-white tracking-tighter">
                  {`${chairmanInfo?.firstName || ""} ${chairmanInfo?.middleName || ""} ${chairmanInfo?.lastName || ""}`}
                </p>
                <h1 className="text-sm text-white font-semibold text-center">Chairman</h1>
                <Link to="/message-from-chairman">
                  <button className="p-1 mx-auto border flex gap-2 border-slate-400 rounded-lg text-slate-700 hover:border-slate-800 hover:text-slate-900 hover:shadow transition duration-150">
                    <span className="text-xs text-white">View Message</span>
                  </button>
                </Link>
              </div>

              {/* Campus Chief Info */}
              <div className="mx-auto">
                <img
                  className="w-[110px] h-[100px] bg-red-900 rounded-[50%] mx-auto object-contain"
                  alt="Campus Chief"
                  src={chiefInfo?.ppImage ? `${IMAGE_URL}${chiefInfo?.ppImage}` : defaultImage}
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
                <p className="text-sm text-center text-white tracking-tighter">
                  {`${chiefInfo?.firstName || ""} ${chiefInfo?.middleName || ""} ${chiefInfo?.lastName || ""}`}
                </p>
                <h1 className="text-sm font-semibold text-white text-center">Campus Chief</h1>
                <Link to="/message-from-campus_chief">
                  <button className="p-1 mx-auto border flex gap-2 border-slate-400 rounded-lg text-slate-700 hover:border-slate-800 hover:text-slate-900 hover:shadow transition duration-150">
                    <span className="text-xs text-white">View Message</span>
                  </button>
                </Link>
              </div>
            </div>

            <Link
              style={{ width: "100%", display: "flex", textDecoration: "none", justifyContent: "center", marginBottom: "5px" }}
              to="/team"
            >
              <Button sx={{ textTransform: "none" }} size="small" className="flex  items-center gap-1">
                <span className='text-white flex'>
                  College Management Team
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 mt-1 ml-1 w-4"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </span>
              </Button>
            </Link>
          </fieldset>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Slider;