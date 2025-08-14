
import { useState, useEffect } from 'react';
import {
    Typography,
    Stack,
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
import DateInputField from '../../../../../Components/DateInputField';

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const salutation = ['Mr.', 'Mrs.', 'Miss.', 'Professor', 'Professor Dr.', 'Associate Prof Dr.'];

function EditTeam() {
    const { teamId } = useParams()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        salutation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        position: '',
        category: '',
        subCategory: '',
        department: '',
        appointedDate: '',
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

        if (name === 'phoneNo' && !/^\d*$/.test(value)) {
            return;
        }

        if (name === 'status') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === 'true',
            }));
        } else if (name === 'category') {
            // Reset subCategory when category changes
            setFormData((prev) => ({
                ...prev,
                [name]: value,
                subCategory: ''
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleDateChange = (name, newValue) => {
        setFormData((prev) => ({
            ...prev,
            [name]: newValue
        }));
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
            ppImage: null,
        }));
    };

    const getSubCategoryOptions = () => {
        switch (formData.category) {
            case 'Committe member':
                return [
                    { value: 'Chairman', label: 'Chairman' },
                    { value: 'Vice-Chairman', label: 'Vice-Chairman' },
                    { value: 'Secretary', label: 'Secretary' },
                    { value: 'Treasurer', label: 'Treasurer' },
                    { value: 'Member', label: 'Member' },
                ];
            case 'Teaching staff':
                return [
                    { value: 'Information Officer', label: 'Information Officer' },
                    { value: 'Campus Chief', label: 'Campus Chief' },
                    { value: 'Asst. Campus Chief', label: 'Asst. Campus Chief' },
                    { value: 'Professor', label: 'Professor' },
                    { value: 'Assistant professor', label: 'Assistant professor' },
                    { value: 'Lecturer', label: 'Lecturer' },
                ];
            case 'Non-teaching staff':
                return [
                    { value: 'Information Officer', label: 'Information Officer' },
                    { value: 'Accountant', label: 'Accountant' },
                    { value: 'Assistant accountant', label: 'Assistant accountant' },
                    { value: 'Peon', label: 'Peon' },
                    { value: 'Librarian', label: 'Librarian' },
                    { value: 'Administrative or A/c Officer', label: 'Administrative or A/c Officer' },
                    { value: 'Asst. Accountant', label: 'Asst. Accountant' },
                    { value: 'Other', label: 'Other' }
                ];
            default:
                return [];
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();

        if (formData.ppImage) {
            updatedData.append('ppImage', formData.ppImage);
        } else if (fetchedImage) {
            updatedData.append('ppImage', fetchedImage);
        }

        updatedData.append('salutation', formData.salutation);
        updatedData.append('firstName', formData.firstName);
        updatedData.append('middleName', formData.middleName);
        updatedData.append('lastName', formData.lastName);
        updatedData.append('email', formData.email);
        updatedData.append('phoneNo', formData.phoneNo);
        updatedData.append('position', formData.position);
        updatedData.append('department', formData.department);
        updatedData.append('appointedDate', formData.appointedDate);
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

    return (
        <Grid container mx='auto' md={12} className='px-20 pb-10' >
            <Typography mb='20px' variant='h5' textAlign='center' width='100%'>
                Edit Member
            </Typography>
            <Stack component={Paper} width='100%' elevation='5' padding='20px' direction="column" >
                <form onSubmit={handleSubmit}>
                    {/* First Row: Salutation, First Name, Middle Name, Last Name */}
                    <Grid container width="100%" spacing={2}>
                        <Grid item xs={2}>
                            <FormControl required size='small' fullWidth>
                                <InputLabel
                                    InputLabelProps={{
                                        sx: {
                                            '& .MuiInputLabel-asterisk': {
                                                color: 'brown',
                                            },
                                        },
                                    }}>Salutation</InputLabel>
                                <Select
                                    required
                                    variant="standard"
                                    name="salutation"
                                    value={formData.salutation}
                                    onChange={handleChange}
                                    label='Salutation'
                                >
                                    {salutation.map((item, index) => (
                                        <MenuItem key={index} value={item}>{item}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3.3}>
                            <TextField
                                required
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': { color: 'brown' },
                                    },
                                }}
                                fullWidth
                                size="small"
                                variant="standard"
                                label="First Name"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3.4}>
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
                        <Grid item xs={3.3}>
                            <TextField
                                required
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': { color: 'brown' },
                                    },
                                }}
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

                    {/* Second Row: Email, Phone, Category, Sub-category */}
                    <Grid container mt='2px' width="100%" spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': { color: 'brown' },
                                    },
                                }}
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
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': { color: 'brown' },
                                    },
                                }}
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Phone Number"
                                name="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleChange}
                                inputProps={{ pattern: "[0-9]*", inputMode: "numeric" }}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl required size='small' fullWidth>
                                <InputLabel
                                    InputLabelProps={{
                                        sx: {
                                            '& .MuiInputLabel-asterisk': {
                                                color: 'brown',
                                            },
                                        },
                                    }}>Type</InputLabel>
                                <Select
                                    required
                                    variant="standard"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    label='Type'
                                >
                                    <MenuItem value='Committe member'>Committee Member</MenuItem>
                                    <MenuItem value='Teaching staff'>Teaching staff</MenuItem>
                                    <MenuItem value='Non-teaching staff'>Non-teaching staff</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
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
                                    required
                                    variant="standard"
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                    label='Sub-category'
                                    disabled={!formData.category}
                                >
                                    {getSubCategoryOptions().map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    {/* Third Row: Employee Index, Department, Appointed Date, Position */}
                    <Grid mt='2px' container width="100%" spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                required
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': { color: 'brown' },
                                    },
                                    shrink: true,
                                }}
                                fullWidth
                                size="small"
                                type='number'
                                variant="standard"
                                label="Employee Index"
                                name="index"
                                value={formData.index}
                                onChange={handleChange}
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': { color: 'brown' },
                                    },
                                }}
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <DateInputField
                                variant='standard'
                                label="Appointed date"
                                required
                                name="appointedDate"
                                value={formData.appointedDate}
                                onChange={(newValue) => handleDateChange("appointedDate", newValue)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': { color: 'brown' },
                                    },
                                    shrink: true,
                                }}
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Position in the Team"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Fourth Row: Facebook URL */}
                    <Grid mt='2px' container width="100%" spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                size="small"
                                variant="standard"
                                label="Facebook URL"
                                name="fbUrl"
                                value={formData.fbUrl}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    {/* Profile Picture Upload and Status */}
                    <Grid border='1px solid #c2c2c2' borderRadius='8px' container width="100%" mt='10px' padding='10px'>
                        <Grid px='5px' item xs={6}>
                            <Typography>Member Image</Typography>
                            <FileDroppable
                                placeholder='New member image'
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
                            placeholder="Add description"
                            name="cvDetail"
                            value={formData.cvDetail}
                            onChange={(value) => setFormData((prev) => ({ ...prev, cvDetail: value }))}
                            height="320px"
                        />
                    </Grid>
                    <div className='flex justify-end mt-2'>
                        <Button type="submit" size="small" variant="contained">Update Member</Button>
                    </div>
                </form>
            </Stack>
        </Grid>
    )
}

export default EditTeam