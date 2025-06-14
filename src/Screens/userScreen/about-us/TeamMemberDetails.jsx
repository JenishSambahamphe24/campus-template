import { useState, useEffect } from 'react'
import { Grid, Button, Stack, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { BsFacebook } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { getTeamById } from '../../cmsScreen/cms-components/cms-team/teamApi'
import { extractDate } from '../../../Components/utilityFunctions'
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const defaultImage = import.meta.env.VITE_DEFAULT_IMG

function TeamMemberDetails() {
    const { id } = useParams();
    const [teamDetail, setTeamDetail] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTeamById(id)
            setTeamDetail(data)
        };
        fetchData()
    }, [id])

    return (
        <Grid container className='px-10  sm:px-2 md:px-4 lg:px-20 py-10' display='flex' justifyContent='center' gap='10px'>
            <Grid display='flex' justifyContent='space-between' flexDirection='column' item xs={12} sm={7.4} md={8.3} lg={8.8} order={{ xs: 2, sm: 2, md: 2, lg: 1 }}>
                <div
                    style={{ fontSize: '16px' }}
                    dangerouslySetInnerHTML={{ __html: teamDetail.cvDetail } || "No CV details available"}
                />

                <Link to='/team'>
                    <Button sx={{ textTransform: 'none', mt: '30px' }} size="small" variant="outlined" className="flex items-center gap-3 bg-red-900">
                        See all teams
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
                </Link>
            </Grid>

            <Grid item xs={12} sm={4.3} md={3.5} lg={3} order={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                <div className="full group relative block overflow-hidden">
                    <img
                        src={teamDetail.ppImage ? `${IMAGE_URL}/team/${teamDetail.ppImage}` : defaultImage}
                        alt="Team Member"
                        onError={(e) => { e.target.src = defaultImage; }}
                        className={`h-52 w-full transition duration-500 sm:h-52 object-cover ${teamDetail.thumbnailImage ? "w-full group-hover:scale-105" : "w-2/3 mx-auto"
                            }`}
                    />
                    <div className="relative  bg-white">
                        <h3 className="mt-1 text-lg font-medium text-gray-900">{`${teamDetail.firstName} ${teamDetail.middleName} ${teamDetail.lastName}` || "Unknown Member"} </h3>
                        <h3 className=" text-lg font-medium text-gray-900">
                            {teamDetail.subCategory || ""}
                            {teamDetail.subCategory && teamDetail.department ? ", " : ""}
                            {teamDetail.department || ""}
                        </h3>

                        <h3 className="text-sm italic text-gray-900"> <span className="text-sm font-medium text-gray-900">Contact:  </span>{teamDetail.email || "email not found"}, {teamDetail.phoneNo}</h3>
                        <h3 className="text-sm italic text-gray-900">{ }</h3>
                        <h3 className="text-sm italic text-gray-900"><span className="text-sm font-medium text-gray-900">Appointd Date: </span> {extractDate(teamDetail.appointedDate) || " "}</h3>
                    </div>
                    <Stack mt='5px' spacing='10px' direction='column'>
                        <h3 fontWeight='bold' >social media</h3>
                        <Stack mt='5px' direction='row' spacing='10px'>
                            <Link target='_blank' to={teamDetail.fbUrl}>
                                <BsFacebook className='text-gray-700' style={{ fontSize: '18px' }} />
                            </Link>
                        </Stack>
                        <Divider sx={{ color: 'red', marginTop: '10px' }} />
                    </Stack>
                </div>
            </Grid>
        </Grid>
    )
}

export default TeamMemberDetails
