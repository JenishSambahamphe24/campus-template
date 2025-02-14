import  { useState, useEffect } from 'react'
import { Grid, Button, Typography, Stack, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { BsFacebook, BsTwitterX } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { getTeamById } from '../../cmsScreen/cms-components/cms-team/teamApi'
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

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
    const defaultImage = 'https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg='
    return (
        <Grid  container className='px-10  sm:px-2 md:px-4 lg:px-20 py-10' display='flex' justifyContent='center'  gap='10px'>
            <Grid display='flex' justifyContent='space-between' flexDirection='column' item xs={12} sm={7.4}  md={8.3} lg={8.8}  order={{xs:2, sm:2 , md:2, lg:1}}>
                <div>
                    <Typography fontFamily='fantasy'>
                        {/* <div
                            style={{ fontSize: '16px' }}
                            dangerouslySetInnerHTML={{ __html: teamDetail.cvDetail } || "No CV details available"}
                        /> */}
                        lore20
                        To allow your mobile device to access your development server running on your PC, follow these steps:
                        1. Find Your PC’s Local IP Address
                        You need to determine your PC’s local IP address on the same network. Run one of the following commands:
                        Windows (Command Prompt or PowerShell)
                    </Typography>
                </div>

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

            <Grid  item xs={12} sm={4.3}  md={3.5} lg={3}   order={{xs:1, sm:1 , md:1, lg:1}}>
                <div  className="full group relative block overflow-hidden">
                    <img
                        src={teamDetail.ppImage ? `${IMAGE_URL}${teamDetail.ppImage}` : defaultImage}
                        alt="Team Member"
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105  sm:h-52"
                    />
                    <div className="relative border border-gray-100 bg-white">
                        <h3 className="mt-1 text-lg font-medium text-gray-900">{`${teamDetail.firstName} ${teamDetail.middleName} ${teamDetail.lastName}` || "Unknown Member"}</h3>
                        <h3 className="text-sm font-medium text-gray-900">{teamDetail.position || "Unknown Position"}</h3>
                    </div>
                    <Stack mt='20px' spacing='10px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>social media</Typography>
                        <Stack mt='5px' direction='row' spacing='10px'>
                            <BsFacebook className='text-gray-700' style={{ fontSize: '18px' }} />
                            <BsTwitterX className='text-gray-700' style={{ fontSize: '18px' }} />
                        </Stack>
                        <Divider sx={{ color: 'red', marginTop: '10px' }} />
                    </Stack>
                </div>
            </Grid>
        </Grid>
    )
}

export default TeamMemberDetails
