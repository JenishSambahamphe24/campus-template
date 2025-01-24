import React, { useState, useEffect } from 'react'
import { Grid, Box, Typography, Button, Stack, Divider } from '@mui/material'
import { BsTwitterX } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { FaLink } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { formatDate, formatDateShort, cleanDescription } from '../../../Components/utilityFunctions';
import { getAllpublication, getPublicationById } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
import DownloadIcon from '@mui/icons-material/Download';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const FILE_URL = import.meta.env.VITE_FILE_URL


function PublicationPage() {
    const [allPubData, setAllPubData] = useState([]);
    const [publicationDetail, setPublicationDetail] = useState({});
    const { id } = useParams()

    const imageForSideCard = 'https://media.istockphoto.com/id/1407890983/vector/newspaper-realistic-vector-illustration-background-of-the-page-headline-and-cover-of-old.jpg?s=612x612&w=0&k=20&c=uyB-_t4SbgkZxpc2CPk8_ELgNcnHTuUBPenHTIiRZIc='

    const defaultImage = 'https://media.istockphoto.com/id/1389157460/photo/newspaper-and-digital-tablet-on-wooden-table.jpg?s=612x612&w=0&k=20&c=CNKIHIEE4HnEnqDpUCyvnEfbf8nn90jRfX6TmhbGBxc='

    useEffect(() => {
        const fetchAllPubData = async () => {
            const data = await getAllpublication()
            const allData = data.filter((item) => item.categoryName === 'Publication')
            setAllPubData(allData)
        };
        const fetchData = async () => {
            const data = await getPublicationById(id)
            setPublicationDetail(data)
        };
        fetchData()
        fetchAllPubData()
    }, [])



    return (
        <Box>
            <Grid position='relative' item xs={12}>
                <div className="mx-auto  ">
                    <img
                        src={publicationDetail.thumbnailImage ? `${IMAGE_URL}${publicationDetail.thumbnailImage}` : defaultImage}
                        className="h-[430px] w-full object-cover"
                        alt="..." />
                </div>
                <Box width='70%' sx={{ position: 'absolute', bottom: '20%', padding: '20px', marginLeft: '20px', borderLeft: '10px solid yellowgreen' }}>
                    <Typography color='white' fontWeight='bold' variant='h3'>
                        {publicationDetail.title}
                    </Typography>
                </Box>
            </Grid>

            <Grid container padding='10px 30px' spacing='20px' my='20px'>
                <Grid item xs='2' pr='10px' rowGap='20px' display='flex' flexDirection='column'  >
                    <Stack width='100%' spacing='5px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Published Date </Typography>
                        <Typography variant='subtitle2'>
                            {`${formatDateShort(publicationDetail.createdAt)}`}
                        </Typography>
                        <Divider sx={{ marginTop: '5px' }} />
                    </Stack>
                    <Stack width='100%' spacing='5px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>Category </Typography>
                        <Typography variant='subtitle2'>
                            {publicationDetail.subCategoryName}
                        </Typography>
                        <Divider sx={{ marginTop: '5px' }} />
                    </Stack>
                    <Stack width='100%' spacing='15px' direction='column'>
                        <Typography fontWeight='bold' variant='subtitle1'>social media</Typography>
                        <Stack mt='5px' direction='row' spacing='10px'>
                            {/* <BsFacebook style={{ fontSize: '18px' }} /> */}
                            <BsFacebook
                                style={{ fontSize: '18px', cursor: 'pointer' }}
                                onClick={() => {
                                    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                                    window.open(shareUrl, '_blank', 'noopener,noreferrer');
                                }}
                            />
                            <BsTwitterX style={{ fontSize: '18px' }} />
                            <FaLink style={{ fontSize: '18px' }} />
                        </Stack>
                        <Divider sx={{ marginTop: '5px' }} />
                    </Stack>
                    {
                        publicationDetail.file && publicationDetail.file !== "null" && publicationDetail.file !== " " && (
                            <a href={`${FILE_URL}${publicationDetail.file}`} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                <Button sx={{ textTransform: 'none', display: 'flex', paddingLeft: '5px' }} size='small' variant="contained" >
                                    Download file
                                    <DownloadIcon />
                                </Button>
                            </a>
                        )
                    }
                 
                </Grid>

                <Grid display='flex' flexDirection='column' item md={7}>
                    <Typography variant='h5' mb={4} fontSize='26px'> {publicationDetail.title} </Typography>
                    <Stack direction='column' spacing='20px'>
                        <div
                            style={{ fontSize: '16px' }}
                            dangerouslySetInnerHTML={{ __html: publicationDetail.description }}
                        />
                    </Stack>
                    
                </Grid>
                <Grid item xs='3' sx={{ minHeight: '94px' }}  >
                    <div className='mb-3'>
                        <h5 className='font-medium text-lg text-center'>Other Publications</h5>
                    </div>
                    <Stack spacing='1rem'>
                        {
                            allPubData.filter(item => item.id !== Number(id)).map((item, index) => (
                                <Link key={index} to={`/publication/${item.id}`}>
                                    <Grid item xs={12}  >
                                        <div className="flex w-full overflow-hidden bg-gray-200 rounded-lg shadow-lg ">
                                            <img
                                                src={`${IMAGE_URL}/${item.thumbnailImage}`}
                                                className="w-2/6 max-h-[5rem] bg-cover object-cover"
                                                onError={(e) => { e.target.src = defaultImage; }}
                                            />
                                            <div className="w-2/3  p-1 md:p-1">
                                                <h1 className="text-md font-bold text-gray-800 line-clamp-2">{item.title}</h1>
                                                <div className="flex text-sm items-center">
                                                    {formatDateShort(item.createdAt)}
                                                </div>

                                            </div>
                                        </div>
                                    </Grid>
                                </Link>
                            ))
                        }
                        <Link to='/publication'>
                        <Button sx={{ textTransform: 'none', mt: '5px', mb: '30px' }} size='small' variant="outlined" className="flex  items-center gap-3 bg-red-900">
                            Other publications
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
                    </Stack>

                </Grid>
               
            </Grid>
        </Box>
    )
}

export default PublicationPage