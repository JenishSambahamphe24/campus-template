import { useState, useEffect } from 'react'
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
    IconButton,
    Radio,
    FormControlLabel,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { extractDate } from '../../../../Components/utilityFunctions';
import DateInputField from '../../../../Components/DateInputField';
import FileDroppableForFile from '../cms-gallery/FiledroppableForFile';
import { getProgramById, getAllFaculties, updateProgramById } from './academicsApi';
import TipTapEditor from '../../../../Components/Tiptap/TipTapEditor';


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
        runningFrom: null,
        hasProgramBrochure: false,
        programBrochureFile: null
    });
    const [fetchedFile, setFetchedFile] = useState(null)
    
    useEffect(() => {
        const fetchCategory = async () => {
            try {
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
            } catch (error) {
                console.error('Error fetching faculties:', error);
                toast.error('Failed to load faculty data');
            }
        };
        fetchCategory();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProgramById(id);
                const formattedDate = data.runningFrom ?
                    new Date(data.runningFrom).toISOString().split('T')[0] : null;
                    
                // Update faculty list based on level if it exists
                if (data.level && category.length > 0) {
                    const selectedCategory = category.find(cat => cat.level === data.level);
                    if (selectedCategory) {
                        setFacultyName(selectedCategory.faculties);
                    }
                }

                setFormData((prev) => ({
                    ...prev,
                    ...data,
                    runningFrom: formattedDate,
                    level: data.level,
                    facultyId: data.facultyId,
                    programBrochureFile: null,
                }));
                
                if (data.programBrochureFile) {
                    setFetchedFile(data.programBrochureFile);
                }
            } catch (error) {
                console.error('Error fetching program data:', error);
                toast.error('Failed to load program data');
            }
        };
        // Only fetch data if category is loaded
        if (category.length > 0) {
            fetchData();
        }
    }, [id, category]);


    const handleFileChange = (uploadedFile, type) => {
        setFormData((prev) => ({
            ...prev,
            [type]: uploadedFile[0] || null,
        }));
        setFetchedFile(null);
    };

    const handleRemoveFetchedFile = () => {
        setFetchedFile(null);
        setFormData((prev) => ({
            ...prev,
            programBrochureFile: null,
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
        try {
            const updatedData = new FormData();
            
            // Handle file upload
            if (formData.programBrochureFile) {
                updatedData.append('programBrochureFile', formData.programBrochureFile);
            } else if (fetchedFile) {
                updatedData.append('programBrochureFile', fetchedFile);
            }
            
            // Handle date - Convert null/empty to a valid value or don't append at all
            if (formData.runningFrom) {
                updatedData.append('runningFrom', formData.runningFrom);
            } else {
                // Either use null (if your backend can handle it) or a default date
                // updatedData.append('runningFrom', null); // Not recommended with FormData
                // Or don't append it at all if the backend can handle missing fields
            }
            
            // Append all other form fields
            updatedData.append('hasProgramBrochure', formData.hasProgramBrochure ? 'true' : 'false');
            updatedData.append('facultyId', formData.facultyId || '');
            updatedData.append('shortName', formData.shortName || '');
            updatedData.append('level', formData.level || '');
            updatedData.append('programName', formData.programName || '');
            updatedData.append('programDetails', formData.programDetails || '');
            updatedData.append('facultyName', formData.facultyName || '');
            updatedData.append('status', formData.status ? 'true' : 'false');
            updatedData.append('updatedAt', extractDate(new Date()));
            
            await updateProgramById(id, updatedData);
            toast.success('Program updated successfully');
            setTimeout(() => {
                navigate('/admin/programs');
            }, 700);
        } catch (error) {
            console.error('Error updating Program:', error);
            toast.error('Failed to update Program: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDateChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className='pb-10'>
            <form onSubmit={handleSubmit}>
                <Typography mb='20px' variant='h5' textAlign='center'>
                    Edit Program
                </Typography>
                <Grid component={Paper} elevation={4} container width='90%' mx='auto' spacing='10px' paddingRight='10px' paddingBottom='10px'>
                    <Grid item sm={12} md={2}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'>Level</InputLabel>
                            <Select
                                id="demo-simple-select"
                                disabled
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
                                disabled
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
                            value={formData.programName || ''}
                            onChange={handleChange}
                            required
                        />
                    </Grid>

                    <Grid item sm={12} md={3}>
                        <TextField
                            fullWidth
                            size='small'
                            label='Short Name (Abbreviation)'
                            name='shortName'
                            value={formData.shortName || ''}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item sm={12} md={3}>
                        <DateInputField
                            name="runningFrom"
                            label="Program running From"
                            value={formData.runningFrom || ''}
                            onChange={(value) => handleDateChange("runningFrom", value)}
                            format="YYYY-MM-DD"
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

                    {/* <Grid item sm={12} md={4}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'>Do you want to upload Program Brochure?</InputLabel>
                            <Select
                                size='small'
                                label='Do you want to upload Program Brochure?'
                                name='hasProgramBrochure'
                                onChange={handleChange}
                                value={formData.hasProgramBrochure}
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {formData.hasProgramBrochure && (
                        <Grid item sm={12} md={4}>
                            <FileDroppableForFile
                                name="file"
                                allowMultiple={false}
                                onFilesChange={(uploadedFile) => handleFileChange(uploadedFile, 'programBrochureFile')}
                            />
                            {fetchedFile && (
                                <div
                                    className="relative mt-1 bg-gray-200 p-2 rounded-md inline-flex items-center"
                                    style={{ paddingRight: '50px' }}
                                >
                                    <p className="text-sm">{fetchedFile}</p>

                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveFetchedFile}
                                        style={{
                                            position: 'absolute',
                                            top: '3px',
                                            right: '3px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                        </Grid>
                    )} */}

                    <Grid item sm={12} md={12}>
                        <TipTapEditor
                            placeholder="Enter Program details"
                            name='programDetails'
                            height='320px'
                            value={formData.programDetails || ''}
                            onChange={(content) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    programDetails: content
                                }))
                            }}
                        />
                    </Grid>
                    <Grid item sm={12} md={12}>
                        <Button
                            size='small'
                            variant='contained'
                            type='submit'
                        >
                            Update Program
                        </Button>
                        <Button
                            size='small'
                            variant='outlined'
                            onClick={() => navigate('/admin/programs')}
                            sx={{ ml: 2 }}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default EditProgram