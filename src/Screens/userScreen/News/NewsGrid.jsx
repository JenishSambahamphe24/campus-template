import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { MdOutlineFileDownload, MdNewspaper } from "react-icons/md";
import { Link } from "react-router-dom";
import PaginationForReports from "../publications/component/PaginationForReports";
import {
  downloadPublicationFile,
  getAllpublication,
} from "../../cmsScreen/cms-components/cms-publication/publicationApi";
import { extractDate } from "../../../Components/utilityFunctions";

const NoNewsMessage = () => (
  <Grid item xs={12} className="flex flex-col items-center justify-center py-6">
    <div className="bg-blue-50 rounded-lg p-6 text-center max-w-md shadow-md">
      <MdNewspaper className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-bounce" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No News Available
      </h3>
      <p className="text-gray-600">
        Please check back later or contact the admin to upload new updates.
      </p>
    </div>
  </Grid>
);

function NewsGrid() {
  const [newsGrouped, setNewsGrouped] = useState({});
  const [currentPages, setCurrentPages] = useState({});
  const itemsPerPage = 10;

  const fetchData = async () => {
    const response = await getAllpublication();
    
    // Filter and sort by newest first (descending ID)
    const newsData = response
      .filter(
        (item) =>
          item.categoryName === "News and Events" &&
          item.displayStatus === true
      )
      .sort((a, b) => b.id - a.id);

    const groupedNews = newsData.reduce((acc, item) => {
      const subCat = item.subCategoryName || "General";
      if (!acc[subCat]) {
        acc[subCat] = [];
      }
      acc[subCat].push(item);
      return acc;
    }, {});

    setNewsGrouped(groupedNews);
    setCurrentPages(
      Object.keys(groupedNews).reduce(
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
    <Grid container sm={12} className="p-4 lg:px-20 lg:py-6">
      <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
        News and Events
      </h2>

      {Object.keys(newsGrouped).length === 0 ? (
        <Grid mt="10px" container mx="20px" spacing="20px">
          <NoNewsMessage />
        </Grid>
      ) : (
        Object.entries(newsGrouped).map(([subCategory, items]) => {
          const currentPage = currentPages[subCategory] || 1;
          const totalPages = Math.ceil(items.length / itemsPerPage);
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const paginatedItems = items.slice(indexOfFirstItem, indexOfLastItem);

          return (
            <Grid item xs={11.8} lg={3.8} md={4} sx={{ p: 0.5, mr: 2.8 }} key={subCategory}>
              <h1 className="border-b border-[#1169bf]">{subCategory}</h1>
              <div className="mt-6 flex flex-col bg-[#b2c6d5] p-4 h-[24rem]">
                <ul className="flex-grow list-disc pl-5 space-y-2 overflow-auto">
                  {paginatedItems.length > 0 ? (
                    paginatedItems.map((item, index) => (
                      <li key={index} className="flex justify-between items-start">
                        <div>
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
                            className="flex items-center text-[#1169bf] hover:text-[#0d47a1]"
                          >
                            <MdOutlineFileDownload
                              fontSize="17px"
                              style={{ marginLeft: "5px" }}
                            />
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

export default NewsGrid;
