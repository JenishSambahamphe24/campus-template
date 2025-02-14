import  { useState, useEffect } from 'react'
import { Grid,  } from '@mui/material'
import { MdOutlineFileDownload } from "react-icons/md";
import PaginationForReports from './component/PaginationForReports'
import { getAllpublication } from '../../cmsScreen/cms-components/cms-publication/publicationApi'
const FILE_URL = import.meta.env.VITE_FILE_URL

function Report() {
    const [notices, setNotices] = useState([]);
    const [reports, setReports] = useState([]);
    const [application, setApplication] = useState([]);


    const fetchData = async () => {
        const response = await getAllpublication()
        setNotices(response.filter(item => item.categoryName === 'Notices'))
        setReports(response.filter(item => item.categoryName === 'Report'))
        setApplication(response.filter(item => item.categoryName === 'Application'))
    }
    useEffect(() => {
        fetchData()
    }, [])
    // pagination for Notice Boards
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10;
    const totalPages = Math.ceil(notices.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedNotice = notices.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChangeNotice = (page) => {
        setCurrentPage(page);
    };
    // pagination for Annual Reports
    const [currentPageAnnual, setCurrentPageAnnual] = useState(1)
    const itemsPerPageAnnual = 10;
    const totalPagesForAnnual = Math.ceil(reports.length / itemsPerPageAnnual);
    const indexofLastAnnualItem = currentPageAnnual * itemsPerPageAnnual;
    const indexOfFirstAnnualItem = indexofLastAnnualItem - itemsPerPageAnnual;
    const paginatedAnnualReport = reports.slice(indexOfFirstAnnualItem, indexofLastAnnualItem);
    const handlePageChangeAnnual = (page) => {
        setCurrentPageAnnual(page);
    };

    // pagination for Other application
    const [currentPageOther, setCurrentPageOther] = useState(1)
    const itemsPerPageOther = 10;
    const totalPagesForOther = Math.ceil(application.length / itemsPerPageOther);
    const indexofLastOtherItem = currentPageOther * itemsPerPageOther;
    const indexOfFirstOtherItem = indexofLastOtherItem - itemsPerPageOther;
    const paginatedOther = application.slice(indexOfFirstOtherItem, indexofLastOtherItem);
    const handlePageChangeForOthers = (page) => {
        setCurrentPageOther(page);
    };
    return (
        <Grid container className='px-20 py-16' gap='26px' sm={12}>
            <Grid sm={11.8} lg={3.8} md={5.8}>
                <h1 className="border-b border-[#0368b0]">
                    Notice Boards
                </h1>
                <div className="mt-6 flex flex-col bg-[#b2c6d5] p-4 h-[24rem]">
                    <ul className="flex-grow list-disc pl-5 space-y-2 overflow-auto">
                        {
                            paginatedNotice.length > 0 ? (
                                paginatedNotice.map((item, index) => (
                                    <li key={index}>
                                        <div>
                                            <a href={`${FILE_URL}${item.file}`} download target="_blank" rel="noopener noreferrer" className='flex text-sm'>
                                                {item.title}
                                                <MdOutlineFileDownload fontSize='17px' style={{ marginTop: '2px', marginLeft: '5px', color: '#0368b0' }} />

                                            </a>
                                        </div>
                                    </li>
                                ))
                            )
                                :
                                (
                                    <h1 className='text-center text-sm'> No any items !!</h1>
                                )
                        }
                    </ul>
                    <div className="flex flex-col mt-auto">
                        <PaginationForReports
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChangeNotice}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                </div>

            </Grid>
            <Grid sm={11.8} lg={3.8} md={5.8}>
                <h1 className="border-b border-[#0368b0]">
                    Reports
                </h1>
                <div className="mt-6 flex flex-col bg-[#b2c6d5] p-4 h-[24rem]">
                    <ul className="flex-grow list-disc pl-5 space-y-2 overflow-auto">
                        {
                            paginatedAnnualReport.length > 0 ? (
                                paginatedAnnualReport.map((item, index) => (
                                    <li key={index}>
                                        <div>
                                            <a href={`${FILE_URL}${item.file}`} download target="_blank" rel="noopener noreferrer" className='flex text-sm'>
                                                {item.title}
                                                <MdOutlineFileDownload fontSize='17px' style={{ marginTop: '2px', marginLeft: '5px', color: '#0368b0' }} />

                                            </a>
                                        </div>
                                    </li>
                                ))
                            )
                                :
                                (
                                    <h1 className='text-center text-sm'> No any items !!</h1>
                                )
                        }
                    </ul>
                    <div className="flex flex-col mt-auto">
                        <PaginationForReports
                            currentPage={currentPageAnnual}
                            totalPages={totalPagesForAnnual}
                            onPageChange={handlePageChangeAnnual}
                            itemsPerPage={itemsPerPageAnnual}
                        />
                    </div>
                </div>
            </Grid>
            <Grid sm={11.8} lg={3.8} md={5.8}>
                <h1 className="border-b border-[#0368b0]">
                    Other downloads
                </h1>
                <div className="mt-6 flex flex-col bg-[#b2c6d5] p-4 h-[24rem]">
                    <ul className="flex-grow list-disc pl-5 space-y-2 overflow-auto">
                        {
                            paginatedOther.length >= 1 ? (
                                paginatedOther.map((item, index) => (
                                    <li key={index}>
                                        <div>
                                            <a href={`${FILE_URL}${item.file}`} download target="_blank" rel="noopener noreferrer" className='flex text-sm'>
                                                {item.title}
                                                <MdOutlineFileDownload fontSize='17px' style={{ marginTop: '2px', marginLeft: '5px', color: '#0368b0' }} />

                                            </a>
                                        </div>
                                    </li>
                                ))
                            )
                                :
                                (
                                    <h1 className='text-center text-sm'> No any items !!</h1>
                                )
                        }
                    </ul>
                    <div className="flex flex-col mt-auto">
                        <PaginationForReports
                            currentPage={currentPageOther}
                            totalPages={totalPagesForOther}
                            onPageChange={handlePageChangeForOthers}
                            itemsPerPage={itemsPerPageOther}
                        />
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}

export default Report