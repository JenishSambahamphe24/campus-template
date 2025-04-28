import { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, InputLabel, Button, Grid, FormControl, Paper, Radio, RadioGroup, FormControlLabel, FormLabel } from '@mui/material';
import { toast } from 'react-toastify';
import { addPublication, getPublicationCategory } from './publicationApi';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../../../../Components/ImageUpload';
import FileUpload from '../../../../Components/FileUpload';
import DateInputField from '../../../../Components/DateInputField';
import TipTapEditor from '../../../../Components/Tiptap/TipTapEditor';

function AddPublication() {
    const navigate = useNavigate();
    const [category, setCategory] = useState([])
    const [subcategories, setSubcategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryId: '',
        title: '',
        isScrollable: false,
        isPopUp: false,
        displayStatus: true,
        isFile: false,
        file: '',
        isImage: false,
        thumbnailImage: '',
        description: '',
        createdBy: 1,
        publishedAt: '',
        expiredAt: '',
        popUpImage: '',
        popUpExpiryDate: '',
        scrollExpiryDate: '',
        isTextDisplay: false,
    });

    const thumbnailImageSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            thumbnailImage: file
        }))
    }

    const handleFileSelect = (file) => {
        setFormData(prev => ({
            ...prev,
            file: file
        }));
    };

    useEffect(() => {
        const fetchCategory = async () => {
            const category = await getPublicationCategory();
            const bindedCategory = category.reduce((acc, item) => {
                const { categoryName, subCategoryName, id } = item;
                const existingCategory = acc.find(category => category.categoryName === categoryName);
                if (existingCategory) {
                    existingCategory.subCategories.push({ subCategoryName, id });
                } else {
                    acc.push({
                        categoryName: categoryName,
                        subCategories: [{ subCategoryName, id }]
                    });
                }
                return acc;
            }, []);
            setCategory(bindedCategory);
        };

        fetchCategory();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = (value === 'true');
        setFormData(prev => ({
            ...prev,
            [name]: name === 'isPopUp' || name === 'isScrollable' || name === 'displayStatus' ? newValue : value
        }));

        if (name === 'categoryName') {
            const selectedCategory = category.find(cat => cat.categoryName === value);
            setSubcategories(selectedCategory ? selectedCategory.subCategories : []);
        } else if (name === 'categoryId') {
            setFormData(prev => ({
                ...prev,
                categoryId: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        if (!formData.scrollExpiryDate) {
            delete formData.scrollExpiryDate;
        } else {
            formDataToSend.append('scrollExpiryDate', formData.scrollExpiryDate);
        }

        if (!formData.popUpExpiryDate) {
            delete formData.popUpExpiryDate;
        } else {
            formDataToSend.append('popUpExpiryDate', formData.popUpExpiryDate);
        }

        if (!formData.expiredAt) {
            delete formData.expiredAt;
        } else {
            formDataToSend.append('expiredAt', formData.expiredAt);
        }

        Object.keys(formData).forEach((key) => {
            if (formData[key] !== undefined && key !== 'expiredAt' && key !== 'scrollExpiryDate' && key !== 'popUpExpiryDate') {
                formDataToSend.append(key, formData[key]);
            }
        });
        try {
            const newPublication = await addPublication(formDataToSend);
            toast.success('Publication added successfully');
            setTimeout(() => {
                navigate('/admin/publications');
            }, 700)
        } catch (error) {
            console.error('Error adding publication:', error);
            toast.error('Error adding publication');
        }
    };

    const handleDateChange = (name, newValue) => {
        setFormData((prev) => ({
            ...prev,
            [name]: newValue
        }));
    };

    return (
        <div className='pb-10'>
            <form onSubmit={handleSubmit}>
                <h1 className='text-center mb-6 text-2xl'>
                    Add new content
                </h1>
                <Grid component={Paper} elevation={4} container width='90%' mx='auto' spacing='10px' paddingRight='10px' paddingBottom='10px'>

                    <Grid item sm={12} md={2}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'>Category</InputLabel>
                            <Select
                                id="demo-simple-select"
                                size='small'
                                label='Category'
                                name='categoryName'
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
                                {
                                    category.map((item, index) => (
                                        <MenuItem key={index} value={item.categoryName}>{item.categoryName}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} md={2}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'>Sub-category</InputLabel>
                            <Select
                                id="demo-simple-select"
                                size='small'
                                label='Sub-category'
                                name='categoryId'
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
                                {subcategories.map((subCategory, index) => (
                                    <MenuItem key={index} value={subCategory.id}>
                                        {subCategory.subCategoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} md={8}>
                        <TextField
                            fullWidth
                            size='small'
                            label='Content Title'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid border='1px solid #c2c2c2' borderRadius='5px' mt='10px' ml='10px' container paddingLeft='10px' justifyContent='space-between'>
                        <Grid item sm={12} md={4}>
                            <FormControl size='small'>
                                <FormLabel id="demo-row-radio-buttons-group-label">Popup status ?</FormLabel>
                                <RadioGroup
                                    row
                                    name="isPopUp"
                                    onChange={handleChange}
                                    defaultValue={formData.isPopUp}
                                >
                                    <FormControlLabel value={true} control={<Radio size='small' />} label="active" />
                                    <FormControlLabel value={false} control={<Radio size='small' />} label="inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <FormControl size='small'>
                                <FormLabel id="demo-row-radio-buttons-group-label">Scrollable status ?</FormLabel>
                                <RadioGroup
                                    row
                                    name="isScrollable"
                                    onChange={handleChange}
                                    value={formData.isScrollable}
                                >
                                    <FormControlLabel value={true} control={<Radio size='small' />} label="active" />
                                    <FormControlLabel value={false} control={<Radio size='small' />} label="inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item sm={12} md={4}>
                            <FormControl size='small'>
                                <FormLabel id="demo-row-radio-buttons-group-label">Active Status ?</FormLabel>
                                <RadioGroup
                                    row
                                    name="displayStatus"
                                    onChange={handleChange}
                                    value={formData.displayStatus}
                                >
                                    <FormControlLabel value={true} control={<Radio size='small' />} label="active" />
                                    <FormControlLabel value={false} control={<Radio size='small' />} label="inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item sm={12} md={2}>
                        <DateInputField
                            label="Published Date (B.S)"
                            name="publishedAt"
                            required
                            value={formData.publishedAt}
                            onChange={(newValue) => handleDateChange("publishedAt", newValue)}
                        />

                    </Grid>
                    <Grid item sm={12} md={2}>
                        <DateInputField
                            label="Expiry Date (B.S)"
                            name="expiredAt"
                            value={formData.expiredAt}
                            onChange={(newValue) => handleDateChange("expiredAt", newValue)}
                        />
                    </Grid>
                    <Grid item sm={12} md={2}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'>Want Thumbnaill ?</InputLabel>
                            <Select
                                size='small'
                                label='want Thumbnail? '
                                name='isImage'
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item sm={12} md={3}>
                        <ImageUpload
                            name='thumbnailImage'
                            label='Thumbnail Image'
                            disabled={!formData.isImage}
                            required={formData.isImage}
                            onImageSelect={thumbnailImageSelect}
                        />
                    </Grid>
                    <Grid item sm={12} md={3}>
                        <FormControl size='small' fullWidth>
                            <InputLabel size='small'> Want to upload File?</InputLabel>
                            <Select
                                size='small'
                                label='want to uploadFile?'
                                name='isFile'
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value={true}>Yes</MenuItem>
                                <MenuItem value={false}>No</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item sm={12} md={4}>
                        <FileUpload
                            required={formData.isFile}
                            disabled={!formData.isFile}
                            name='file'
                            label='upload a pdf file'
                            onFileSelect={handleFileSelect}
                        />
                    </Grid>

                    <Grid item sm={12} md={12}>
                        <TipTapEditor
                            placeholder="Enter Publication details"
                            height='320px'
                            name='description'
                            value={formData.description}
                            onChange={(content) => setFormData((prev) => ({
                                ...prev,
                                description: content
                            }))}
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

export default AddPublication;

