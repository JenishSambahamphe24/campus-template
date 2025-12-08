import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { getAllaboutUs } from "../../Screens/cmsScreen/cms-components/cms-aboutUs/aboutsAPI";
import { getAllGallery } from "../../Screens/cmsScreen/cms-components/cms-gallery/galleryApii";
import { Grid } from "@mui/material";
import { renderSafeHTML, videoIdParser } from "../utilityFunctions";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

function Introduction() {
  const [data, setData] = useState({});
  const [videos, setVideos] = useState([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch About Us data
        const aboutUsResult = await getAllaboutUs();
        
        const introData = aboutUsResult.find(
          (item) => item.heading === "Introduction" 
        );
        setData(introData || {});

        // Fetch Gallery data
        const galleryResult = await getAllGallery();
        const videoGallery = galleryResult.filter(
          (item) => item.galleryType === "Video" && item.isIntroVideo === 1 
        );
        setVideos(videoGallery);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData({});
        setVideos([]);
      }
    };

    fetchData();
  }, []);

  const handleImageError = () => {
    setImgError(true);
  };
  const imageSource = imgError
    ? defaultImage
    : data.aboutUsImage
    ? `${IMAGE_URL}/aboutUs/${data.aboutUsImage}`
    : defaultImage;
  
  return (
    <Grid container sm={12} className="p-4 lg:px-20 lg:py-6">
      {/* Heading */}
      <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
        Introduction
      </h2>

      {/* Card Container */}
      <div className="bg-white md:p-5 rounded-xl  border border-gray-100 w-full max-w-5xl mx-auto flex flex-col gap-6 mt-5 p-5">
        {/* Video Row (full width if exists) */}
        {videos && videos.length > 0 && (
          <div className="w-full overflow-hidden shadow-lg h-80">
            {videos.slice(0, 1).map((item, index) => {
              const videoId = videoIdParser(item.videoUrl);
              if (!videoId) return null;

              return (
                <YouTube
                  key={index}
                  videoId={videoId}
                  className="w-full h-full rounded-lg overflow-hidden shadow-lg"
                  opts={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Image + Description Row */}
        {(imageSource || data.description) && (
          <div className="w-full">
            {/* For larger screens */}
            <div className="hidden md:block">
              {imageSource && (
                <div className={`overflow-hidden group h-60 mt-5 ${data.description ? "float-left w-1/3 mr-6 mb-4" : "w-full flex justify-center"}`}>
                  <img
                    src={imageSource}
                    alt="Campus Logo"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
                    onError={handleImageError}
                  />
                </div>
              )}

              {data.description && (
                <div className="text-gray-900 text-base md:text-md tracking-wide leading-relaxed font-sans">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderSafeHTML(data.description),
                    }}
                  />
                </div>
              )}
            </div>

            {/* For mobile */}
            <div className="md:hidden flex flex-col gap-6">
              {imageSource && (
                <div className="w-full overflow-hidden group h-60 mt-2">
                  <img
                    src={imageSource}
                    alt="Campus Logo"
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out transform group-hover:scale-105"
                    onError={handleImageError}
                  />
                </div>
              )}

              {data.description && (
                <div className="text-gray-900 text-base tracking-wide leading-relaxed font-sans">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderSafeHTML(data.description),
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Grid>
  );
}

export default Introduction;