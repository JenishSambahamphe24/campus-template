

// import { useState, useEffect } from 'react';
// import Swiper from 'swiper';
// import 'swiper/css';
// import { useParams } from 'react-router-dom';
// import { Grid, IconButton } from '@mui/material';
// import { getGalleryById } from '../../cmsScreen/cms-components/cms-gallery/galleryApii';
// import { useMediaQuery } from '@mui/material';
// import { ChevronLeft, ChevronRight } from '@mui/icons-material';

// const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

// function GalleryGrid() {
//   const { id } = useParams();
//   const [galleryData, setGalleryData] = useState({});
//   const [imagesArray, setImagesArray] = useState([]);
//   const [uidString, setUidString] = useState('');
//   const [mainSwiper, setMainSwiper] = useState(null);
//   const [thumbsSwiper, setThumbsSwiper] = useState(null);
//   const isSmallScreen = useMediaQuery('(max-width: 768px)');

//   const isTablet = useMediaQuery("(min-width:768px) and (max-width:1205px)");

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getGalleryById(id);
//       setUidString(data.uuid);
//       setGalleryData(data);

//       if (data?.multipleImage) {
//         try {
//           const parsedImages = data.multipleImage;
//           setImagesArray(parsedImages);
//         } catch (error) {
//           console.error('Error parsing multipleImage:', error);
//         }
//       }
//     };
//     fetchData();
//   }, [id]);

//   const handleImageClick = (index) => {
//     if (mainSwiper) {
//       mainSwiper.slideToLoop(index);
//     }
//   };

//   useEffect(() => {
//     if (imagesArray.length === 0) return;

//     // Only initialize thumbs swiper if not on small screen
//     let swiperThumbs = null;
//     if (!isSmallScreen) {
//       swiperThumbs = new Swiper('.nav-for-slider', {
//         loop: true,
//         spaceBetween: 30,
//         slidesPerView: 4,
//         direction: 'vertical',
//         on: {
//           init: (swiper) => {
//             setThumbsSwiper(swiper);
//           },
//         },
//       });
//     }

//     const swiperMain = new Swiper('.main-slide-carousel', {
//       slidesPerView: 1,
//       effect: 'fade',
//       loop: true,
//       thumbs: !isSmallScreen ? {
//         swiper: swiperThumbs,
//       } : null,
//       navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//       },
//       on: {
//         init: (swiper) => {
//           setMainSwiper(swiper);
//         },
//       },
//     });

//     return () => {
//       if (swiperMain) swiperMain.destroy();
//       if (swiperThumbs) swiperThumbs.destroy();
//     };
//   }, [imagesArray, isSmallScreen]);

//   const handleNext = () => {
//     if (mainSwiper) {
//       mainSwiper.slideNext();
//     }
//   };

//   const handlePrevious = () => {
//     if (mainSwiper) {
//       mainSwiper.slidePrev();
//     }
//   };

//   return (
//     <section className="px-4 sm:px-6 md:px-20 relative py-5">
//       <div className="mx-auto max-w-8xl">
//         <div className="mb-3">
//           <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
//             {galleryData.galleryName}
//           </h2>
//           <p className="w-full text-center text-md text-gray-600 font-normal leading-2">
//             {galleryData.galleryDescription}
//           </p>
//         </div>
//         <Grid container spacing={2} justifyContent="center">
//           <Grid item xs={12} md={12} lg={8}>
//             <div className="box w-full gallery">
//               <div className="swiper main-slide-carousel swiper-container relative">
//                 <div className="swiper-wrapper">
//                   {imagesArray.map((item, index) => (
//                     <div key={index} className="swiper-slide">
//                       <div className="block bg-gray-700 w-auto mx-auto h-auto rounded-3xl">
//                         <img
//                           src={`${IMAGE_URL}${uidString}/${item}`}
//                           alt={`Gallery image ${index + 1}`}
//                           className="gallery-image w-full h-[320px] md:h-[427px] mx-auto object-contain rounded-3xl"
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Add hidden navigation elements for Swiper to use */}
//                 <div className="swiper-button-next hidden"></div>
//                 <div className="swiper-button-prev hidden"></div>
//               </div>
//             </div>
//           </Grid>

//           {!isSmallScreen ? (
//               <Grid item display='flex' sm={5} lg={3}>
//                 <div className="h-[440px] overflow-auto">
//                   <div className="nav-for-slider swiper-container">
//                     <div className="swiper-wrapper">
//                       {imagesArray.map((item, index) => (
//                         <div
//                           key={index}
//                           className="swiper-slide thumbs-slide lg:!w-4/5 md:!h-[135px] w-full h-[110px]"
//                           onClick={() => handleImageClick(index)}
//                         >
//                           <img
//                             src={`${IMAGE_URL}${uidString}/${item}`}
//                             alt={`Thumbnail image ${index + 1}`}
//                             className="gallery-image w-full cursor-pointer h-full rounded-2xl border-2 border-gray-200 transition-all duration-500 hover:border-indigo-600"
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </Grid>
//           ) : (
//             <Grid item xs={12} className="flex justify-center gap-4 mt-4">
//               <IconButton
//                 onClick={handlePrevious}
//                 className="bg-white shadow-md hover:bg-gray-100"
//                 aria-label="Previous image"
//               >
//                 <ChevronLeft />
//               </IconButton>
//               <IconButton
//                 onClick={handleNext}
//                 className="bg-white shadow-md hover:bg-gray-100"
//                 aria-label="Next image"
//               >
//                 <ChevronRight />
//               </IconButton>
//             </Grid>
//           )}
//         </Grid>
//       </div>
//     </section>
//   );
// }

// export default GalleryGrid;
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
  const [uidString, setUidString] = useState('');
  const [mainSwiper, setMainSwiper] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery("(min-width:768px) and (max-width:1205px)");

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

  useEffect(() => {
    if (imagesArray.length === 0) return;

    // Only initialize thumbs swiper if not on small screen
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
  }, [imagesArray, isSmallScreen, isTablet]);

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

  return (
    <section className="relative px-4 sm:px-6 md:px-20 relative py-5">
      <div className="mx-auto max-w-8xl">
        <div className="mb-3">
          <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
            {galleryData.galleryName}
          </h2>
          <p className="w-full text-center text-md text-gray-600 font-normal leading-2">
            {galleryData.galleryDescription}
          </p>
        </div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={12} lg={8}>
            <div className="box w-full gallery">
              <div className="swiper main-slide-carousel swiper-container relative">
                <div className="swiper-wrapper">
                  {imagesArray.map((item, index) => (
                    <div key={index} className="swiper-slide">
                      <div className="block bg-gray-700 w-auto mx-auto h-auto rounded-3xl">
                        <img
                          src={`${IMAGE_URL}${uidString}/${item}`}
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
              <Grid item xs={12}  className="mt-4">
                <div className="w-full  overflow-x-auto">
                  <div className="nav-for-slider  swiper-container">
                    <div className="swiper-wrapper flex  flex-row">
                      {imagesArray.map((item, index) => (
                        <div
                          key={index}
                          className="swiper-slide thumbs-slide !w-[120px] !h-[90px] flex-shrink-0"
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
                  </div>
                </div>
              </Grid>
            ) : (
              <Grid item display='flex' sm={5} lg={3}>
                <div className="h-[440px] overflow-auto">
                  <div className="nav-for-slider swiper-container">
                    <div className="swiper-wrapper">
                      {imagesArray.map((item, index) => (
                        <div
                          key={index}
                          className="swiper-slide thumbs-slide lg:!w-4/5 md:!h-[135px] w-full h-[110px]"
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
                  </div>
                </div>
              </Grid>
            )
          )}

          {isSmallScreen && (
            <>
              <IconButton
                onClick={handlePrevious}
                className="relative top-[px] bg-[#f36710] shadow-md hover:bg-gray-100"
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