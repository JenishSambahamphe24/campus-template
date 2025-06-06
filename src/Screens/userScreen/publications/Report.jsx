import { useState, useEffect } from 'react'
import { Grid, } from '@mui/material'
import { MdOutlineFileDownload } from "react-icons/md";
import PaginationForReports from './component/PaginationForReports'
import { downloadPublicationFile, getAllpublication } from '../../cmsScreen/cms-components/cms-publication/publicationApi'
const FILE_URL = import.meta.env.VITE_FILE_URL

function Report() {
    const [reports, setReports] = useState({})
    const [currentPages, setCurrentPages] = useState([])
    const itemsPerPage = 10;

    const fetchData = async () => {
        const response = await getAllpublication()
        const reportData = response.filter(item => item.categoryName === 'Report');

        const groupedReport = reportData.reduce((acc, item) => {
            if (!acc[item.subCategoryName]) {
                acc[item.subCategoryName] = [];
            }
            acc[item.subCategoryName].push(item);
            return acc
        }, {});
        setReports(groupedReport)
        setCurrentPages(Object.keys(groupedReport).reduce((acc, key) => ({ ...acc, [key]: 1 }), {}));

    }

    useEffect(() => {
        fetchData();
    }, []);

    const handlePageChange = (subCategory, page) => {
        setCurrentPages(prev => ({ ...prev, [subCategory]: page }));
    };

    return (
        <Grid container className="justify-start px-4 py-4 lg:px-20 lg:py-16 " gap="20px">
            {Object.entries(reports).map(([subCategory, items]) => {
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
                                    paginatedItems.map((item, index) => (
                                        <li key={index}>
                                            <a
                                                onClick={() => downloadPublicationFile(item.file)}
                                                className="flex text-sm"
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
    )
}

export default Report