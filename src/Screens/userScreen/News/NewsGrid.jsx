import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllpublication } from "../../cmsScreen/cms-components/cms-publication/publicationApi";
import {
  cleanDescription,
  formatDateShort,
} from "../../../Components/utilityFunctions";
import { Grid } from "@mui/material";
import { MdNewspaper } from "react-icons/md";
import ReusablePagination from "../ReusablePagination";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_DEFAULT_IMG;

function NewsGrid() {
  const [allNewsEvents, setAllNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const latestNews =
    allNewsEvents.length > 0
      ? allNewsEvents.slice().sort((a, b) => b.id - a.id)[0]
      : null;
  const otherNews = latestNews
    ? allNewsEvents.filter((item) => item.id !== latestNews.id)
    : [];

  const totalPages = Math.ceil(otherNews.length / itemsPerPage);
  const indexOfLastItem = itemsPerPage * currentPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedNews = otherNews
    .slice(indexOfFirstItem, indexOfLastItem)
    .sort((a, b) => b.id - a.id);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const NoNewsMessage = () => (
    <Grid
      item
      xs={12}
      className="flex flex-col items-center justify-center py-4"
    >
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

  return (
    <Grid container sm={12} className="p-4 lg:px-20 lg:py-6">
      <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-4">
        News and Events
      </h2>

      {allNewsEvents.length > 0 ? (
        <>
          <Grid container spacing="20px" mt="10px">
            {/* Latest News Section */}
            {latestNews && (
              <Grid item xs={12} sm={5}>
                <Link to={`/publication/${latestNews.id}`}>
                  <article className="bg-gray-200 hover:bg-gray-300 overflow-hidden rounded-lg border border-gray-400 shadow-sm transition-transform transform hover:scale-105 hover:cursor-pointer">
                    <img
                      alt="Latest News"
                      src={
                        latestNews.thumbnailImage
                          ? `${IMAGE_URL}/thumb/${latestNews.thumbnailImage}`
                          : defaultImage
                      }
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                      className="h-60 w-full object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs text-indigo-600 font-medium">
                        {`${formatDateShort(
                          latestNews.createdAt || "2024-01-01"
                        )}, ${latestNews.subCategoryName}`}
                      </p>
                      <h3 className="text-gray-900 font-bold text-base mb-1 hover:text-indigo-600 transition">
                        {latestNews.title}
                      </h3>
                      <div
                        style={{ fontSize: "13px" }}
                        className="text-gray-700 text-sm line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: cleanDescription(latestNews.description),
                        }}
                      />
                    </div>
                  </article>
                </Link>
              </Grid>
            )}

            {/* Other News Section */}
            <Grid item xs={12} sm={7}>
              <Grid container spacing="20px">
                {paginatedNews.map((item) => (
                  <Grid key={item.id} item xs={12} sm={6} lg={4}>
                    <Link to={`/publication/${item.id}`}>
                      <article className="bg-gray-200 hover:bg-gray-300 overflow-hidden rounded-lg border border-gray-400 shadow-sm transition-transform transform hover:scale-105 hover:cursor-pointer">
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
                          className="h-40 w-full object-cover"
                        />
                        <div className="p-2">
                          <p className="text-xs italic text-indigo-500 font-medium">
                            {`${formatDateShort(
                              item.createdAt || "2024-01-01"
                            )}, ${item.subCategoryName}`}
                          </p>
                          <h4 className="text-gray-900 font-semibold text-sm line-clamp-2 hover:text-indigo-600 transition">
                            {item.title}
                          </h4>
                        </div>
                      </article>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Pagination */}
          {totalPages > 0 && (
            <ReusablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          )}
        </>
      ) : (
        <NoNewsMessage />
      )}
    </Grid>
  );
}

export default NewsGrid;
