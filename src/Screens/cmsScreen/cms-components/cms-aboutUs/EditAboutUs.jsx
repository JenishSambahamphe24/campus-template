import { useState, useEffect } from 'react';
import {
    Stack, DialogActions,
    FormControl, RadioGroup, Grid, Button,
    TextField, FormControlLabel, Radio,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
import { toast } from 'react-toastify';
import { updateAboutUsById, getAboutUsById } from './aboutsAPI';
import { useNavigate, useParams } from 'react-router-dom';
import TipTapEditor from '../../../../Components/Tiptap/TipTapEditor';
import FileDroppable from '../cms-gallery/FileDroppable';

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
    const [fetchedImage, setFetchedImage] = useState(null);

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
                    setFetchedImage({
                        aboutUsImage: data.aboutUsImage,
                    });
                    console.log(`${IMAGE_URL}/aboutus/${fetchedImage}`)
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
        if (name === 'status') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === 'true',
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (updatedFiles, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: updatedFiles[0] || null,
        }));
        setFetchedImage(null);
    };

  const handleRemoveFetchedImage = () => {
        setFetchedImage(null);
        setFormData((prev) => ({
            ...prev,
            aboutUsImage: null,
        }));
    };

 const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        if (formData.aboutUsImage) {
            updatedData.append('aboutUsImage', formData.aboutUsImage);
        } else if (fetchedImage) {
            updatedData.append('aboutUsImage', fetchedImage);
        }

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
   
    console.log(fetchedImage)
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

                    <Grid container mt='10px' border='1px solid #c2c2c2' borderRadius='8px' padding='10px'>
                        <Grid item xs={12}>
                            <h1> About Us Image </h1>
                            <FileDroppable
                                placeholder='Upload about us image'
                                name="aboutUsImage"
                                allowMultiple={false}
                                onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'aboutUsImage')}
                            />
                            
                            {fetchedImage && (
                                <div style={{ position: 'relative', marginTop: '10px', width: '120px', height: '80px' }}>
                                    <img 
                                        src={`${IMAGE_URL}/aboutus/${fetchedImage.aboutUsImage}`} 
                                        alt="Current About Us" 
                                        style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            borderRadius: '8px',
                                            objectFit: 'cover'
                                        }} 
                                    />
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
                    </Grid>

                    {/* Description */}
                    <Grid container mt='15px'>
                        <Grid item xs={12}>
                            <TipTapEditor
                                placeholder=""
                                name="description"
                                value={formData.description}
                                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                                height="320px"
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
