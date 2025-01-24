import { useState, useEffect } from 'react'
import { Grid, } from '@mui/material'
import { Link } from 'react-router-dom'
import { getAllProjects } from '../../Screens/cmsScreen/cms-components/cms-project/projectApi'
import { cleanDescription } from '../utilityFunctions'
import { formatDate } from '../utilityFunctions'

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL


function Programs() {
    const [allProjects, setAllProjects] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const defaultImage = 'https://e7.pngegg.com/pngimages/132/135/png-clipart-management-business-project-todd-beamer-high-school-expert-project-management-company-service.png'

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllProjects()
            const activeData = data.filter(item => item.status === true)
            setAllProjects(activeData)
        };
        fetchData()
    }, [])

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedProject = allProjects.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(allProjects.length / itemsPerPage);
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <Grid container className='py-6 px-20'>
            <div className='px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl'>
                <h2 className="w-full text-center text-2xl font-bold text-gray-900  font-manrope leading-normal pb-4 mt-4">Our Programs</h2>
            </div>
            <Grid display='flex' justifyContent='flex-start' spacing='20px' container md={12}>
                {
                    paginatedProject.map((item, index) => (
                        <Grid key={index} item md={3}>
                            <Link to={`/program/1`}>
                                <article className="overflow-hidden rounded-lg shadow-lg  transition hover:shadow-xl">
                                    <img
                                        alt=""
                                        src={item.thumbnailImage ? `${IMAGE_URL}${item.thumbnailImage}` : defaultImage}
                                        className="h-48 w-full object-cover"
                                    />
                                    <div className="bg-white p-1 sm:p-1">
                                        <div className='flex justify-between'>
                                            <time className="block text-xs text-gray-500"> {formatDate(item.startDate)}</time>
                                            <span className='block text-xs text-gray-500"'>|</span>
                                            <time className="block text-xs text-gray-500"> {item.projectCategory === 'completed' ? formatDate(item.endDate) : 'Ongoing'}</time>
                                        </div>
                                        <a href="#">
                                            <h3 className="line-clamp-1 text-md text-gray-900">{item.title}</h3>
                                        </a>

                                        <p className=" line-clamp-1 text-sm/relaxed text-gray-500">
                                            <div
                                                style={{ fontSize: '16px' }}
                                                dangerouslySetInnerHTML={{ __html: cleanDescription(item.content) }}
                                            />
                                        </p>
                                    </div>
                                </article>
                            </Link>
                        </Grid>
                    ))
                }
            </Grid>
            <Grid sm={12} justifyContent='flex-end'>
                <div className="flex items-center justify-end gap-8 mt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <p className="text-slate-600">
                        Page <strong className="text-slate-800">{currentPage}</strong> of&nbsp;<strong className="text-slate-800">{totalPages}</strong>
                    </p>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="rounded-md border border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </Grid>
        </Grid>
    )
}

export default Programs