import { useState, useRef } from 'react'
import { TextField, Button, Grid, Typography, Paper, FormControl, RadioGroup, Radio, FormControlLabel, FormLabel, InputLabel, Select, MenuItem, Tooltip } from '@mui/material'
import { addTeam } from './teamApi'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import ImageUpload from '../../../../Components/ImageUpload'
import TipTapEditor from '../../../../Components/Tiptap/TipTapEditor'

function AddTeam() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const editorRef = useRef(null)
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
        cvDetail: '',
        index: 0,
        status: true,
        ppImage: null,
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phoneNo' && !/^\d*$/.test(value)) {
            return;
        }

        if (name === 'status') {
            setFormData(prev => ({
                ...prev,
                [name]: value === 'true'
            }));
        } else if (name === 'category') {
            // Reset subCategory when category changes
            setFormData(prev => ({
                ...prev,
                [name]: value,
                subCategory: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            ppImage: file
        }))
    }

    // Function to get subcategory options based on selected category
    const getSubCategoryOptions = () => {
        switch (formData.category) {
            case 'Committe member':
                return [
                    { value: 'Chairman', label: 'Chairman' },
                    { value: 'Member', label: 'Member' }
                ];
            case 'Teaching staff':
                return [
                    { value: 'Information Officer', label: 'Information Officer' },
                    { value: 'Campus Chief', label: 'Campus Chief' },
                    { value: 'Asst. Campus Chief', label: 'Asst. Campus Chief' },
                    { value: 'Professor', label: 'Professor' },
                    { value: 'Assistant professor', label: 'Assistant professor' }
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
        setLoading(true);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            await addTeam(formDataToSend);
            toast.success('Team added successfully');
            navigate('/admin/viewTeam');
        } catch (error) {
            console.error('Error adding team:', error);
            toast.error('Failed to add team');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='pb-12'>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add a new member
            </Typography>
            <Grid component={Paper} elevation={3} container width='70%' mx='auto' py='20px' px='20px' pr='25px' spacing='10px'>
                <Grid item md={4}>
                    <TextField
                        required
                        InputLabelProps={{
                            sx: {
                                '& .MuiInputLabel-asterisk': { color: 'brown' },
                            },
                        }}
                        fullWidth
                        size='small'
                        label='First Name'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <TextField
                        fullWidth
                        size='small'
                        label='Middle Name'
                        name='middleName'
                        value={formData.middleName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <TextField
                        required
                        InputLabelProps={{
                            sx: {
                                '& .MuiInputLabel-asterisk': { color: 'brown' },
                            },
                        }}
                        fullWidth
                        size='small'
                        label='Last Name'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <TextField
                        InputLabelProps={{
                            sx: {
                                '& .MuiInputLabel-asterisk': { color: 'brown' },
                            },
                        }}
                        fullWidth
                        size='small'
                        label='Email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <TextField
                        InputLabelProps={{
                            sx: {
                                '& .MuiInputLabel-asterisk': { color: 'brown' },
                            },
                        }}
                        fullWidth
                        size='small'
                        label='Phone Number'
                        name='phoneNo'
                        value={formData.phoneNo}
                        onChange={handleChange}
                        inputProps={{ pattern: "[0-9]*", inputMode: 'numeric' }}
                    />
                </Grid>
                <Grid item sm={12} md={4}>
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
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            label='Type'
                        >
                            <MenuItem value='Committe member'> Committee Member</MenuItem>
                            <MenuItem value='Teaching staff'>Teaching staff</MenuItem>
                            <MenuItem value='Non-teaching staff'>Non-teaching staff</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
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
                            required
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
                <Grid item md={4}>
                    <TextField
                        InputLabelProps={{
                            sx: {
                                '& .MuiInputLabel-asterisk': { color: 'brown' },
                            },
                        }}
                        fullWidth
                        size='small'
                        label='Position in the Team'
                        name='position'
                        value={formData.position}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <Tooltip title='Index should be managed according to Type . Meaning that start from 1,2,3... for committe member & same will be applied for Teaching and non-teaching'>
                        <TextField
                            fullWidth
                            size='small'
                            label='Employee Index'
                            name='index'
                            value={formData.index}
                            type='number'
                            required
                            InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': { color: 'brown' },
                                },
                            }}
                            inputProps={{ min: 0 }}
                            onChange={handleChange}
                        />
                    </Tooltip>

                </Grid>
                <Grid item md={6}>
                    <ImageUpload
                        name='ppImage'
                        label='Member Image'
                        disabled={false}
                        onImageSelect={handleImageSelect}
                    />
                </Grid>
                <Grid item md={6}>
                    <TextField
                        fullWidth
                        size='small'
                        label='Facebook URL'
                        name='fbUrl'
                        value={formData.fbUrl}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={4}>
                    <FormControl>
                        <FormLabel id="status">Status</FormLabel>
                        <RadioGroup row value={formData.status} onChange={handleChange} name="status">
                            <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                            <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item md={12}>
                    <TipTapEditor
                        ref={editorRef}
                        height='320px'
                        placeholder="Add description"
                        name='cvDetail'
                        value={formData.cvDetail}
                        onChange={(content) => {
                            setFormData(prev => ({ ...prev, cvDetail: content }));
                        }}
                    />
                </Grid>
                <Grid item md={12}>
                    <Button type='submit' size='small' variant='contained' disabled={loading}>
                        {loading ? 'Adding...' : 'Add member'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default AddTeam