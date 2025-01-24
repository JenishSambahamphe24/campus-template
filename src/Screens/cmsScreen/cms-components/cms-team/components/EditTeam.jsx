import React, { useState, useEffect } from 'react' ;
import {
    Typography,
    Stack,
    DialogActions,
    Grid,
    Button,
    IconButton,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getTeamById, updateTeamById } from '../teamApi';
import { toast } from 'react-toastify';
import RichEditor from '../../cms-project/components/RichEditor';
import { extractDate } from '../../../../../Components/utilityFunctions';
import FileDroppable from '../../cms-gallery/FileDroppable';
import { useParams, useNavigate } from 'react-router-dom';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function EditTeam() {
    const { teamId } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        position: '',
        fbUrl: '',
        twitterUrl: '',
        cvDetail: '',
        index: null,
        ppImage: null,
        status: false,
    });

    const [fetchedImage, setFetchedImage] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (teamId) {
                try {
                    const data = await getTeamById(teamId);
                    setFormData((prev) => ({
                        ...prev,
                        ...data, // Assuming data has keys that match formData
                        ppImage: null, // Reset local image to allow new upload
                    }));
                    setFetchedImage(data.ppImage);  // Save fetched ppImage
                } catch (error) {
                    console.error('Error fetching team data:', error);
                    toast.error('Failed to fetch team data');
                }
            }
        };
        fetchData();
    }, [teamId]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'status') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === 'true',
            }));
        } else if (name === 'phoneNo' && !/^\d*$/.test(value)) {
            return;
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleImageChange = (updatedFile, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: updatedFile[0] || null,
        }));
        setFetchedImage(null);
    };

    const handleRemoveFetchedImage = () => {
        setFetchedImage(null);
        setFormData((prev) => ({
            ...prev,
            ppImage: null, // Ensure formData is cleared for that image
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        if (formData.ppImage) {
            updatedData.append('ppImage', formData.ppImage);
        } else if (fetchedImage) {
            updatedData.append('ppImage', fetchedImage);
        }

        updatedData.append('firstName', formData.firstName);
        updatedData.append('middleName', formData.middleName);
        updatedData.append('lastName', formData.lastName);
        updatedData.append('email', formData.email);
        updatedData.append('phoneNo', formData.phoneNo);
        updatedData.append('position', formData.position);
        updatedData.append('fbUrl', formData.fbUrl);
        updatedData.append('twitterUrl', formData.twitterUrl);
        updatedData.append('cvDetail', formData.cvDetail);
        updatedData.append('status', formData.status);
        updatedData.append('index', formData.index);

        updatedData.append('createdAt', extractDate(formData.createdAt));
        updatedData.append('updatedAt', extractDate(formData.updatedAt || new Date())); // Current date if not provided

        try {
            await updateTeamById(teamId, updatedData);
            toast.success('Team updated successfully');
            setTimeout(() => {
                navigate('/admin/viewTeam');
            }, 700);
        } catch (error) {
            console.error('Error updating team:', error);
            toast.error('Failed to update team');
        }
    };

    return (
        <Grid container mx='auto' md={10} className='px-20 pb-10' >
            <h1 className='text-center pb-3 text-2xl  mx-auto'>  Edit Member </h1>
            <Stack component={Paper} width='100%' elevation='5' padding='20px' direction="column" >
                <form onSubmit={handleSubmit}>
                    <Grid container width="100%" spacing={2}>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Middle Name"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Last Name"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Email, Phone Number, and Position */}
                    <Grid container width="100%" spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Contact Number"
                                name="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleChange}
                                inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <TextField
                                fullWidth
                                size="small"
                                type='number'
                                variant="standard"
                                label="Employee Index"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                name="index"
                                value={formData.index}
                                onChange={handleChange}
                                inputProps={{
                                    min: 1, 
                                }}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                       
                    </Grid>

                    {/* Profile Picture Upload */}
                    <Grid border='1px solid #c2c2c2' borderRadius='8px' container width="100%" mt='10px' padding='10px'>
                        <Grid px='5px' item xs={6}>
                            <Typography>PP Image</Typography>
                            <FileDroppable
                                placeholder='New pp image'
                                name="ppImage"
                                allowMultiple={false}
                                onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'ppImage')}
                            />
                            {fetchedImage && (
                                <div style={{ position: 'relative', marginTop: '5px', width: '60px', height: '60px' }}>
                                    <img src={`${IMAGE_URL}/${fetchedImage}`} alt="Fetched" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />

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

                        {/* Status Field */}
                        <Grid px='5px' mt='15px' display='flex' justifyContent='center' item xs={6}>
                            <FormControl>
                                <FormLabel>Status</FormLabel>
                                <RadioGroup row value={formData.status} onChange={handleChange} name="status">
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Rich Text Editor for CV */}
                    <Grid width="100%" mt="1rem">
                        <RichEditor
                            placeholder="Enter CV details"
                            name="cvDetail"
                            value={formData.cvDetail}
                            onChange={(value) => setFormData((prev) => ({ ...prev, cvDetail: value }))}
                            height="400px"
                        />
                    </Grid>

                    <DialogActions>
                        <Button type="submit" size="small" variant="contained">Update </Button>
                    </DialogActions>
                </form>
            </Stack>
        </Grid>
    )
}

export default EditTeam