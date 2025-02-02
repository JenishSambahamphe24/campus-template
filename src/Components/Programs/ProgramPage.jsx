import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography, Stack, Divider, Box } from '@mui/material'
import { BsFacebook, BsTwitterX } from 'react-icons/bs'
import { FaLink } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { getProjectById } from '../../Screens/cmsScreen/cms-components/cms-project/projectApi'
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
                console.log("Fetched data:", data); // Check the response here
                setProgramDetail(data);
            } catch (error) {
                console.error("Error fetching program data:", error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <Box >
            <Grid position='relative' item xs={12}>
                <div className="mx-auto  ">
                    <img
                        src='/src/assets/course.png'
                        className="h-[400px] w-full object-contain"
                        alt="..." />
                </div>
                <Box width='50%' sx={{ position: 'absolute', bottom: '40%', borderLeft: '10px solid yellowgreen' }}>
                    <h1 color='' className=' p-[20px] text-3xl text-gray-700 font-bold h-full w-full bg-purple-200 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-40'>
                        {`${programDetail.programName} (${programDetail.shortName})`}
                    </h1>
                </Box>
            </Grid>

            <Grid container className='px-20' gap='40px' my='20px'>
                <Grid item xs='3' rowGap='20px' display='flex' flexDirection='column'  >
                    <Stack width='100%' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Course start Date </Typography>
                        <Typography>{extractDate(programDetail.runningFrom)} </Typography>
                        <Divider sx={{ marginTop: '5px' }} />
                    </Stack>
                    <Stack width='100%' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Level</Typography>
                        <Typography> {programDetail.level} </Typography>
                        <Divider sx={{ marginTop: '5px' }} />
                    </Stack>
                    <Stack width='100%' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Faculty</Typography>
                        <Typography> {programDetail.facultyName} </Typography>
                        <Divider sx={{ marginTop: '5px' }} />
                    </Stack>

                    {
                        programDetail.file && programDetail.file !== "null" && programDetail.file !== " " && (
                            <a href={`${FILE_URL}${programDetail.file}`} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Button sx={{ textTransform: 'none', display: 'flex', width: '10rem' }} size='small' variant="contained" className=" gap-3 ">
                                    Download file
                                    <DownloadIcon />
                                </Button>
                            </a>
                        )
                    }
                </Grid>
                <Grid display='flex' flexDirection='column' justifyContent='space-between' container md={8}>
                    <div>
                        <Typography variant='h5' mb={4} fontSize='26px'> {programDetail.title} </Typography>
                        <Stack direction='column' spacing='20px'>
                            <p
                                className="mt-1 text-sm text-gray-500"
                                dangerouslySetInnerHTML={{
                                    __html: programDetail.programDetails,
                                }}
                            />
                        </Stack>
                    </div>
                    <Link to='/program-list' style={{ width: '100%' }}>
                        <Button sx={{ textTransform: 'none', display: 'flex-end' }} variant="outlined" className="flex  gap-3 ">
                            Other programs
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
            </Grid>
        </Box>
    )
}

export default ProgramPage