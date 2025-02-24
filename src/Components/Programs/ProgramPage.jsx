import { useState, useEffect } from 'react'
import { Grid, Button,Stack, } from '@mui/material'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { FaBookReader } from 'react-icons/fa';
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

    return (
        <Grid container className='px-10  sm:px-2 md:px-4 lg:px-20 py-10' display='flex' justifyContent='center' gap='10px'>
            <Grid display='flex' justifyContent='space-between' flexDirection='column' item xs={12} sm={7.4} md={8.3} lg={8.8} order={{ xs: 2, sm: 2, md: 2, lg: 1 }}>
                <div className='p-2'>
                    <h1 className='text-md font-bold'> {programDetail.programName} </h1>
                    <h1 className='' dangerouslySetInnerHTML={{ __html: programDetail.programDetails } || "No CV details available"} />

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

            <Grid item xs={12} sm={4.3} md={3.5} lg={3} order={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                <div className="full group relative block  rounded-3xl overflow-hidden">
                    <Grid
                        className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#1169bf]  px-6 pt-10 pb-8 ring-1 ring-gray-900/5 transition-all duration-300   sm:mx-auto sm:max-w-sm  sm:px-10"
                    >
                        <span className="absolute invisible group-hover:visible top-10 z-0 h-20 w-20 rounded-full bg-[#f36710] transition-all duration-300 group-hover:scale-[10]"></span>
                        <div className="relative z-10 flex flex-col items-center">
                            <span className="grid h-20 w-20 place-items-center rounded-full bg-[#f36710] transition-all duration-300 group-hover:bg-[#f36710]">
                                <FaBookReader className="h-10 w-10 text-white transition-all" />
                            </span>
                            <div className="pt-3 text-base font-semibold leading-7 text-center">
                                <p className="text-white transition-all duration-300 group-hover:text-white text-md">
                                    {programDetail.shortName}
                                </p>
                            </div>
                        </div>
                    </Grid>

                    <div className='bg-[#1169bf] px-4 pb-4'>
                        <div className="relative">
                            <h3 className="mt md:text-sm lg:text-md font-bold text-white underline">{programDetail.programName} {`(${programDetail.shortName})`}</h3>
                        </div>
                        <Stack spacing='7px' mt='10px' direction='column'>
                            <h1 className='text-sm'>
                                <span className='font-medium text-white mr-2'>
                                    Faculty :
                                </span>
                                <span className='italic text-white'>
                                    {programDetail.facultyName}
                                </span>
                            </h1>
                            <h1 className='text-sm text-white'>
                                <span className='font-medium mr-2'>
                                    Level :
                                </span>
                                <span className='italic text-white'>
                                    {programDetail.level}
                            </span>
                            </h1>
                            <h1 className='text-sm text-white'>
                                <span className='font-medium mr-2'>
                                    Running From:
                                </span>
                                <span className='italic'>
                                    {extractDate(programDetail.runningFrom)}
                                </span>
                            </h1>
                            <div className='flex justify-center'>
                                {
                                    programDetail.hasProgramBrochure && (
                                        <Link
                                            target='_blank'
                                            className='rounded-md text-white text-sm  border-[#F36710] bg-[#f36710]  mx-auto px-3 py-1'
                                            to={`${FILE_URL}/program/${programDetail.programBrochureFile}`}
                                            download
                                        >
                                            Download Brochure
                                        </Link>
                                    )}
                            </div>
                        </Stack>

                    </div>
                </div>
            </Grid>
        </Grid>
    )
}

export default ProgramPage