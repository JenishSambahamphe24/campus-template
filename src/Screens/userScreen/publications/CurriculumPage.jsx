import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import {
  downloadPublicationFile,
  getPublicationById,
} from "../../cmsScreen/cms-components/cms-publication/publicationApi";
import { extractDate, extractPlainText } from "../../../Components/utilityFunctions";
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

function CurriculumPage() {
  const { id } = useParams();
  const [imgError, setImgError] = useState(false);

  const [curriculumDetail, setCurriculumDetail] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPublicationById(id);
      setCurriculumDetail(data);
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
      curriculumDetail.thumbnailImage &&
      curriculumDetail.thumbnailImage.trim() !== null
    ) {
      return `${IMAGE_URL}/thumb/${curriculumDetail.thumbnailImage}`;
    }
    return defaultImage;
  };

  const imageSource = getImageSource();

  return (
    <Grid container justifyContent="center">
      <Grid item className="p-16">
        <div className="w-sm bg-white border border-gray-200 rounded-lg shadow-sm">
          <img
            src={imageSource}
            onError={handleImageError}
            alt="Curriculum"
            className="w-full h-72 object-cover rounded-t-lg"
          />

          <div className="px-5 mt-4 pb-5">
            <h5 className="text-l font-semibold tracking-tight text-gray-900">
              {curriculumDetail.title || "No title available"}
            </h5>
            <div className="text-sm text-gray-600 mt-2">
              {curriculumDetail.subCategoryName && (
                <div>{curriculumDetail.subCategoryName}</div>
              )}
              <div>{curriculumDetail.categoryName || "Curriculum"}</div>
            </div>

            <div className="flex items-center mt-2.5 mb-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm">
                {curriculumDetail.publishedAt
                  ? extractDate(curriculumDetail.publishedAt)
                  : "Date not available"}
              </span>
            </div>

            <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
              {extractPlainText(curriculumDetail.description) ||
                "No curriculum details available !!"}
            </div>

            {curriculumDetail.isFile === true && curriculumDetail.file && (
              <button
                onClick={() => downloadPublicationFile(curriculumDetail.file)}
                className="flex items-center text-[#1169bf] hover:text-[#0d47a1] mb-3"
              >
                <span>Download</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4 ml-1"
                >
                  <path d="M12 16l4-4h-3V4h-2v8H8l4 4z" />
                  <path d="M20 18H4v2h16v-2z" />
                </svg>
              </button>
            )}

            <Link to="/curriculum" className="text-sm text-[#1169bf] hover:underline">
              See all Curriculum
            </Link>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default CurriculumPage;
