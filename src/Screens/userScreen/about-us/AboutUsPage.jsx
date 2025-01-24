import React, { useState, useEffect } from 'react'
import { Grid, Button, Box } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { Typography } from '@mui/material'
import { getAboutUsById } from '../../cmsScreen/cms-components/cms-aboutUs/aboutsAPI'
import { cleanDescription } from '../../../Components/utilityFunctions'
import { Photo } from '@mui/icons-material'
const IMAGE_URL = import.meta.env.VITE_PHOTO_URL

function AboutUsPage() {
    const [data, setData] = useState({})
    const { id } = useParams()
    const defaultImage = 'https://tecdn.b-cdn.net/img/new/slides/041.jpg'
    console.log(IMAGE_URL)

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAboutUsById(id)
            setData(data)
        };
        fetchData()
    }, [])

    console.log(`${defaultImage}${data.aboutUsImage}`)

    return (
        <Box >
            <Grid position='relative' item xs={12}>
                <div className=" mx-auto ">
                    <img
                        src={data.aboutUsImage ? `${IMAGE_URL}${data.aboutUsImage}`: defaultImage}
                        onError={(e) => {e.target.src = defaultImage}}
                        className="w-full h-[250px] object-cover"
                        alt="..." />
                </div>
                <Box width='50%' sx={{ position: 'absolute', bottom: '20%', padding: '20px', marginLeft: '20px', borderLeft: '10px solid yellowgreen' }}>
                    <Typography color='white' fontWeight='bold' variant='h3'>
                        {data.heading}
                    </Typography>
                </Box>
            </Grid>
            <Grid container className='px-20 py-10'  mb='2rem' item sm={12}>
                {
                    <div
                        style={{ fontSize: '16px' }}
                        dangerouslySetInnerHTML={{ __html: data.description }}
                    />
                }
                <Box display='flex' >
                    <Link to='/team' >
                        <Button sx={{ textTransform: 'none', mb: '30px', mt:'20px' }} variant="outlined" className="flex  items-center gap-3 ">
                            view our team
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
                </Box>
            </Grid>
        </Box>
    )
}

export default AboutUsPage