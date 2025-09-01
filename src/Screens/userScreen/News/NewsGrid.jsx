import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import { MdNewspaper } from "react-icons/md";
import { Link } from "react-router-dom";
import { getAllpublication } from "../../cmsScreen/cms-components/cms-publication/publicationApi";
import ReusablePagination from "../ReusablePagination";
import {
  cleanDescription,
  formatDateShort,
} from "../../../Components/utilityFunctions";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

function NewsGrid() {
  const [allNewsEvents, setAllNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllpublication();
      const newsData = data.filter(
        (item) =>
          item.categoryName === "News and Events" && item.displayStatus === true
      );
      setAllNews(newsData);
    };
    fetchData();
  }, []);

  const totalPages = Math.ceil(allNewsEvents.length / itemsPerPage);
  const indexOfLastItem = itemsPerPage * currentPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedItems = allNewsEvents
    .slice(indexOfFirstItem, indexOfLastItem)
    .sort((a, b) => b.id - a.id);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const NoNewsMessage = () => (
      <Grid item xs={12} className="flex flex-col items-center justify-center py-6">
    <div className="bg-blue-50 rounded-lg p-6 text-center max-w-md shadow-md">
        <MdNewspaper className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-bounce"/>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No News Available
        </h3>
        <p className="text-gray-600">
          Please check back later or contact the admin to upload new updates.
        </p>
      </div>
    </Grid>
  );

  return (
    <Grid container sm={12} className="p-4 lg:px-20 lg:py-6">
      <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">
        News and Events
      </h2>

      <Grid mt="10px" container mx="20px" spacing="20px">
        {paginatedItems.length > 0 ? (
          paginatedItems.map((item, index) => (
            <Grid key={index} item xs={12} sm={4} lg={3}>
              <article
                style={{ minHeight: "220px" }}
                className="bg-gray-200 hover:bg-gray-300 overflow-hidden rounded-lg border border-gray-400 shadow-sm transition-transform transform hover:scale-105 hover:cursor-pointer"
              >
                <Link to={`/publication/${item.id}`}>
                  <img
                    alt="News"
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
                  <span className="text-blue-500 text-md">
                    {formatDateShort(item.createdAt || "2024-01-01")}
                  </span>
                </div>

                <div className="px-2 pb-2">
                  <h1 className="text-lg line-clamp-1">{item.title} </h1>
                </div>
              </article>
            </Grid>
          ))
        ) : (
          <NoNewsMessage />
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

export default NewsGrid;
