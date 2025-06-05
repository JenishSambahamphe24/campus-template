

import { useState, useEffect } from 'react';
import { Carousel } from "@material-tailwind/react";
import { Box, Button, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { getAllGallery } from '../Screens/cmsScreen/cms-components/cms-gallery/galleryApii';
import { getAllLink } from '../Screens/cmsScreen/cms-components/cms-links/linkApi';
import { getAllTeams } from '../Screens/cmsScreen/cms-components/cms-team/teamApi';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = 'https://wallpapers.com/images/hd/college-graduation-pictures-bkjadfrg7up3uydl.jpg';
const defaultImageForPerson = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDmDK8ge-b5AHErZqPLw1gwN3_MtLI4hSkHA&s';

function Slider({ onLoad }) {
  const [newSlider, setNewSlider] = useState([]);
  const [allLinks, setAllLinks] = useState([]);
  const [chairmanInfo, setChairmanInfo] = useState({});
  const [chiefInfo, setChiefInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false); // New state for image loading

  // Helper function to construct image URLs properly
  const getImageUrl = (imagePath, folder = 'thumb') => {
    if (!imagePath || !IMAGE_URL) return null;
    const baseUrl = IMAGE_URL.endsWith('/') ? IMAGE_URL : `${IMAGE_URL}/`;
    return `${baseUrl}${folder}/${imagePath}`;
  };

  // Function to preload images
  const preloadImages = (imageUrls) => {
    return new Promise((resolve) => {
      let loadedCount = 0;
      const totalImages = imageUrls.length;

      if (totalImages === 0) {
        resolve();
        return;
      }

      imageUrls.forEach((url) => {
        const img = new Image();
        img.onload = img.onerror = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };
        img.src = url;
      });
    });
  };

  const fetchTeams = async () => {
    try {
      const response = await getAllTeams();
      const chairman = response.find(item => item.subCategory === 'Chairman') || {};
      const chief = response.find(item => item.subCategory === 'Campus Chief') || {};

      setChairmanInfo(chairman);
      setChiefInfo(chief);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setChairmanInfo({});
      setChiefInfo({});
    }
  };

  const fetchLinks = async () => {
    try {
      const response = await getAllLink();
      setAllLinks(response.filter(item => item.type === 'application'));
    } catch (error) {
      console.error('Error fetching links:', error);
      setAllLinks([]);
    }
  };
  
  const fetchSliderImages = async () => {
    try {
      const data = await getAllGallery();
      const sliderGallery = data.filter(item => item.galleryType === "Slider").sort((a, b) => b.id - a.id);
      
      const latestThreeSlider = sliderGallery.map(item => ({
        image: item.thumbnailImage,
        name: item.galleryName,
        description: item.galleryDescription
      }));

      const imageUrls = latestThreeSlider
        .map(item => getImageUrl(item.image))
        .filter(url => url !== null);

      imageUrls.push(defaultImage);

      await preloadImages(imageUrls);
      console.log('All images preloaded successfully');
      
      setNewSlider(latestThreeSlider);
      setImagesLoaded(true);
    } catch (error) {
      console.error('Error fetching slider images:', error);
      setNewSlider([]);
      setImagesLoaded(true); 
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      setImagesLoaded(false);

      try {
        await Promise.all([
          fetchTeams(),
          fetchLinks(),
          fetchSliderImages() // This now includes image preloading
        ]);

        // Small delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false);
          onLoad?.();
        }, 300);

      } catch (error) {
        console.error('Error loading slider data:', error);
        setIsLoading(false);
        setImagesLoaded(true);
        onLoad?.();
      }
    };

    loadAllData();
  }, [onLoad]);

  const handleImageError = (e, fallbackUrl) => {
    console.log('Image error occurred, using fallback');
    e.target.src = fallbackUrl;
  };

  // Show loading until both data and images are ready
  if (isLoading || !imagesLoaded) {
    return (
      <Box className="py-4 px-4 sm:px-6 md:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1169bf]"></div>
            <div className="text-lg">Loading images...</div>
          </div>
        </div>
      </Box>
    );
  }

  return (
    <Box className="py-4 px-4 sm:px-6 md:px-8">
      <Grid container spacing={2} sx={{ minHeight: { xs: 'auto' } }}>
        <Grid item xs={12} sm={6} md={6} lg={2.5} order={{ xs: 2, sm: 2, md: 2, lg: 1 }}>
          <fieldset className="flex flex-col border-2 border-[#1169bf] h-full justify-between text-xl rounded-lg">
            <div className="flex flex-col gap-1 text-sm">
              <h1 className="bg-[#1169bf] text-sm font-semibold text-white py-2 text-center border-b-2">
                Application under Implementation
              </h1>
              <div className="flex flex-col space-y-4 px-4 py-2">
                {allLinks.length >= 1 ? (
                  allLinks.slice(0, 4).map((item, index) => (
                    <Link
                      target='_blank'
                      key={index}
                      to={item.url}
                      className="bg-[#F36710] p-3 text-md text-white text-lg font-bold transition-colors duration-300 ease-in-out hover:bg-[#d55a0f]"
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  <h1 className="text-center text-sm py-4">No applications available</h1>
                )}
              </div>
            </div>
          </fieldset>
        </Grid>

        <Grid sx={{ height: { xs: '250px', sm: '300px', md: '350px', lg: '460px' } }} item xs={12} sm={12} md={12} lg={7} order={{ xs: 1, sm: 1, md: 1, lg: 2 }}>
          <Carousel autoplay={true} autoplayDelay={4000} loop={true}>
            {newSlider.length > 0 ? (
              newSlider.map((item, index) => {
                const imageUrl = getImageUrl(item.image);
                const hasCaption = item.name && item.name.trim() !== '';

                return (
                  <Box height="100%" key={index} sx={{ position: 'relative' }}>
                    <img
                      src={imageUrl || defaultImage}
                      className="h-full w-full object-cover"
                      onError={(e) => handleImageError(e, defaultImage)}
                      alt={item.name || `Slide ${index + 1}`}
                      loading="eager"
                      style={{ opacity: 1 }} // Ensure opacity is set to 1
                    />

                    {hasCaption && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4"
                        style={{ zIndex: 10 }}
                      >
                        <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                       
                      </div>
                    )}
                  </Box>
                );
              })
            ) : (
              <Box height="100%" sx={{ position: 'relative' }}>
                <img
                  src={defaultImage}
                  alt="Default slide"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <h3 className="text-lg font-semibold">Welcome</h3>
                </div>
              </Box>
            )}
          </Carousel>
        </Grid>

        {/* Right Panel - Team Info */}
        <Grid item xs={12} sm={6} md={6} lg={2.5} order={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
          <fieldset className="flex border-2 bg-[#1169bf] flex-col h-full justify-between text-xl rounded-lg px-4">
            <div className="flex flex-col gap-2 mt-3 text-sm">
              {/* Chairman Section */}
              <div className="mx-auto">
                <img
                  className="w-[110px] h-[100px] bg-red-900 rounded-[50%] mx-auto object-cover"
                  alt="Chairman"
                  src={chairmanInfo?.ppImage ? getImageUrl(chairmanInfo.ppImage, 'team') : defaultImageForPerson}
                  crossOrigin="anonymous"
                  onError={(e) => handleImageError(e, defaultImageForPerson)}
                />
                <p className="text-sm text-center  text-white tracking-tighter mt-2">
                  {`${chairmanInfo?.firstName || ""} ${chairmanInfo?.middleName || ""} ${chairmanInfo?.lastName || ""}`.trim() || "Chairman"}
                </p>
                <h1 className="text-sm text-white font-semibold text-center">Chairman</h1>
                <Link to="/message-from-chairman" className="block mt-2">
                  <button className="p-1 mx-auto border flex gap-2 border-slate-400 rounded-lg text-slate-700 hover:border-slate-800 hover:text-slate-900 hover:shadow transition duration-150">
                    <span className="text-xs text-white">View Message</span>
                  </button>
                </Link>
              </div>

              {/* Campus Chief Section */}
              <div className="mx-auto">
                <img
                  className="w-[110px] h-[100px] bg-stone-200 rounded-[50%] mx-auto object-cover"
                  alt="Campus Chief"
                  src={chiefInfo?.ppImage ? getImageUrl(chiefInfo.ppImage, 'team') : defaultImageForPerson}
                  onError={(e) => handleImageError(e, defaultImageForPerson)}
                />
                <p className="text-sm text-center text-white tracking-tighter mt-2">
                  {`${chiefInfo?.firstName || ""} ${chiefInfo?.middleName || ""} ${chiefInfo?.lastName || ""}`.trim() || "Campus Chief"}
                </p>
                <h1 className="text-sm font-semibold text-white text-center">Campus Chief</h1>
                <Link to="/message-from-campus_chief" className="block mt-2">
                  <button className="p-1 mx-auto border flex gap-2 border-slate-400 rounded-lg text-slate-700 hover:border-slate-800 hover:text-slate-900 hover:shadow transition duration-150">
                    <span className="text-xs text-white">View Message</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Team Link */}
            <Link
              style={{
                width: "100%",
                display: "flex",
                textDecoration: "none",
                justifyContent: "center",
                marginBottom: "5px"
              }}
              to="/team"
            >
              <Button sx={{ textTransform: "none" }} size="small" className="flex items-center gap-1">
                <span className='text-white flex items-center'>
                  College Management Team
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 ml-1 w-4"
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