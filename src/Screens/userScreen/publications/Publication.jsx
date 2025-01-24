import React, { useState, useEffect } from 'react'
import { Grid, Typography, Button } from '@mui/material'
import { MdOutlineFileDownload } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { getAllpublication } from '../../cmsScreen/cms-components/cms-publication/publicationApi'
import ReusablePagination from '../ReusablePagination'
import { cleanDescription, formatDate } from '../../../Components/utilityFunctions'
const FILE_URL = import.meta.env.VITE_FILE_URL
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

function Publication() {
    const [allPublication, setAllPublication] = useState([])

    useEffect(() => {
        const fetchdata = async () => {
            const data = await getAllpublication()
            const filteredData = data.filter(item => item.categoryName === "Publication")
            setAllPublication(filteredData)
        };
        fetchdata()
    }, [])

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8;
    const totalPages = Math.ceil(allPublication.length / itemsPerPage);
    const indexOfLastItem = itemsPerPage * currentPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Grid container sm={12} className='px-20 py-6'>
            <Grid mt='30px' item md={12} textAlign='center'>
                <div>
                    <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1">Our Publication </h2>
                </div>
            </Grid>
            <Grid mt='10px' container mx='20px' spacing='20px'>
                {
                    allPublication.map((item, index) => (
                        <Grid key={index} item xs={6} lg={3} >
                            <article style={{ minHeight: '320px' }} className="bg-gray-200 hover:bg-gray-300 overflow-hidden rounded-lg border border-gray-400  shadow-sm transition-transform transform hover:scale-105 hover:cursor-pointer">
                                <Link to={`/publication/${item.id}`}>
                                    <img
                                        alt=""
                                        src={`${IMAGE_URL}${item.thumbnailImage}`}
                                        className="h-56 w-full object-cover"
                                    />
                                    <div className="p-1 sm:p-2  ">
                                        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                            <div
                                                style={{ fontSize: '16px' }}
                                                dangerouslySetInnerHTML={{ __html: cleanDescription(item.description) }}
                                            />
                                        </p>
                                    </div>
                                </Link>
                                <div className='flex '>
                                    {
                                        item.isFile && (
                                            <>
                                                <a href={`${FILE_URL}/${item.file}`} className="px-2 group  inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                                                    Download
                                                    <span aria-hidden="true" className="block">
                                                        <MdOutlineFileDownload fontSize='18px' />
                                                    </span>
                                                </a>
                                                <span>
                                                    |
                                                </span>
                                            </>
                                        )
                                    }
                                    <span className='ml-2 text-blue-500 text-md'>
                                        {formatDate(item.publishedAt)}
                                    </span>
                                </div>
                                
                            </article>
                           
                        </Grid>
                    ))
                }

            </Grid>
            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
            />
        </Grid>
    )
}

export default Publication