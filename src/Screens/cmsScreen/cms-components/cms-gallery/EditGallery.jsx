import { useState, useEffect } from 'react';
import { Select, MenuItem, Typography, Stack, FormControl, Grid, TextField, Paper, InputLabel, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileDroppable from './FileDroppable';
import { useNavigate, useParams } from 'react-router-dom';
import { getGalleryById, updateGalleryById } from './galleryApii';
import { toast } from 'react-toastify';
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { deleteImageOfGallery } from './galleryApii';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;


function EditGallery() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        galleryType: '',
        galleryName: '',
        galleryDescription: '',
        thumbnailImage: null,
        videoUrl: '',
        sliderImage: null,
        multipleImage: null,
    })
    const [fetchedThumbnail, setFetchedThumbnail] = useState(null)

    const [images, setImages] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getGalleryById(id);
                const { gallery } = response;
                setFormData((prev) => ({
                    ...prev,
                    galleryType: gallery.galleryType,
                    galleryName: gallery.galleryName,
                    galleryDescription: gallery.galleryDescription,
                    thumbnailImage: gallery.thumbnailImage,
                    videoUrl: gallery.videoUrl || '',
                }));
                const { images } = response;
                setImages(images)
                setFetchedThumbnail(gallery.thumbnailImage);
            } catch (error) {
                console.error('Error fetching gallery data:', error);
                toast.error('Failed to fetch gallery data');
            }
        };
        fetchData();
    }, [id]);

    const handleImageChange = (updatedFile, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: updatedFile[0] || null,
        }));
        setFetchedThumbnail(null)
    };

    const handleRemoveFetchedImage = () => {
        setFetchedThumbnail(null);
        setFormData((prev) => ({
            ...prev,
            thumbnailImage: null,
        }));
    };

    const handleImageDelete = async (imageId) => {
        try {
            await deleteImageOfGallery(imageId);
            setImages(prevImages => prevImages.filter(image => image.id !== imageId));
            toast.success('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('Failed to delete image');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        if (formData.thumbnailImage) {
            updatedData.append('thumbnailImage', formData.thumbnailImage);
        } else if (fetchedThumbnail) {
            updatedData.append('thumbnailImage', fetchedThumbnail);
        }
        updatedData.append('galleryType', formData.galleryType || '');
        updatedData.append('galleryName', formData.galleryName || '');
        updatedData.append('galleryDescription', formData.galleryDescription || '');
        updatedData.append('videoUrl', formData.videoUrl || '');
        updatedData.append('sliderImage', formData.sliderImage || null);
        try {
            await updateGalleryById(id, updatedData);
            toast.success('Gallery updated successfully');
            setTimeout(() => {
                navigate('/admin/viewGallery');
            }, 900);
        } catch (error) {
            console.error('Error updating gallery:', error);
            toast.error('Failed to update gallery');
        }
    };

   
    return (
        <Grid container className='lg:px-[15rem] pb-10'>
            <h1 className='text-center pb-3 text-2xl  mx-auto'> Edit Gallery </h1>
            <Stack component={Paper} width='100%' elevation='5' padding='20px' direction='column' rowGap='10px'>
                <form onSubmit={handleSubmit}>
                    <Grid container mx='auto' spacing='10px' padding='10px 23px 10px 5px' >
                        <Grid item sm={12} md={3}>
                            <FormControl size='small' fullWidth>
                                <InputLabel size='small'>Gallery Type</InputLabel>
                                <Select
                                    disabled
                                    name='galleryType'
                                    value={formData.galleryType || ''}
                                    onChange={handleChange}
                                    label="Gallery Type"
                                    variant='standard'
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    size="small"
                                >
                                    <MenuItem value='Image'>Image</MenuItem>
                                    <MenuItem value='Slider'>Slider</MenuItem>
                                    <MenuItem value='Video'>Video</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item sm={12} md={9}>
                            <TextField
                                variant='standard'
                                fullWidth
                                size='small'
                                label='Gallery Name'
                                name='galleryName'
                                value={formData.galleryName || ''}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={handleChange}
                            />
                        </Grid>

                      

                        <Grid item sm={12} md={9}>
                            <TextField
                                disabled={formData.galleryType === 'Image'}
                                variant='standard'
                                fullWidth
                                size='small'
                                label='Video URL'
                                name='videoUrl'
                                value={formData.videoUrl || ''}
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item sm={12} md={4} >
                            <Typography mb='10px'>Thumbnail Image</Typography>
                            <FileDroppable
                                name="thumbnailImage"
                                allowMultiple={false}
                                placeholder='Thumbnail image'
                                onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'thumbnailImage')}
                            />
                            {fetchedThumbnail && (
                                <div style={{ position: 'relative', marginTop: '5px', width: '60px', height: '60px' }}>
                                    <img src={`${IMAGE_URL}/thumb/${fetchedThumbnail}`} alt="Fetched" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                    <IconButton
                                        size="small" 
                                        onClick={handleRemoveFetchedImage}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                        </Grid>

                        <Grid container alignContent='flex-start' columnGap='10px' mt='10px' ml='10px' sm={12} md={7} >
                            <Grid item sm={12}>
                                <Typography mb='10px'>Gallery  Images</Typography>

                            </Grid>
                            {
                                images.map((item, index) => (
                                    <Grid item sm={1.9} bgcolor='teal' key={index} className='relative'>
                                        <img className='w-full h-20 object-cover' src={`${IMAGE_URL}/images/${item.image}`} alt="" />
                                        <button type='button' onClick={() => handleImageDelete(item.id)} className='bg-white absolute top-0 p-[2px] rounded-md right-0'>
                                            <IoCloseSharp />
                                        </button>
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Grid>
                    <Grid item sm={12} gap='20px' className='flex justify-end mt-2'>
                        <Button size="small" color='error' variant="outlined"> <Link to='/admin/viewGallery'> cancel</Link> </Button>
                        <Button type="submit" size="small" variant="contained">Update </Button>
                    </Grid>
                </form>
            </Stack>
        </Grid>
    )
}

export default EditGallery