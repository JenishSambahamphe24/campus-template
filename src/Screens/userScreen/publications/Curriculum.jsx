import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { MdOutlineFileDownload, MdSchool } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  downloadPublicationFile,
  getAllpublication,
} from "../../cmsScreen/cms-components/cms-publication/publicationApi";
import ReusablePagination from "../ReusablePagination";
import {
  cleanDescription,
  formatDate,
} from "../../../Components/utilityFunctions";

const FILE_URL = import.meta.env.VITE_FILE_URL;
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

function Curriculum() {
  const [allCurriculum, setAllCurriculum] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchdata = async () => {
      const data = await getAllpublication();
      const filteredData = data.filter(
        (item) => item.categoryName === "Curriculum"
      );
      setAllCurriculum(filteredData);
    };
    fetchdata();
  }, []);

  const totalPages = Math.ceil(allCurriculum.length / itemsPerPage);
  const indexOfLastItem = itemsPerPage * currentPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = allCurriculum.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  console.log(paginatedItems);
  const NoCurriculumMessage = () => (
    <Grid
      item
      xs={12}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="bg-blue-50 rounded-lg p-6 text-center max-w-md shadow-md">
        <MdSchool className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Curriculum Available
        </h3>
        <p className="text-gray-600">
          Please check back later or contact the admin to upload curriculum
          materials.
        </p>
      </div>
    </Grid>
  );
  console.log(paginatedItems);
  return (
    <Grid container sm={12} className="p-4 lg:px-20 lg:py-6">
      <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
        Our Curriculum
      </h2>
      <Grid mt="10px" container mx="20px" spacing="20px">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item, index) => (
            <Grid key={index} item xs={12} sm={4} lg={3}>
              <article
                style={{ minHeight: "220px" }}
                className="bg-gray-200 hover:bg-gray-300 overflow-hidden rounded-lg border border-gray-400 shadow-sm transition-transform transform hover:scale-105 hover:cursor-pointer"
              >
                <Link to={`/curriculum/${item.id}`}>
                  <img
                    alt=""
                    src={
                      item.thumbnailImage
                        ? `${IMAGE_URL}/thumb/${item.thumbnailImage}`
                        : defaultImage
                    }
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                    className="h-56 w-full object-cover"
                  />
                  <div className="p-1 sm:p-2" />
                </Link>
                <div className="flex px-2 pb-2">
                  {item.isFile && (
                    <>
                      <a
                        onClick={() => downloadPublicationFile(item.file)}
                        className="group inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
                      >
                        Download
                        <MdOutlineFileDownload fontSize="18px" />
                      </a>
                      <span className="mx-1 text-gray-400">|</span>
                    </>
                  )}
                  <span className="text-blue-500 text-md">
                    {formatDate(item.publishedAt)}
                  </span>
                  
                </div>
                <div className="px-2 pb-2">
                  <h1 className="text-lg line-clamp-1">{item.title} </h1>
                </div>
              </article>
            </Grid>
          ))
        ) : (
          <NoCurriculumMessage />
        )}
      </Grid>

      {paginatedItems.length > 0 && (
        <ReusablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
        />
      )}
    </Grid>
  );
}

export default Curriculum;
