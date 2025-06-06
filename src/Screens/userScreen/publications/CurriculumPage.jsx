import  { useState, useEffect } from 'react'
import { Grid, Button, Typography, Stack, Divider } from '@mui/material'
import { Link } from 'react-router-dom'
import { BsFacebook, BsTwitterX } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { getPublicationById } from '../../cmsScreen/cms-components/cms-publication/publicationApi'
import { extractDate } from '../../../Components/utilityFunctions'
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const defaultImage = import.meta.env.VITE_DEFAULT_IMG

function CurriculumPage() {
    const { id } = useParams();

    const [curriculumDetail, setCurriculumDetail] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPublicationById(id)
            setCurriculumDetail(data)
        };
        fetchData()
    }, [id])
   
    return (
        <Grid  container className='px-10  sm:px-2 md:px-4 lg:px-20 py-10' display='flex' justifyContent='center'  gap='10px'>
            <Grid display='flex' justifyContent='space-between' flexDirection='column' item xs={12} sm={7.4}  md={8.3} lg={8.8}  order={{xs:2, sm:2 , md:2, lg:1}}>
                <div>
                    <Typography fontFamily='fantasy'>
                        <div
                            style={{ fontSize: '16px' }}
                            dangerouslySetInnerHTML={{ __html: curriculumDetail.cvDetail } || "No CV details available"}
                        />
                    </Typography>
                </div>

                <Link to='/curriculum'>
                    <Button sx={{ textTransform: 'none', mt: '30px' }} size="small" variant="outlined" className="flex items-center gap-3 bg-red-900">
                        See all Curriculum
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

            <Grid  item xs={12} sm={4.3}  md={3.5} lg={3} className='border border-gray-100'   order={{xs:1, sm:1 , md:1, lg:1}}>
                <div  className="full group relative block overflow-hidden">
                    <img
                        src={curriculumDetail.thumbnailImage ? `${IMAGE_URL}${curriculumDetail.thumbnailImage}` : defaultImage}
                        alt="Team Member"
                        onError={(e) => { e.target.src = defaultImage; }}
                        className="h-52 w-2/3 mx-auto object-cover transition duration-500 group-hover:scale-105  sm:h-52"
                    />
                    <div className="relative px-2 bg-white">
                        <h3 className="mt-1 text-lg font-medium text-gray-900">{`${curriculumDetail.title}`}</h3>
                        <h3 className="text-sm font-medium text-gray-900">{ extractDate(curriculumDetail.publishedAt)}</h3>
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}

export default CurriculumPage
