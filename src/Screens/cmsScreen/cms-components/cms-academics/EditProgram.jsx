import React, { useState, useEffect } from 'react'
import {
    Typography,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Button,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Paper,
} from '@mui/material';
import FileUpload from '../../../FileUpload';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import RichEditor from '../cms-project/components/RichEditor';
import { extractDate } from '../../../../Components/utilityFunctions';
import { getPublicationById, updatePublicationById, getPublicationCategory } from '../cms-publication/publicationApi';
import FileDroppableForFile from '../cms-gallery/FiledroppableForFile';
import { getFacultyById, getProgramById, getAllFaculties, updateProgramById } from './academicsApi';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;


function EditProgram() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [category, setCategory] = useState([])
    const [facultyName, setFacultyName] = useState([]);
    const [formData, setFormData] = useState({
        programName: '',
        programDetails: '',
        facultyName: '',
        status: false,
        shortName: '',
        runningFrom: '',
        hasProgramBroucher: false,
        programBrochureFile: null
    });
    const [fetchedFile, setFetchedFile] = useState(null)
    useEffect(() => {
        const fetchCategory = async () => {
            const faculty = await getAllFaculties();
            const bindedFaculty = faculty.reduce((acc, item) => {
                const { level, facultyName, id } = item;
                let existingLevel = acc.find(entry => entry.level === level);

                if (existingLevel) {
                    existingLevel.faculties.push({ facultyName, id });
                } else {
                    acc.push({
                        level,
                        faculties: [{ facultyName, id }]
                    });
                }
                return acc;
            }, []);

            setCategory(bindedFaculty);
        };

        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProgramById(id);
                const formattedDate = data.runningFrom ?
                    new Date(data.runningFrom).toISOString().split('T')[0] : '';
    
                // Find the matching category and set facultyName options
                const selectedCategory = category.find(cat => cat.level === data.level);
                if (selectedCategory) {
                    setFacultyName(selectedCategory.faculties);
                }
                    
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                    runningFrom: formattedDate,
                    level: data.level, // Explicitly set level
                    facultyId: data.facultyId, // Explicitly set facultyId
                    programBrochureFile: null,
                }));
                setFetchedFile(data.programBrochureFile);
            } catch (error) {
                console.error('Error fetching program data:', error);
            }
        };
        // Only fetch data if category is loaded
        if (category.length > 0) {
            fetchData();
        }
    }, [id, category]);

    const handleFileSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            file: file
        }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'level') {
            const selectedCategory = category.find(cat => cat.level === value);
            setFacultyName(selectedCategory ? selectedCategory.faculties : []);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        if (formData.programBrochureFile) {
            updatedData.append('programBrochureFile', formData.programBrochureFile)
        } else if (fetchedFile) {
            updatedData.append('programBrochureFile', fetchedFile)
        }
        updatedData.append('hasProgramBrochure', formData.hasProgramBrochure || '')
        updatedData.append('facultyId', formData.facultyId || '')
        updatedData.append('shortName', formData.shortName || '');
        updatedData.append('runningFrom', formData.runningFrom || '');
        updatedData.append('level', formData.level || '')
        updatedData.append('programName', formData.programName || '');
        updatedData.append('programDetails', formData.programDetails || '');
        updatedData.append('facultyName', formData.facultyName || '');
        updatedData.append('status', formData.status || false);
        updatedData.append('updatedAt', extractDate(formData.updatedAt || new Date()));
        try {
            await updateProgramById(id, updatedData);
            toast.success('Program updated successfully');
            setTimeout(() => {
                navigate('/admin/programs')
            }, 700)
        } catch (error) {
            console.error('Error updating Program:', error);
            toast.error('Failed to update Program');
        }
    };

    return (
        <div className='pb-10'>
            <form onSubmit={handleSubmit}>
                <Typography mb='20px' variant='h5' textAlign='center'>
                    Edit new Program
                </Typography>
                <Grid component={Paper} elevation={4} container width='90%' mx='auto' spacing='10px' paddingRight='10px' paddingBottom='10px'>

                    <Grid item sm={12} md={2}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'>Level</InputLabel>
                            <Select
                                id="demo-simple-select"
                                size="small"
                                label="Level"
                                name="level"
                                value={formData.level || ''} 
                                required
                                onChange={handleChange}
                            >
                                {
                                    category.map((item, index) => (
                                        <MenuItem key={index} value={item.level}>{item.level}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} md={2}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'>Faculty Name</InputLabel>
                            <Select
                                size='small'
                                label='Faculty Name'
                                name='facultyId'
                                required
                                InputLabelProps={{
                                    sx: {
                                        '& .MuiInputLabel-asterisk': {
                                            color: 'brown',
                                        },
                                    },
                                }}
                                value={formData.facultyId || ''}
                                onChange={handleChange}
                            >
                                {facultyName.length > 0 ? (
                                    facultyName.map((item, index) => (
                                        <MenuItem key={index} value={item.id}>
                                            {item.facultyName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Faculty Available</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} md={8}>
                        <TextField
                            fullWidth
                            size='small'
                            label='Program Title'
                            name='programName'
                            value={formData.programName}
                            onChange={handleChange}
                        />
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <TextField
                            fullWidth
                            size='small'
                            label='Short Name (Abbreviation)'
                            name='shortName'
                            value={formData.shortName}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item sm={12} md={3}>
                        <TextField
                            size='small'
                            fullWidth
                            required
                            InputLabelProps={{
                                shrink: true,
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }}
                            label='Program running From'
                            type='date'
                            name="runningFrom"
                            value={formData.runningFrom}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item sm={12} ml='10px ' md={4}>
                        <FormControl size='small' component="fieldset">
                            <FormLabel component="legend" id="demo-row-radio-buttons-group-label">Active Status?</FormLabel>
                            <RadioGroup
                                sx={{ marginTop: '-10px' }}
                                row
                                name="status"
                                onChange={handleChange}
                                value={formData.status}
                            >
                                <FormControlLabel value={true} control={<Radio size='small' />} label="Active" />
                                <FormControlLabel value={false} control={<Radio size='small' />} label="Inactive" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} md={6}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'> Do you want to upload Program Broucher?</InputLabel>
                            <Select
                                size='small'
                                label='Do you want to upload Program Broucher?'
                                name='hasProgramBroucher'
                                onChange={handleChange}
                                value={formData.hasProgramBroucher}
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} md={6}>
                        <FileUpload
                            required={formData.hasProgramBroucher}
                            disabled={!formData.hasProgramBroucher}
                            name='programBroucher'
                            label='upload Broucher'
                            onFileSelect={handleFileSelect}
                        />
                    </Grid>

                    <Grid item sm={12} md={12}>
                        <RichEditor
                            placeholder="Enter Program details"
                            name='programDetails'
                            value={formData.programDetails}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item sm={12} md={12}>
                        <Button
                            size='small'
                            variant='contained'
                            type='submit'
                        >
                            Edit Program
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default EditProgram