import { useState, useEffect } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import { useParams } from 'react-router-dom';
import { Grid, IconButton } from '@mui/material';
import { getGalleryById } from '../../cmsScreen/cms-components/cms-gallery/galleryApii';
import { useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function GalleryGrid() {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState({});
  const [imagesArray, setImagesArray] = useState([]);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery("(min-width:768px) and (max-width:1205px)");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGalleryById(id);
      setGalleryData(data);
      if (data?.images) {
        setImagesArray(data.images);
      }
    };
    fetchData();
  }, [id]);

  const handleImageClick = (index) => {
    if (mainSwiper) {
      // Adjust index if thumbnail exists to account for the first slide
      const adjustedIndex = galleryData?.gallery?.thumbnailImage ? index + 1 : index;
      mainSwiper.slideToLoop(adjustedIndex);
    }
  };

  useEffect(() => {
    if (imagesArray.length === 0) return;

    let swiperThumbs = null;
    if (!isSmallScreen) {
      swiperThumbs = new Swiper('.nav-for-slider', {
        loop: true,
        spaceBetween: 15,
        slidesPerView: isTablet ? 'auto' : 4,
        direction: isTablet ? 'horizontal' : 'vertical',
        on: {
          init: (swiper) => {
            setThumbsSwiper(swiper);
          },
        },
      });
    }

    const swiperMain = new Swiper('.main-slide-carousel', {
      slidesPerView: 1,
      effect: 'fade',
      loop: true,
      thumbs: !isSmallScreen ? {
        swiper: swiperThumbs,
      } : null,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      on: {
        init: (swiper) => {
          setMainSwiper(swiper);
        },
      },
    });

    return () => {
      if (swiperMain) swiperMain.destroy();
      if (swiperThumbs) swiperThumbs.destroy();
    };
  }, [imagesArray, isSmallScreen, isTablet, galleryData?.gallery?.thumbnailImage]);

  const handleNext = () => {
    if (mainSwiper) {
      mainSwiper.slideNext();
    }
  };

  const handlePrevious = () => {
    if (mainSwiper) {
      mainSwiper.slidePrev();
    }
  };

  console.log(imagesArray)

  return (
    <section className="relative px-4 sm:px-6 md:px-20 py-5">
      <div className="mx-auto max-w-8xl">
        <div className="mb-3">
          <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
            {galleryData?.gallery?.galleryName ? galleryData.gallery.galleryName : ''}
          </h2>
          <p className="w-full text-center text-md text-gray-600 font-normal leading-2">
            {galleryData?.gallery?.galleryDescription ? galleryData.gallery.galleryDescription : ''}
          </p>
        </div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={12} lg={9}>
            <div className="box w-full gallery">
              <div className="swiper main-slide-carousel swiper-container relative">
                <div className="swiper-wrapper">
                  {/* Only render thumbnail slide if thumbnail image exists */}
                  {galleryData?.gallery?.thumbnailImage && (
                    <div className="swiper-slide">
                      <div className="block bg-gray-700 w-auto mx-auto h-auto rounded-3xl">
                        <img
                          src={`${IMAGE_URL}/thumb/${galleryData.gallery.thumbnailImage}`}
                          alt="Gallery thumbnail"
                          className="gallery-image w-full h-[320px] md:h-[427px] mx-auto object-contain rounded-3xl"
                        />
                      </div>
                    </div>
                  )}
                  
                  {imagesArray.map((item, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="block bg-gray-700 w-auto mx-auto h-auto rounded-3xl">
                        <img
                          src={`${IMAGE_URL}/images/${item.image}`}
                          alt={`Gallery image ${index + 1}`}
                          className="gallery-image w-full h-[320px] md:h-[427px] mx-auto object-contain rounded-3xl"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add hidden navigation elements for Swiper to use */}
                <div className="swiper-button-next hidden"></div>
                <div className="swiper-button-prev hidden"></div>
              </div>
            </div>
          </Grid>

          {!isSmallScreen && (
            isTablet ? (
              <Grid item xs={12} className="mt-4">
                <div className="w-full overflow-x-auto">
                  <div className="nav-for-slider swiper-container">
                    <div className="swiper-wrapper flex flex-row">
                      {/* Only include thumbnail in navigation if it exists */}
                      {galleryData?.gallery?.thumbnailImage && (
                        <div
                          className="swiper-slide thumbs-slide !w-[120px] !h-[90px] flex-shrink-0"
                          onClick={() => handleImageClick(-1)} // Use -1 to indicate thumbnail
                        >
                          <img
                            src={`${IMAGE_URL}/thumb/${galleryData.gallery.thumbnailImage}`}
                            alt="Thumbnail"
                            className="gallery-image w-full cursor-pointer h-full rounded-2xl border-2 border-gray-200 transition-all duration-500 hover:border-indigo-600"
                          />
                        </div>
                      )}
                      {imagesArray.map((item, index) => (
                        <div
                          key={index}
                          className="swiper-slide thumbs-slide !w-[120px] !h-[90px] flex-shrink-0"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={`${IMAGE_URL}/images/${item.image}`}
                            alt={`Thumbnail image ${index + 1}`}
                            className="gallery-image w-full cursor-pointer h-full rounded-2xl border-2 border-gray-200 transition-all duration-500 hover:border-indigo-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Grid>
            ) : (
              <Grid item display='flex' sm={5} lg={2}>
                <div className="h-[440px] w-full overflow-auto">
                  <div className="nav-for-slider swiper-container">
                    <div className="swiper-wrapper">
                      {/* Only include thumbnail in navigation if it exists */}
                      {galleryData?.gallery?.thumbnailImage && (
                        <div
                          className="swiper-slide thumbs-slide lg:!w-4/5 md:!h-[135px] w-full h-[110px]"
                          onClick={() => handleImageClick(-1)} // Use -1 to indicate thumbnail
                        >
                          <img
                            src={`${IMAGE_URL}/thumb/${galleryData.gallery.thumbnailImage}`}
                            alt="Thumbnail"
                            className="gallery-image w-full cursor-pointer h-full rounded-2xl border-2 border-gray-200 transition-all duration-500 hover:border-indigo-600"
                          />
                        </div>
                      )}
                      {imagesArray.map((item, index) => (
                        <div
                          key={index}
                          className="swiper-slide thumbs-slide lg:!w-4/5 md:!h-[135px] w-full h-[110px]"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={`${IMAGE_URL}/images/${item.image}`}
                            alt={`Thumbnail image ${index + 1}`}
                            className="gallery-image w-full cursor-pointer h-full rounded-2xl border-2 border-gray-200 transition-all duration-500 hover:border-indigo-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Grid>
            )
          )}

          {isSmallScreen && (
            <>
              <IconButton
                onClick={handlePrevious}
                className="relative bg-[#f36710] shadow-md hover:bg-gray-100"
                aria-label="Previous image"
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNext}
                className="bg-white shadow-md hover:bg-gray-100"
                aria-label="Next image"
              >
                <ChevronRight />
              </IconButton>
            </>
          )}
        </Grid>
      </div>
    </section>
  );
}

export default GalleryGrid;