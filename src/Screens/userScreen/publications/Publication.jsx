import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { MdOutlineFileDownload, MdLibraryBooks } from "react-icons/md";
import { Link } from "react-router-dom";
import PaginationForReports from "./component/PaginationForReports";
import {
  downloadPublicationFile,
  getAllpublication,
} from "../../cmsScreen/cms-components/cms-publication/publicationApi";
import { extractDate } from "../../../Components/utilityFunctions";

const FILE_URL = import.meta.env.VITE_FILE_URL;

const NoPublicationsMessage = () => (
  <Grid item xs={12} className="flex flex-col items-center justify-center py-6">
    <div className="bg-blue-50 rounded-lg p-6 text-center max-w-md shadow-md">
      <MdLibraryBooks className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-bounce" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No Publications Found
      </h3>
      <p className="text-gray-600">
        Please check back later or contact the admin to upload new publications.
      </p>
    </div>
  </Grid>
);

function Publication() {
  const [publications, setPublications] = useState({});
  const [currentPages, setCurrentPages] = useState({});
  const itemsPerPage = 5;

  const fetchData = async () => {
    const response = await getAllpublication();
    const filteredData = response.filter(
      (item) =>
        item.categoryName === "Publication" &&
        item.displayStatus === true
    );

    const groupedPublication = filteredData.reduce((acc, item) => {
      const subCat = item.subCategoryName || "General";
      if (!acc[subCat]) {
        acc[subCat] = [];
      }
      acc[subCat].push(item);
      return acc;
    }, {});

    setPublications(groupedPublication);
    setCurrentPages(
      Object.keys(groupedPublication).reduce(
        (acc, key) => ({ ...acc, [key]: 1 }),
        {}
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (subCategory, page) => {
    setCurrentPages((prev) => ({ ...prev, [subCategory]: page }));
  };

  return (
    <Grid container sm={12} className="p-4 lg:px-20 lg:py-6" sx={{ alignItems: 'stretch' }}>
      <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
        Our Publication
      </h2>

      {Object.keys(publications).length === 0 ? (
        <Grid mt="10px" container mx="20px" spacing="20px">
          <NoPublicationsMessage />
        </Grid>
      ) : (
        Object.entries(publications).map(([subCategory, items]) => {
          const currentPage = currentPages[subCategory] || 1;
          const totalPages = Math.ceil(items.length / itemsPerPage);
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const paginatedItems = items.slice(indexOfFirstItem, indexOfLastItem);

          return (
            <Grid item xs={11.8} lg={3.8} md={4} sx={{ p: 0.5, mr: 2.8, display: 'flex', flexDirection: 'column' }} key={subCategory}>
              <h1 className="border-b border-[#1169bf]">{subCategory}</h1>
              <div className="mt-6 flex flex-col bg-[#b2c6d5] p-4 h-[22rem]">
                <ul className="flex-grow list-disc pl-5 space-y-2 overflow-hidden">
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
                      <li key={index} className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/publication/${item.id}`}
                            className="text-sm font-medium text-black hover:underline"
                          >
                            {item.title}
                          </Link>
                          <div className="text-xs text-[#1f4d7a] mt-1">
                            {extractDate(item.publishedAt)}
                          </div>
                        </div>
                        {item.isFile === true && (
                          <button
                            onClick={() => downloadPublicationFile(item.file)}
                            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-[#1169bf] border border-blue-200 hover:bg-[#1169bf] hover:text-white hover:border-[#1169bf] hover:shadow-md transition-all duration-300 ml-2 shrink-0"
                            title="Download"
                          >
                            <MdOutlineFileDownload fontSize="18px" />
                          </button>
                        )}
                      </li>
                    ))
                  ) : (
                    <h1 className="text-center text-sm text-gray-600">
                      No items available
                    </h1>
                  )}
                </ul>
                <div className="flex flex-col mt-auto">
                  <PaginationForReports
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => handlePageChange(subCategory, page)}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              </div>
            </Grid>
          );
        })
      )}
    </Grid>
  );
}

export default Publication;
