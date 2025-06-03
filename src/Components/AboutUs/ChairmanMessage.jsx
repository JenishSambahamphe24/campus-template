import { useState, useEffect } from 'react'
import { Grid, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import { getAllaboutUs } from '../../Screens/cmsScreen/cms-components/cms-aboutUs/aboutsAPI'
import { getAllTeams } from '../../Screens/cmsScreen/cms-components/cms-team/teamApi'
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const defaultImage = import.meta.env.VITE_LOGO_URL


function ChairmanMessage() {
    const [data, setData] = useState({})
    const [chairmanImage, setChairmanImage] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllaboutUs()
            if (data) {
                setData(data)
            } else {
                setData({})
            }
            setData(data.find(item => item.heading === 'Message-chairman'))
            const response = await getAllTeams()
            setChairmanImage(response.find(item => item.subCategory === 'Chairman').ppImage)
        };
        fetchData()
    }, [])
   
    return (
        <Grid container justifyContent='center' my={2}>
            <h1 className='text-2xl  text-center mt-4'> Message From Chairman</h1>
            {
                data ? (
                    <>
                        <div className=" w-full flex justify-center mx-auto ">
                            <img
                                src={chairmanImage ? `${IMAGE_URL}/team/${chairmanImage}` : defaultImage}
                                onError={(e) => { e.target.src = defaultImage }}
                                className="z-10 mt-4 w-[220px]  h-[220px] object-cover rounded-[50%]"
                                alt="..." />
                        </div>
                        <Grid item md={8} className='px-20  py-10 text-left'  >
                            <h1
                                className='text-lg'
                                dangerouslySetInnerHTML={{ __html: data.description }}
                            />

                            <div className='flex justify-center mt-8'>
                                <Link to='/team' >
                                    <Button sx={{ textTransform: 'none' }} variant="outlined" className="flex  items-center gap-3 ">
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
                            </div>
                        </Grid>
                    </>
                ) : (
                    <Grid item sm={12}>
                        <h1 className='text-center text-red-900 mt-8'>No data uploaded yet. please login to the cms and add chairman's message</h1>
                    </Grid>
                )
            }
        </Grid>
    )
}

export default ChairmanMessage