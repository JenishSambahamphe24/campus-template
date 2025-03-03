import React, { useState, useEffect } from 'react';
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
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getTeamById, updateTeamById } from '../teamApi';
import { toast } from 'react-toastify';
import { extractDate } from '../../../../../Components/utilityFunctions';
import FileDroppable from '../../cms-gallery/FileDroppable';
import { useParams, useNavigate } from 'react-router-dom';
import TipTapEditor from '../../../../../Components/Tiptap/TipTapEditor';

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
        category: '',
        subCategory: '',
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
                        ...data,
                        ppImage: null,
                    }));
                    setFetchedImage(data.ppImage);
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
        updatedData.append('category', formData.category);
        updatedData.append('subCategory', formData.subCategory);
        updatedData.append('index', formData.index);

        updatedData.append('createdAt', extractDate(formData.createdAt));
        updatedData.append('updatedAt', extractDate(formData.updatedAt || new Date()));

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

    console.log(formData)

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

                    <Grid container mt='2px' width="100%" spacing={2}>
                        <Grid item xs={4}>
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
                        <Grid item xs={4}>
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
                        <Grid item sm={12} md={4}>
                            <FormControl required size='small' fullWidth>
                                <InputLabel
                                    size='small'
                                    InputLabelProps={{
                                        sx: {
                                            '& .MuiInputLabel-asterisk': {
                                                color: 'brown',
                                            },
                                        },
                                    }}>Category</InputLabel>
                                <Select
                                    size='small'
                                    required
                                    variant='standard'
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label='Category'
                                >
                                    <MenuItem value='Committe member'> Committee Member</MenuItem>
                                    <MenuItem value='Teaching staff'>Teaching staff</MenuItem>
                                    <MenuItem value='Non-teaching staff'>Non-teaching staff</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                    <Grid mt='2px' container width="100%" spacing={2}>
                        <Grid item sm={12} md={4}>
                            <FormControl required size='small' fullWidth>
                                <InputLabel
                                    InputLabelProps={{
                                        sx: {
                                            '& .MuiInputLabel-asterisk': {
                                                color: 'brown',
                                            },
                                        },
                                    }}>Sub-category</InputLabel>
                                <Select
                                    size='small'
                                    variant='standard'
                                    required
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                    label='Sub-category'
                                >
                                    <MenuItem disabled={formData.category !== 'Committe member'} value='Chairman'>Chairman</MenuItem>
                                    <MenuItem disabled={formData.category !== 'Committe member'} value='Member'>Member</MenuItem>
                                    <MenuItem disabled={formData.category !== 'Teaching staff'} value='Campus Chief'> Campus Chief</MenuItem>
                                    <MenuItem disabled={formData.category === 'Committe member'} value='Information Officer'>Information Officer</MenuItem>
                                    <MenuItem disabled={formData.category === 'Committe member'} value='Other'>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={4}>
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
                                    <img src={`${IMAGE_URL}/team/${fetchedImage}`} alt="Fetched" style={{ width: '100%', height: '100%', borderRadius: '8px' }} />

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
                        <TipTapEditor
                            placeholder="Enter CV details"
                            name="cvDetail"
                            value={formData.cvDetail}
                            onChange={(value) => setFormData((prev) => ({ ...prev, cvDetail: value }))}
                            height="320px"
                        />
                    </Grid>
                    <div className='flex justify-end mt-2'>
                    <Button type="submit" size="small" variant="contained">Update </Button>
                    </div>
                </form>
            </Stack>
        </Grid>
    )
}

export default EditTeam