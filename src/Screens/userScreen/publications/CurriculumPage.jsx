import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { MdOutlineFileDownload } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import {
  downloadPublicationFile,
  getPublicationById,
} from "../../cmsScreen/cms-components/cms-publication/publicationApi";
import { extractDate, renderSafeHTML } from "../../../Components/utilityFunctions";
import PDFBookViewer from "./component/PDFBookViewer";

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
  const isPdfNotice = curriculumDetail.isFile === true && curriculumDetail.file;

  return (
    <Grid container justifyContent="center" className="bg-slate-50 min-h-screen py-8 px-4 lg:px-8">
      <Grid item xs={12} md={isPdfNotice ? 11 : 8} lg={isPdfNotice ? 10 : 6} className="space-y-6">
        
        {/* 1. PDF Book Reader Section */}
        {isPdfNotice && (
          <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <PDFBookViewer file={curriculumDetail.file} title={curriculumDetail.title} />
          </div>
        )}

        {/* 2. Curriculum Details Card */}
        <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-6 lg:p-8">
          
          {/* Image / Fallback (only shown if NOT a PDF notice) */}
          {!isPdfNotice && (
            <div className="w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-100 mb-6 flex-flex-row flex justify-center">
              <img
                src={imageSource}
                onError={handleImageError}
                alt="Curriculum"
                className="w-full max-w-xl h-auto max-h-[60vh] object-contain rounded-lg"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
                  {curriculumDetail.title || "No title available"}
                </h1>
                <div className="text-xs text-gray-500 mt-1 flex gap-2">
                  {curriculumDetail.subCategoryName && (
                    <span className="font-semibold text-gray-700">{curriculumDetail.subCategoryName}</span>
                  )}
                  <span>•</span>
                  <span>{curriculumDetail.categoryName || "Curriculum"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                <span className="text-xs font-semibold text-gray-700">
                  {curriculumDetail.publishedAt
                    ? extractDate(curriculumDetail.publishedAt)
                    : "Date not available"}
                </span>
              </div>
            </div>

            <div className="text-sm lg:text-base text-gray-700 leading-relaxed py-2">
              {curriculumDetail.description ? (
                <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(curriculumDetail.description) }} />
              ) : (
                "No curriculum details available !!"
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 gap-4">
              {curriculumDetail.isFile === true && curriculumDetail.file && (
                <button
                  onClick={() => downloadPublicationFile(curriculumDetail.file)}
                  className="inline-flex items-center gap-2 bg-[#1169bf] hover:bg-[#0b4d91] text-white font-semibold text-sm px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <MdOutlineFileDownload fontSize="20px" />
                  <span>Download</span>
                </button>
              )}

              <Link to="/curriculum" className="text-sm text-[#1169bf] hover:underline font-semibold">
                See all Curriculum
              </Link>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default CurriculumPage;
