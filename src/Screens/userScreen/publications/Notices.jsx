import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { MdOutlineFileDownload } from 'react-icons/md';
import PaginationForReports from './component/PaginationForReports';
import { downloadPublicationFile, getAllpublication } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
import { extractDate } from '../../../Components/utilityFunctions';

function Notices() {
    const { category } = useParams();
    const [notices, setNotices] = useState({});
    const [currentPages, setCurrentPages] = useState({});
    const itemsPerPage = 10;

    const fetchData = async () => {
        const response = await getAllpublication();
        const noticesData = response.filter(item => item.categoryName === category);

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
    }, [category]);

    const handlePageChange = (subCategory, page) => {
        setCurrentPages(prev => ({ ...prev, [subCategory]: page }));
    };

    return (
        <Grid container className="justify-start px-4 py-4 lg:px-20 lg:py-16" gap="20px">
            {Object.entries(notices).map(([subCategory, items]) => {
                const currentPage = currentPages[subCategory] || 1;
                const totalPages = Math.ceil(items.length / itemsPerPage);
                const indexOfLastItem = currentPage * itemsPerPage;
                const indexOfFirstItem = indexOfLastItem - itemsPerPage;
                const paginatedItems = items.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(indexOfFirstItem, indexOfLastItem);
                return (
                    <Grid item xs={11.8} lg={3.8} md={5.8} key={subCategory}>
                        <h1 className="border-b border-[#1169bf]">{subCategory}</h1>
                        <div className="mt-6 flex flex-col bg-[#b2c6d5] p-4 h-[24rem]">
                            <ul className="flex-grow list-disc pl-5 space-y-2 overflow-auto">
                                {paginatedItems.length > 0 ? (
                                    paginatedItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                            onClick={() => downloadPublicationFile(item.file)}
                                                className="flex text-sm"
                                            >
                                                {item.title}
                                                {`
                                                    (${extractDate(item.publishedAt)})`
                                                }
                                                <MdOutlineFileDownload
                                                    fontSize="17px"
                                                    style={{ marginTop: '2px', marginLeft: '5px', color: '#1169bf' }}
                                                />

                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <h1 className="text-center text-sm">No any items !!</h1>
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
            })}
        </Grid>
    );
}

export default Notices;
