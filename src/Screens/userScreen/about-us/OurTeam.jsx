import React, { useState, useEffect } from 'react'
import { Grid, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { getAllTeams } from '../../cmsScreen/cms-components/cms-team/teamApi'
import ReusablePagination from '../ReusablePagination'

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

function OurTeam() {
    const [allTeamMember, setAllTeamMeber] = useState([])
    const defaultImage = 'https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg='

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllTeams()
            setAllTeamMeber(data)
        };
        fetchData()
    }, [])

    console.log(allTeamMember)

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8;
    const totalPages = Math.ceil(allTeamMember.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedTeam = allTeamMember.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Grid container className='px-20 py-6'>
            <div className=' mx-auto sm:px-6 max-w-7xl'>
                <h2 className="w-full text-center text-2xl font-bold text-gray-900 font-manrope leading-normal pb-1 my-4">Our Team</h2>
            </div>

            <Grid container spacing={2} mx='auto' mb='1.5rem' padding='10px 30px' sx={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {paginatedTeam?.sort((a, b) => a.index - b.index).map((item, index) => (
                    <Grid item md={3} key={index} sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Link to={`/member-details/${item.id}`} className="group relative block overflow-hidden">
                            <img
                                src={item.ppImage ? `${IMAGE_URL}${item.ppImage}` : defaultImage}
                                alt=""
                                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
                            />
                            <div className="relative border border-gray-100 bg-white p-1">
                                <h3 className="mt-1 text-lg font-medium text-gray-900 line-clamp-1">{`${item.firstName} ${item.middleName} ${item.lastName}`} </h3>
                                <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.position}</h3>

                                <Button sx={{ textTransform: 'none', mt: '10px' }} size="small" variant="outlined" className="flex items-center gap-3 bg-red-900">
                                    Learn More
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                        />
                                    </svg>
                                </Button>
                            </div>
                        </Link>
                    </Grid>
                ))}
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

export default OurTeam