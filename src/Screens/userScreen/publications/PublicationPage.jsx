import { useState, useEffect } from "react";
import { Grid, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { extractDate } from "../../../Components/utilityFunctions";
import { getPublicationById } from "../../cmsScreen/cms-components/cms-publication/publicationApi";

const defaultImage = import.meta.env.VITE_DEFAULT_IMG;
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function PublicationPage() {
  const [imgError, setImgError] = useState(false);
  const [publicationDetail, setPublicationDetail] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublicationById(id);
      setPublicationDetail(data);
      setImgError(false);
    };
    fetchData();
  }, [id]);

  const handleImageError = () => {
    setImgError(true);
  };
  const getImageSource = () => {
    if (imgError) {
      return defaultImage;
    }
    if (
      publicationDetail.thumbnailImage &&
      publicationDetail.thumbnailImage.trim() !== null
    ) {
      return `${IMAGE_URL}/thumb/${publicationDetail.thumbnailImage}`;
    }
    return defaultImage;
  };

  const imageSource = getImageSource();
  const isDefaultImage = imageSource === defaultImage;
  console.log(imageSource);
  return (
    <Grid
      container
      className="px-10 sm:px-2 md:px-4 lg:px-20 py-10"
      display="flex"
      justifyContent="center"
      gap="10px"
    >
      <Grid
        display="flex"
        justifyContent="space-between"
        flexDirection="column"
        item
        xs={12}
        sm={7.4}
        md={8.3}
        lg={8.8}
        order={{ xs: 2, sm: 2, md: 2, lg: 1 }}
      >
        <div>
          <div
            style={{ fontSize: "16px" }}
            dangerouslySetInnerHTML={{
              __html:
                publicationDetail.description || "No details available !!",
            }}
          />
        </div>

        <Link to="/publication">
          <Button
            sx={{ textTransform: "none", mt: "30px" }}
            size="small"
            variant="outlined"
            className="flex items-center gap-3 bg-red-900"
          >
            See all Publications
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
      </Grid>

      <Grid
        item
        xs={12}
        sm={4.3}
        md={3.5}
        lg={3}
        className="border border-gray-100"
        order={{ xs: 1, sm: 1, md: 1, lg: 1 }}
      >
        <div className="full group relative block overflow-hidden">
          <img
            src={imageSource}
            onError={handleImageError}
            alt="Publication"
            className={`h-52 transition duration-500 sm:h-52 object-cover ${
              isDefaultImage ? "w-2/3 mx-auto" : "w-full group-hover:scale-105"
            }`}
          />
          <div className="relative px-2 bg-white">
            <h3 className="mt-1 text-md font-medium text-gray-900">
              {publicationDetail.title || "No title available"}
            </h3>
            <h3 className="mt-1 text-md font-medium text-gray-900">
              {publicationDetail.subCategoryName || "No subcategory"}
            </h3>
            <h3 className="text-sm font-medium text-gray-900">
              <span className="text-sm mr-2">Published at:</span>
              {publicationDetail.publishedAt
                ? extractDate(publicationDetail.publishedAt)
                : "Date not available"}
            </h3>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default PublicationPage;
