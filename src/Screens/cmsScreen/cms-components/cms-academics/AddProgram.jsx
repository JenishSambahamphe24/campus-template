import  { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, Button, Grid, FormControl, Typography, Paper, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import RichEditor from '../../../../Components/RichEditor';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAllFaculties, addProgram } from './academicsApi';
import DateInputField from '../../../../Components/DateInputField';
import FileUpload from '../../../../Components/FileUpload';
function AddProgram() {
    const navigate = useNavigate();
    const [level, setLevel] = useState([])
    const [facultyName, setFacultyName] = useState([]);
    const [formData, setFormData] = useState({
        facultyId: '',
        programName: '',
        shortName: '',
        runningFrom: '',
        hasProgramBrochure: true,
        programBrochureFile: '',
        programDetails: '',
        status: true
    });

    const handleFileChange = (file) => {
        setFormData(prev => ({
            ...prev,
            programBrochureFile: file
        }));
    };

    useEffect(() => {
        const fetchLevel = async () => {
            const levelData = await getAllFaculties();
            console.log('Fetched Level Data:', levelData); // Debugging line
            const bindedFacultyName = levelData.reduce((acc, item) => {
                const { level, facultyName, id } = item;
                const existingLevel = acc.find(levelObj => levelObj.level === level);
                if (existingLevel) {
                    existingLevel.facultyName.push({ facultyName, id });
                } else {
                    acc.push({
                        level,
                        facultyName: [{ facultyName, id }],
                    });
                }
                return acc;
            }, []);
            setLevel(bindedFacultyName);
        };
        fetchLevel();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = (value === 'true');

        setFormData(prev => ({
            ...prev,
            [name]: name === 'isPopUp' || name === 'isScrollable' || name === 'displayStatus' ? newValue : value
        }));

        if (name === 'level') {
            const selectedLevel = level.find(cat => cat.level === value);
            console.log('Selected Level:', selectedLevel);
            setFacultyName(selectedLevel ? selectedLevel.facultyName : []);
        } else if (name === 'facultyId') {
            setFormData(prev => ({
                ...prev,
                facultyId: value
            }));
        }
    };

    const handleDateChange = (name, newValue) => {
        setFormData((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataToSend.append(key, formData[key]);
        });
        try {
            const newProgram = await addProgram(formDataToSend);
            toast.success('Program added successfully');
            setTimeout(() => {
                navigate('/admin/programs');
            }, 700)
        } catch (error) {
            console.error('Error adding Program:', error);
            toast.error('Error adding Program');
        }
    };

    return (
        <div className='pb-10'>
            <form onSubmit={handleSubmit}>
                <Typography mb='20px' variant='h5' textAlign='center'>
                    Add new Program
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
                                required
                                onChange={handleChange}
                            >
                                {
                                    level.map((item, index) => (
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
                        <DateInputField
                            label="Program starting Date (B.S)"
                            name="runningFrom"
                            value={formData.runningFrom}
                            onChange={(newValue) => handleDateChange("runningFrom", newValue)}
                        />
                    </Grid>
                    <Grid item sm={12} ml='10px ' md={4}>
                        <FormControl size='small' component="fieldset">
                            <FormLabel component="legend" id="demo-row-radio-buttons-group-label">Active Status?</FormLabel>
                            <RadioGroup
                                sx={{ marginTop: '-10px' }}
                                row
                                name="displayStatus"
                                onChange={handleChange}
                                value={formData.displayStatus}
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
                                name='hasProgramBrochure'
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} md={6}>
                        <FileUpload
                            required={formData.hasProgramBrochure}
                            disabled={!formData.hasProgramBrochure}
                            name='programBrochureFile'
                            label='upload a program Broucher'
                            onFileSelect={handleFileChange}
                        />
                    </Grid>

                    <Grid item sm={12} md={12}>
                        <RichEditor
                            placeholder="Enter Program details"
                            name='programDetails'
                            value={formData.programDetails}
                            onChange={(content) => {
                                setFormData(prev => ({
                                    ...prev, programDetails: content
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
                            Add Content
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default AddProgram;

