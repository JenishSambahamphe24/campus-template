import { useState, useEffect } from 'react';
import {
    Typography, Stack, Dialog, DialogContent, DialogActions,
    FormControl, RadioGroup, DialogTitle, Grid, Button,
    IconButton, TextField, FormControlLabel, Radio
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import RichEditor from '../cms-project/components/RichEditor';
import FileDroppable from '../cms-gallery/FileDroppable';
import { updateAboutUsById, getAboutUsById } from './aboutsAPI';
import { useNavigate, useParams } from 'react-router-dom';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;



function EditAboutUs() {
    const navigate = useNavigate()
    const { itemId } = useParams()
    const [formData, setFormData] = useState({
        aboutUsImage: null,
        workingAreaImage: null,
        heading: '',
        description: '',
        status: false,
    });
    const [fetchedImages, setFetchedImages] = useState({
        aboutUsImage: null,
        workingAreaImage: null,
    });

    // Fetch the data for editing
    useEffect(() => {
        const fetchData = async () => {
            if (itemId) {
                try {
                    const data = await getAboutUsById(itemId);
                    setFormData({
                        heading: data.heading,
                        description: data.description,
                        status: data.status,
                        aboutUsImage: null,
                        workingAreaImage: null
                    });
                    setFetchedImages({
                        aboutUsImage: data.aboutUsImage,
                        workingAreaImage: data.workingAreaImage,
                    });
                } catch (error) {
                    console.error('Error fetching about us data:', error);
                }
            }
        };
        fetchData();
    }, [itemId]);

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image changes
    const handleImageChange = (updatedFiles, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: updatedFiles[0] || null, // Update to new uploaded image
        }));
        // Ensure fetched image reference is cleared when a new image is uploaded
        setFetchedImages((prev) => ({
            ...prev,
            [type]: null,
        }));
    };

    // Remove fetched image
    const handleRemoveFetchedImage = (imageType) => {
        setFetchedImages((prev) => ({
            ...prev,
            [imageType]: null, // Remove fetched image
        }));
        setFormData((prev) => ({
            ...prev,
            [imageType]: null, // Ensure formData is cleared for that image
        }));
    };

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle file uploads
        const updatedData = new FormData();

        // Append image files if they exist
        if (formData.aboutUsImage) {
            updatedData.append('aboutUsImage', formData.aboutUsImage); // Append aboutUsImage if a new image is uploaded
        } else if (fetchedImages.aboutUsImage) {
            updatedData.append('aboutUsImage', fetchedImages.aboutUsImage); // Keep the existing image if no new one is uploaded
        }

        if (formData.workingAreaImage) {
            updatedData.append('workingAreaImage', formData.workingAreaImage); // Append workingAreaImage if a new image is uploaded
        } else if (fetchedImages.workingAreaImage) {
            updatedData.append('workingAreaImage', fetchedImages.workingAreaImage); // Keep the existing image if no new one is uploaded
        }

        // Append the other form fields
        updatedData.append('heading', formData.heading);
        updatedData.append('description', formData.description);
        updatedData.append('status', formData.status);

        try {
            await updateAboutUsById(itemId, updatedData); // Make API request with FormData
            toast.success('Content updated successfully');
            setTimeout(() => {
                navigate('/admin/aboutUs')
            }, 700)
        } catch (error) {
            console.error('Error updating content:', error);
            toast.error('Failed to update content');
        }
    };

    return (
        <Grid container className='lg:px-[15rem] pb-10'>
            <h1 className='text-center pb-3 text-2xl  mx-auto'> Edit about us info </h1>

            <Stack direction="column">
                <form onSubmit={handleSubmit}>
                    <Grid container spacing="1rem">
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Heading"
                                InputLabelProps={{ shrink: true }}
                                name="heading"
                                value={formData.heading}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid mt='7px' display="flex" justifyContent='center' item md={6}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* About Us Image */}
                    <Grid border='1px solid #c2c2c2' borderRadius='10px' mt='8px' container >
                        <Grid p='10px' item xs={6}>
                            <Typography>About Us Image</Typography>
                            {fetchedImages.aboutUsImage && !formData.aboutUsImage && (
                                <div style={{ position: 'relative', marginTop: '10px', width: '60px', height: '60px' }}>
                                    <img
                                        src={`${IMAGE_URL}${fetchedImages.aboutUsImage}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                        alt="About Us"
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveFetchedImage('aboutUsImage')}
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

                            <Grid item xs={12} mt={2}>
                                <FileDroppable
                                    placeholder='file'
                                    name="aboutUsImage"
                                    allowMultiple={false}
                                    onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'aboutUsImage')}
                                />
                            </Grid>
                        </Grid>

                        {/* Working Area Image */}
                        <Grid p='10px' item xs={6}>
                            <Typography>Working Area Image</Typography>
                            {fetchedImages.workingAreaImage && !formData.workingAreaImage && (
                                <div style={{ position: 'relative', marginTop: '10px', width: '60px', height: '60px' }}>
                                    <img
                                        src={`${IMAGE_URL}${fetchedImages.workingAreaImage}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                        }}
                                        alt="Working Area"
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveFetchedImage('workingAreaImage')}
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

                            <Grid item xs={12} mt={2}>
                                <FileDroppable
                                    placeholder='working area image'
                                    name="workingAreaImage"
                                    allowMultiple={false}
                                    onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'workingAreaImage')}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* Status */}


                    {/* Description */}
                    <Grid container mt='8px'>
                        <Grid item xs={12}>
                            <RichEditor
                                // ref
                                placeholder=""
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                height="200px"
                            />
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button type="submit" size="small" variant="contained">
                            Edit
                        </Button>
                    </DialogActions>
                </form>
            </Stack>
        </Grid>
    );
}

export default EditAboutUs;
