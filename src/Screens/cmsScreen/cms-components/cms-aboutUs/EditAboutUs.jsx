import { useState, useEffect } from 'react';
import {
    Stack, DialogActions,
    FormControl, RadioGroup, Grid, Button,
    TextField, FormControlLabel, Radio
} from '@mui/material';

import { toast } from 'react-toastify';
import RichEditor from '../../../../Components/RichEditor';
import { updateAboutUsById, getAboutUsById } from './aboutsAPI';
import { useNavigate, useParams } from 'react-router-dom';


function EditAboutUs() {
    const navigate = useNavigate()
    const { itemId } = useParams()
    const [formData, setFormData] = useState({
        aboutUsImage: null,
        workingAreaImage: null,
        heading: '',
        description: '',
        status: true,
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

        const updatedData = new FormData();
        updatedData.append('heading', formData.heading);
        updatedData.append('description', formData.description);
        updatedData.append('status', formData.status);

        try {
            await updateAboutUsById(itemId, updatedData);
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
                                disabled
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

                    {/* Description */}
                    <Grid container mt='8px'>
                        <Grid item xs={12}>
                            <RichEditor
                                placeholder=""
                                name="description"
                                value={formData.description}
                                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                                height="400px"
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
