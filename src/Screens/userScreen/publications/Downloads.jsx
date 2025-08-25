import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { MdOutlineFileDownload, MdCloudOff } from 'react-icons/md';
import PaginationForReports from './component/PaginationForReports';
import { downloadPublicationFile, getAllpublication } from '../../cmsScreen/cms-components/cms-publication/publicationApi';

const FILE_URL = import.meta.env.VITE_FILE_URL;

const NoDownloadsMessage = () => (
  <Grid item xs={12} className="flex flex-col items-center justify-center py-6">
    <div className="bg-blue-50 rounded-lg p-6 text-center max-w-md shadow-md">
      <MdCloudOff className="h-12 w-12 mx-auto text-blue-500 mb-4 animate-bounce" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Downloads Available</h3>
      <p className="text-gray-600">
        Please check back later or contact the admin to upload new downloadable content.
      </p>
    </div>
  </Grid>
);

function Downloads() {
  const [notices, setNotices] = useState({});
  const [currentPages, setCurrentPages] = useState({});
  const itemsPerPage = 10;

  const fetchData = async () => {
    const response = await getAllpublication();
    const noticesData = response.filter(item => item.categoryName === 'Downloads' || item.categoryName === 'Others');

    const groupedNotices = noticesData.reduce((acc, item) => {
      if (!acc[item.subCategoryName]) {
        acc[item.subCategoryName] = [];
      }
      acc[item.subCategoryName].push(item);
      return acc;
    }, {});

    setNotices(groupedNotices);
    setCurrentPages(Object.keys(groupedNotices).reduce((acc, key) => ({ ...acc, [key]: 1 }), {}));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (subCategory, page) => {
    setCurrentPages(prev => ({ ...prev, [subCategory]: page }));
  };

  return (
    <Grid container className="justify-start px-4 py-4 lg:px-20 lg:py-16 " gap="20px">
      <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal -m-10">
        Our Downloads
      </h2>

      {Object.keys(notices).length === 0 ? (
        <NoDownloadsMessage />
      ) : (
        Object.entries(notices).map(([subCategory, items]) => {
          const currentPage = currentPages[subCategory] || 1;
          const totalPages = Math.ceil(items.length / itemsPerPage);
          const indexOfLastItem = currentPage * itemsPerPage;
          const indexOfFirstItem = indexOfLastItem - itemsPerPage;
          const paginatedItems = items.slice(indexOfFirstItem, indexOfLastItem);

          return (
            <Grid item xs={11.8} lg={3.8} md={5.8} key={subCategory}>
              <h1 className="border-b border-[#1169bf]">{subCategory}</h1>
              <div className="mt-6 flex flex-col bg-[#b2c6d5] p-4 h-[24rem]">
                <ul className="flex-grow list-disc pl-5 space-y-2 overflow-auto">
                  {paginatedItems.length > 0 ? (
                    paginatedItems
                      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
                      .map((item, index) => (
                        <li key={index}>
                          <a
                            onClick={() => downloadPublicationFile(item.file)}
                            className="flex text-sm text-blue-700 hover:underline hover:text-blue-900 transition"
                          >
                            {item.title}
                            <MdOutlineFileDownload
                              fontSize="17px"
                              style={{ marginTop: '2px', marginLeft: '5px', color: '#1169bf' }}
                            />
                          </a>
                        </li>
                      ))
                  ) : (
                    <h1 className="text-center text-sm text-gray-600">No items available</h1>
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

export default Downloads;