import React, { useState, useEffect } from 'react'
import {
    Typography,
    Stack,
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
    IconButton,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import FileDroppable from '../cms-gallery/FileDroppable';
import RichEditor from '../cms-project/components/RichEditor';
import { extractDate } from '../../../../Components/utilityFunctions';
import { getPublicationById, updatePublicationById, getPublicationCategory } from './publicationApi';
import FileDroppableForFile from '../cms-gallery/FiledroppableForFile';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;


function EditPublication() {
    const navigate = useNavigate()
    const { pubId } = useParams()
    const [category, setCategory] = useState([])
    const [subcategories, setSubcategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryName: '',
        subCategoryName: '',
        isScrollable: false,
        isPopUp: false,
        isTextDisplay: false,
        displayStatus: false,
    });
    const [fetchedImage, setFetchedImage] = useState(null);
    const [fetchedFile, setFetchedFile] = useState(null)

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
    }, [pubId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPublicationById(pubId)
                console.log(data)
                setFormData((prev) => ({
                    ...prev,
                    ...data,
                    thumbnailImage: null,
                    file: null,
                }));
                setFetchedImage(data.thumbnailImage);
                setFetchedFile(data.file)
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };
        fetchData()
    }, [pubId])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
            thumbnailImage: null,
        }));
    };

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
            file: null,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        if (formData.thumbnailImage) {
            updatedData.append('thumbnailImage', formData.thumbnailImage);
        } else if (fetchedImage) {
            updatedData.append('thumbnailImage', fetchedImage);
        }

        if (formData.file) {
            updatedData.append('file', formData.file)
        } else if (fetchedFile) {
            updatedData.append('file', fetchedFile)
        }

        updatedData.append('title', formData.title || '');
        updatedData.append('description', formData.description || '');
        updatedData.append('categoryName', formData.categoryName || '');
        updatedData.append('subCategoryName', formData.subCategoryName || '');
        updatedData.append('isScrollable', formData.isScrollable || false);
        updatedData.append('isPopUp', formData.isPopUp || false);
        updatedData.append('isTextDisplay', formData.isTextDisplay || false);
        updatedData.append('displayStatus', formData.displayStatus || false);
        updatedData.append('categoryId', formData.categoryId || '')
        updatedData.append('updatedAt', extractDate(formData.updatedAt || new Date()));
        try {
            await updatePublicationById(pubId, updatedData);
            toast.success('Project updated successfully');
            setTimeout(() => {
                navigate('/admin/publications')
            }, 700)
        } catch (error) {
            console.error('Error updating project:', error);
            toast.error('Failed to update project');
        }
    };

    return (
        <Grid container className='lg:px-20 pb-10'>
            <h1 className='text-center pb-3 text-2xl  mx-auto'> Edit content</h1>
            <Stack component={Paper} width='100%' elevation='5' padding='20px' direction='column' rowGap='10px'>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing='1rem'>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                size='small'
                                variant='standard'
                                label='Title of Publication'
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl size='small' fullWidth>
                                <InputLabel size='small'>Category</InputLabel>
                                <Select
                                    variant='standard'
                                    id="demo-simple-select"
                                    size='small'
                                    label='Category'
                                    name='categoryName'
                                    value={formData.categoryName}
                                    required InputLabelProps={{
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
                        <Grid item xs={3}>
                            <FormControl size='small' fullWidth>
                                <InputLabel size='small'>Sub-category</InputLabel>
                                <Select
                                    variant='standard'
                                    id="demo-simple-select"
                                    size='small'
                                    label='Sub-category'
                                    name='categoryId'
                                    required InputLabelProps={{
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
                    </Grid>

                    <Grid mt='.3rem' container>
                        <Grid item xs={3}>
                            <FormControl>
                                <FormLabel id="status"> Scrollable status ?</FormLabel>
                                <RadioGroup row value={formData.isScrollable} onChange={handleChange} name="isScrollable">
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item md={3}>
                            <FormControl>
                                <FormLabel id="status">Popuup Status</FormLabel>
                                <RadioGroup row value={formData.isPopUp} onChange={handleChange} name="isPopUp">
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>

                        <Grid item md={3}>
                            <FormControl>
                                <FormLabel id="status">Display Status ?</FormLabel>
                                <RadioGroup row value={formData.isTextDisplay} onChange={handleChange} name="isTextDisplay">
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl>
                                <FormLabel>Active Status</FormLabel>
                                <RadioGroup row value={formData.displayStatus} onChange={handleChange} name="displayStatus">
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid border='1px solid #c2c2c2' borderRadius='8px' container width="100%" mt='10px' padding='10px'>
                        <Grid px='5px' item xs={6}>
                            <Typography>Thumbnail Image</Typography>
                            <FileDroppable
                                placeholder='New thumbnail image'
                                name="thumbnailImage"
                                allowMultiple={false}
                                onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'thumbnailImage')}
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
                        <Grid px='5px' item xs={6}>
                            <Typography>File</Typography>
                            <FileDroppableForFile
                                name="file"
                                allowMultiple={false}
                                onFilesChange={(uploadedFile) => handleFileChange(uploadedFile, 'file')}
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


                    </Grid>
                    <Grid md={12} mt='.5rem'>
                        <RichEditor
                            placeholder=""
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            height='400px'
                        />
                    </Grid>
                    <Button sx={{ marginTop: '10px' }} type='submit' size='small' variant='contained' >
                        Update  content
                    </Button>
                </form>
            </Stack>
        </Grid>
    )
}

export default EditPublication