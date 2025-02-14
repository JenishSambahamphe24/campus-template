import { useState, useEffect } from 'react'
import { Grid, Button, Typography, Stack, Divider, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { BsFacebook, BsTwitterX } from 'react-icons/bs'
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL


import DownloadIcon from '@mui/icons-material/Download';
import { getProgramById } from '../../Screens/cmsScreen/cms-components/cms-academics/academicsApi'
import { extractDate } from '../utilityFunctions'
const FILE_URL = import.meta.env.VITE_FILE_URL

function ProgramPage() {
    const { id } = useParams();

    const [programDetail, setProgramDetail] = useState({})
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProgramById(id);
                setProgramDetail(data);
            } catch (error) {
                console.error("Error fetching program data:", error);
            }
        };
        fetchData();
    }, [id]);

    const defaultImage = '/src/assets/course.png'
    console.log(programDetail)

    return (
        <Grid container className='px-10  sm:px-2 md:px-4 lg:px-20 py-10' display='flex' justifyContent='center' gap='10px'>
            <Grid display='flex' justifyContent='space-between'  flexDirection='column' item xs={12} sm={7.4} md={8.3} lg={8.8} order={{ xs: 2, sm: 2, md: 2, lg: 1 }}>
                <div className='p-2'>
                    <h1 className='text-md font-bold'> {programDetail.programName} </h1>
                    {/* <h1 dangerouslySetInnerHTML={{ __html: programDetail.cvDetail } || "No CV details available"}/> */}
                    <h1 className='text-sm mt-4'>
                        lore20
                        To allow your mobile device to access your development server running on your PC, follow these steps:
                        1. Find Your PC’s Local IP Address
                        You need to determine your PC’s local IP address on the same network. Run one of the following commands:
                        Windows (Command Prompt or PowerShell)
                    </h1>
                </div>

                <Link to='/program-list' className='flex justify-end  lg:justify-end xl:justify-start'>
                    <Button sx={{ textTransform: 'none', mt: '30px' }} size="small" variant="outlined" className="flex items-center gap-3">
                        See other programs
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

            <Grid  item xs={12} sm={4.3} md={3.5} lg={3} order={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                <div className="full group relative block overflow-hidden">
                    <img
                        src={programDetail.ppImage ? `${IMAGE_URL}${programDetail.ppImage}` : defaultImage}
                        alt="Team Member"
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105  sm:h-52"
                    />
                    <div className="relative   bg-white">
                        <h3 className="mt-1 md:text-sm lg:text-md font-bold text-gray-900">{programDetail.programName}</h3>
                        <h3 className="text-sm font-medium text-gray-900">{`(${programDetail.shortName})`}</h3>
                    </div>
                    <Stack spacing='7px' mt='10px' direction='column'>
                        <h1 className='text-sm'>
                            <span className='font-medium mr-2'>
                                Faculty :
                            </span>
                            <span className='italic'>
                                {programDetail.facultyName}
                            </span>
                        </h1>
                        <h1 className='text-sm'>
                            <span className='font-medium mr-2'>
                                Level :
                            </span>
                            <span className='italic'>
                                {programDetail.level}
                            </span>
                        </h1>
                        <h1 className='text-sm'>
                            <span className='font-medium mr-2'>
                                Running From:
                            </span>
                            <span className='italic'>
                                {extractDate(programDetail.runningFrom)}
                            </span>
                        </h1>
                        <Divider sx={{ color: 'red', marginTop: '10px' }} />
                    </Stack>
                </div>
            </Grid>
        </Grid>
    )
}

export default ProgramPage