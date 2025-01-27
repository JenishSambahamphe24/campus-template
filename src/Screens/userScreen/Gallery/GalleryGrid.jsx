import React, { useState, useEffect } from 'react';
import Swiper from 'swiper';
import 'swiper/css';
import { useParams } from 'react-router-dom';
import { Grid, Stack } from '@mui/material';
import { getGalleryById } from '../../cmsScreen/cms-components/cms-gallery/galleryApii';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

function GalleryGrid() {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState({});
  const [imagesArray, setImagesArray] = useState([]);
  const [uidString, setUidString] = useState('');
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getGalleryById(id);
      setUidString(data.uuid);
      setGalleryData(data);

   
      if (data?.multipleImage) {
        try {
          const parsedImages = data.multipleImage;
          setImagesArray(parsedImages);
        } catch (error) {
          console.error('Error parsing multipleImage:', error);
        }
      }
    };
    fetchData();
  }, [id]);

  const handleImageClick = (index) => {
    if (mainSwiper) {
      mainSwiper.slideToLoop(index); 
    }
  };

  console.log(imagesArray)

  useEffect(() => {
    const swiperThumbs = new Swiper('.nav-for-slider', {
      loop: true,
      spaceBetween: 30,
      slidesPerView: 4,
      on: {
        init: (swiper) => {
          setThumbsSwiper(swiper);
        },
      },
    });

    const swiperMain = new Swiper('.main-slide-carousel', {
      slidesPerView: 1,
      effect: 'fade',
      thumbs: {
        swiper: swiperThumbs,
      },
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
  }, [imagesArray]);

  return (
    <section className="px-20 relative py-5">
      <div className="mx-auto max-w-8xl px-4 sm:px-4 lg:px-2">
        <div className="mb-3"> 
          <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">{galleryData.galleryName}</h2>
          <p className="w-full text-center text-md text-gray-600 font-normal leading-2">{galleryData.galleryDescription}</p>
        </div>
        <Grid  container gap='20px' justifyContent='center'>
          <Grid item md={8} >
            <div className="box  w-full gallery">
              <div className="swiper main-slide-carousel swiper-container relative">
                <div className="swiper-wrapper">
                  {imagesArray.map((item, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="block bg-gray-700 w-auto mx-auto h-auto rounded-3xl">
                        <img
                          src={`${IMAGE_URL}${uidString}/${item}`}
                          alt={`Gallery image ${index + 1}`}
                          className="gallery-image w-full h-[427px] mx-auto object-contain rounded-3xl"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Grid>
          <Grid height='440px'  overflow='scroll' item={2}>
            <Stack dire className="nav-for-slider swiper-wrapper ">
              <div className="swiper-wrapper flex flex-col  gap-4 items-end ">
                {imagesArray.map((item, index) => (
                  <div
                    key={index}
                    className="swiper-slide thumbs-slide align- lg:!w-4/5 md:!h-[135px] w-full h-[110px]"
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={`${IMAGE_URL}${uidString}/${item}`}
                      alt={`Thumbnail image ${index + 1}`}
                      className="gallery-image w-full cursor-pointer h-full rounded-2xl border-2 border-gray-200 transition-all duration-500 hover:border-indigo-600"
                    />
                  </div>
                ))}
              </div>
            </Stack>
          </Grid>
        </Grid>


      </div>
    </section>
  );
}

export default GalleryGrid;
