// import  { useState, useEffect } from 'react'
// import {
//     Typography,
//     Stack,
//     InputLabel,
//     Select,
//     MenuItem,
//     Grid,
//     Button,
//     TextField,
//     FormControl,
//     FormLabel,
//     RadioGroup,
//     Radio,
//     FormControlLabel,
//     IconButton,
//     Paper,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { toast } from 'react-toastify';
// import { useParams, useNavigate } from 'react-router-dom';
// import FileDroppable from '../cms-gallery/FileDroppable';
// import { extractDate } from '../../../../Components/utilityFunctions';
// import { getPublicationById, updatePublicationById, getPublicationCategory } from './publicationApi';
// import FileDroppableForFile from '../cms-gallery/FiledroppableForFile';
// import DateInputField from '../../../../Components/DateInputField';
// import TipTapEditor from '../../../../Components/Tiptap/TipTapEditor';
// const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;



// function EditPublication() {
//     const navigate = useNavigate();
//     const { pubId } = useParams();
//     const [category, setCategory] = useState([]);
//     const [subcategories, setSubcategories] = useState([]);
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         categoryName: '',
//         categoryId: '',
//         subCategoryName: '',
//         isScrollable: false,
//         isPopUp: false,
//         isTextDisplay: false,
//         displayStatus: false,
//         publishedAt: '',
//         expiredAt: '',
//         thumbnailImage: null,
//         file: null
//     });
//     const [fetchedImage, setFetchedImage] = useState(null);
//     const [fetchedFile, setFetchedFile] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         const fetchCategory = async () => {
//             try {
//                 const categoryData = await getPublicationCategory();
//                 const bindedCategory = categoryData.reduce((acc, item) => {
//                     const { categoryName, subCategoryName, id } = item;
//                     const existingCategory = acc.find(category => category.categoryName === categoryName);
//                     if (existingCategory) {
//                         existingCategory.subCategories.push({ subCategoryName, id });
//                     } else {
//                         acc.push({
//                             categoryName: categoryName,
//                             subCategories: [{ subCategoryName, id }]
//                         });
//                     }
//                     return acc;
//                 }, []);
//                 setCategory(bindedCategory);
//             } catch (error) {
//                 console.error('Error fetching categories:', error);
//                 toast.error('Failed to load categories');
//             }
//         };

//         fetchCategory();
//     }, []);

//     // Fetch publication data
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await getPublicationById(pubId);

//                 // Find the category and set subcategories
//                 const selectedCategory = category.find(cat => cat.categoryName === data.categoryName);
//                 if (selectedCategory) {
//                     setSubcategories(selectedCategory.subCategories);
//                 }

//                 setFormData(prev => ({
//                     ...prev,
//                     ...data,
//                     thumbnailImage: null,
//                     file: null
//                 }));

//                 setFetchedImage(data.thumbnailImage);
//                 setFetchedFile(data.file);
//             } catch (error) {
//                 console.error('Error fetching publication data:', error);
//                 toast.error('Failed to load publication data');
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (category.length > 0 && pubId) {
//             fetchData();
//         }
//     }, [pubId, category]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'categoryName') {
//             const selectedCategory = category.find(cat => cat.categoryName === value);
//             if (selectedCategory) {
//                 setSubcategories(selectedCategory.subCategories);
//                 // Check if current subcategory exists in new category
//                 const existingSubCategory = selectedCategory.subCategories.find(
//                     sub => sub.id === formData.categoryId
//                 );

//                 setFormData(prev => ({
//                     ...prev,
//                     categoryName: value,
//                     categoryId: existingSubCategory ? prev.categoryId : '',
//                     subCategoryName: existingSubCategory ? prev.subCategoryName : ''
//                 }));
//             }
//         } else if (name === 'categoryId') {
//             const selectedSubCategory = subcategories.find(sub => sub.id === value);
//             setFormData(prev => ({
//                 ...prev,
//                 categoryId: value,
//                 subCategoryName: selectedSubCategory ? selectedSubCategory.subCategoryName : ''
//             }));
//         } else {
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const handleImageChange = (updatedFile, type) => {
//         setFormData(prev => ({
//             ...prev,
//             [type]: updatedFile[0] || null,
//         }));
//         setFetchedImage(null);
//     };

//     const handleRemoveFetchedImage = () => {
//         setFetchedImage(null);
//         setFormData(prev => ({
//             ...prev,
//             thumbnailImage: null,
//         }));
//     };

//     const handleFileChange = (uploadedFile, type) => {
//         setFormData(prev => ({
//             ...prev,
//             [type]: uploadedFile[0] || null,
//         }));
//         setFetchedFile(null);
//     };

//     const handleRemoveFetchedFile = () => {
//         setFetchedFile(null);
//         setFormData(prev => ({
//             ...prev,
//             file: null,
//         }));
//     };

//     const handleDateChange = (name, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!formData.categoryName || !formData.categoryId) {
//             toast.error('Please select both category and subcategory');
//             return;
//         }

//         const updatedData = new FormData();

//         // Handle image and file uploads
//         if (formData.thumbnailImage) {
//             updatedData.append('thumbnailImage', formData.thumbnailImage);
//         } else if (fetchedImage) {
//             updatedData.append('thumbnailImage', fetchedImage);
//         }

//         if (formData.file) {
//             updatedData.append('file', formData.file);
//         } else if (fetchedFile) {
//             updatedData.append('file', fetchedFile);
//         }

//         Object.keys(formData).forEach(key => {
//             if (!['thumbnailImage', 'file', 'publishedAt', 'expiredAt', 'updatedAt'].includes(key)) {
//                 updatedData.append(key, formData[key] || '');
//             }
//         });

//         if (formData.publishedAt) {
//             updatedData.append('publishedAt', extractDate(formData.publishedAt));
//         }
//         if (formData.expiredAt) {
//             updatedData.append('expiredAt', extractDate(formData.expiredAt));
//         }
//         updatedData.append('updatedAt', extractDate(new Date()));

//         try {
//             await updatePublicationById(pubId, updatedData);
//             toast.success('Publication updated successfully');
//             setTimeout(() => {
//                 navigate('/admin/publications');
//             }, 700);
//         } catch (error) {
//             console.error('Error updating publication:', error);
//             toast.error('Failed to update publication');
//         }
//     };


//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <Grid container className='lg:px-20 pb-10'>
//             <h1 className='text-center pb-3 text-2xl mx-auto'>Edit Publication</h1>
//             <Stack component={Paper} width='100%' elevation={5} padding='20px' direction='column' spacing={2}>
//                 <form onSubmit={handleSubmit}>
//                     <Grid container spacing={2}>
//                         <Grid item xs={6}>
//                             <TextField
//                                 fullWidth
//                                 size='small'
//                                 variant='standard'
//                                 label='Title of Publication'
//                                 name='title'
//                                 value={formData.title}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={3}>
//                             <FormControl size='small' fullWidth required>
//                                 <InputLabel>Category</InputLabel>
//                                 <Select
//                                     variant='standard'
//                                     // disabled
//                                     label='Category'
//                                     name='categoryName'
//                                     value={formData.categoryName}
//                                     onChange={handleChange}
//                                 >
//                                     {category.map((item, index) => (
//                                         <MenuItem key={index} value={item.categoryName}>
//                                             {item.categoryName}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={3}>
//                             <FormControl size='small' fullWidth required>
//                                 <InputLabel>Sub-category</InputLabel>
//                                 <Select
//                                     variant='standard'
//                                     label='Sub-category'
//                                     name='categoryId'
//                                     value={formData.categoryId}
//                                     onChange={handleChange}
//                                 >
//                                     {subcategories.map((subCategory, index) => (
//                                         <MenuItem key={index} value={subCategory.id}>
//                                             {subCategory.subCategoryName}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                     </Grid>

//                     <Grid container spacing={2} mt={1}>
//                         <Grid item xs={3}>
//                             <DateInputField
//                                 variant='standard'
//                                 name="publishedAt"
//                                 label="Published Date"
//                                 value={formData.publishedAt}
//                                 onChange={(value) => handleDateChange("publishedAt", value)}
//                                 format="YYYY-MM-DD"
//                                 required
//                             />
//                         </Grid>
//                         <Grid item xs={3}>
//                             <FormControl>
//                                 <FormLabel>Scrollable Status</FormLabel>
//                                 <RadioGroup
//                                     row
//                                     value={formData.isScrollable}
//                                     onChange={handleChange}
//                                     name="isScrollable"
//                                 >
//                                     <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
//                                     <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
//                                 </RadioGroup>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={3}>
//                             <FormControl>
//                                 <FormLabel>Popup Status</FormLabel>
//                                 <RadioGroup
//                                     row
//                                     value={formData.isPopUp}
//                                     onChange={handleChange}
//                                     name="isPopUp"
//                                 >
//                                     <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
//                                     <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
//                                 </RadioGroup>
//                             </FormControl>
//                         </Grid>
//                         <Grid item xs={3}>
//                             <FormControl>
//                                 <FormLabel>Active Status</FormLabel>
//                                 <RadioGroup
//                                     row
//                                     value={formData.displayStatus}
//                                     onChange={handleChange}
//                                     name="displayStatus"
//                                 >
//                                     <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
//                                     <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
//                                 </RadioGroup>
//                             </FormControl>
//                         </Grid>
//                     </Grid>

//                     <Grid container className='border border-gray-300 rounded-lg mt-3 p-3'>
//                         <Grid item xs={6} className='px-2'>
//                             <Typography>Thumbnail Image</Typography>
//                             <FileDroppable
//                                 placeholder='Drop new thumbnail image here'
//                                 name="thumbnailImage"
//                                 allowMultiple={false}
//                                 onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'thumbnailImage')}
//                             />
//                             {fetchedImage && (
//                                 <div style={{ position: 'relative', marginTop: '5px', width: '100px', height: '80px' }}>
//                                     <img src={`${IMAGE_URL}/thumb/${fetchedImage}`} alt="Fetched" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
//                                     <IconButton
//                                         size="small"
//                                         onClick={handleRemoveFetchedImage}
//                                         style={{
//                                             position: 'absolute',
//                                             top: '-2px',
//                                             right: '-2px',
//                                             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                                         }}
//                                     >
//                                         <CloseIcon fontSize="small" />
//                                     </IconButton>
//                                 </div>
//                             )}
//                         </Grid>
//                         <Grid item xs={6} className='px-2'>
//                             <Typography>File</Typography>
//                             <FileDroppableForFile
//                                 name="file"
//                                 allowMultiple={false}
//                                 onFilesChange={(uploadedFile) => handleFileChange(uploadedFile, 'file')}
//                             />
//                             {fetchedFile && (
//                                 <div className="relative mt-2 bg-gray-100 p-2 rounded-md inline-flex items-center pr-12">
//                                     <p className="text-sm truncate max-w-[200px]">{fetchedFile}</p>
//                                     <IconButton
//                                         size="small"
//                                         onClick={handleRemoveFetchedFile}
//                                         style={{
//                                             position: 'absolute',
//                                             top: '-10px',
//                                             right: '-10px',
//                                             backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                                         }}
//                                     >
//                                         <CloseIcon fontSize="small" />
//                                     </IconButton>
//                                 </div>
//                             )}
//                         </Grid>
//                     </Grid>

//                     <Grid item xs={12} mt={2}>
//                         <TipTapEditor
//                             placeholder="Enter description..."
//                             name="description"
//                             value={formData.description}
//                             onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
//                             height="320px"
//                         />
//                     </Grid>

//                     <Button
//                         type='submit'
//                         variant='contained'
//                         size='small'
//                         className="mt-4"
//                     >
//                         Update Publication
//                     </Button>
//                 </form>
//             </Stack>
//         </Grid>
//     );
// }

// export default EditPublication


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
import { extractDate } from '../../../../Components/utilityFunctions';
import { getPublicationById, updatePublicationById, getPublicationCategory } from './publicationApi';
import FileDroppableForFile from '../cms-gallery/FiledroppableForFile';
import DateInputField from '../../../../Components/DateInputField';
import TipTapEditor from '../../../../Components/Tiptap/TipTapEditor';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;



function EditPublication() {
    const navigate = useNavigate();
    const { pubId } = useParams();
    const [category, setCategory] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        categoryName: '',
        categoryId: '',
        subCategoryName: '',
        isScrollable: false,
        isPopUp: false,
        isTextDisplay: false,
        displayStatus: false,
        publishedAt: '',
        expiredAt: '',
        thumbnailImage: null,
        file: null
    });
    const [fetchedImage, setFetchedImage] = useState(null);
    const [fetchedFile, setFetchedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const categoryData = await getPublicationCategory();
                const bindedCategory = categoryData.reduce((acc, item) => {
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
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
            }
        };

        fetchCategory();
    }, []);

    // Fetch publication data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPublicationById(pubId);

                // Find the category and set subcategories
                const selectedCategory = category.find(cat => cat.categoryName === data.categoryName);
                if (selectedCategory) {
                    setSubcategories(selectedCategory.subCategories);
                }

                setFormData(prev => ({
                    ...prev,
                    ...data,
                    thumbnailImage: null,
                    file: null
                }));

                setFetchedImage(data.thumbnailImage);
                setFetchedFile(data.file);
            } catch (error) {
                console.error('Error fetching publication data:', error);
                toast.error('Failed to load publication data');
            } finally {
                setIsLoading(false);
            }
        };

        if (category.length > 0 && pubId) {
            fetchData();
        }
    }, [pubId, category]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'categoryName') {
            const selectedCategory = category.find(cat => cat.categoryName === value);
            if (selectedCategory) {
                setSubcategories(selectedCategory.subCategories);
                // Check if current subcategory exists in new category
                const existingSubCategory = selectedCategory.subCategories.find(
                    sub => sub.id === formData.categoryId
                );

                setFormData(prev => ({
                    ...prev,
                    categoryName: value,
                    categoryId: existingSubCategory ? prev.categoryId : '',
                    subCategoryName: existingSubCategory ? prev.subCategoryName : ''
                }));
            }
        } else if (name === 'categoryId') {
            const selectedSubCategory = subcategories.find(sub => sub.id === value);
            setFormData(prev => ({
                ...prev,
                categoryId: value,
                subCategoryName: selectedSubCategory ? selectedSubCategory.subCategoryName : ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (updatedFile, type) => {
        setFormData(prev => ({
            ...prev,
            [type]: updatedFile[0] || null,
        }));
        setFetchedImage(null);
    };

    const handleRemoveFetchedImage = () => {
        setFetchedImage(null);
        setFormData(prev => ({
            ...prev,
            thumbnailImage: null,
        }));
    };

    const handleFileChange = (uploadedFile, type) => {
        setFormData(prev => ({
            ...prev,
            [type]: uploadedFile[0] || null,
        }));
        setFetchedFile(null);
    };

    const handleRemoveFetchedFile = () => {
        setFetchedFile(null);
        setFormData(prev => ({
            ...prev,
            file: null,
        }));
    };

    const handleDateChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.categoryName || !formData.categoryId) {
            toast.error('Please select both category and subcategory');
            return;
        }

        const updatedData = new FormData();

        // Handle image and file uploads
        if (formData.thumbnailImage) {
            updatedData.append('thumbnailImage', formData.thumbnailImage);
        } else if (fetchedImage) {
            updatedData.append('thumbnailImage', fetchedImage);
        }

        if (formData.file) {
            updatedData.append('file', formData.file);
        } else if (fetchedFile) {
            updatedData.append('file', fetchedFile);
        }

        Object.keys(formData).forEach(key => {
            if (!['thumbnailImage', 'file', 'publishedAt', 'expiredAt', 'updatedAt'].includes(key)) {
                updatedData.append(key, formData[key] || '');
            }
        });

        if (formData.publishedAt) {
            updatedData.append('publishedAt', extractDate(formData.publishedAt));
        }
        if (formData.expiredAt) {
            updatedData.append('expiredAt', extractDate(formData.expiredAt));
        }
        updatedData.append('updatedAt', extractDate(new Date()));

        try {
            await updatePublicationById(pubId, updatedData);
            toast.success('Publication updated successfully');
            setTimeout(() => {
                navigate('/admin/publications');
            }, 700);
        } catch (error) {
            console.error('Error updating publication:', error);
            toast.error('Failed to update publication');
        }
    };


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Grid container className='lg:px-20 pb-10'>
            <h1 className='text-center pb-3 text-2xl mx-auto'>Edit Publication</h1>
            <Stack component={Paper} width='100%' elevation={5} padding='20px' direction='column' spacing={2}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                size='small'
                                variant='standard'
                                label='Title of Publication'
                                name='title'
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl size='small' fullWidth required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    variant='standard'
                                    // disabled
                                    label='Category'
                                    name='categoryName'
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                >
                                    {category.map((item, index) => (
                                        <MenuItem key={index} value={item.categoryName}>
                                            {item.categoryName}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl size='small' fullWidth required>
                                <InputLabel>Sub-category</InputLabel>
                                <Select
                                    variant='standard'
                                    label='Sub-category'
                                    name='categoryId'
                                    value={formData.categoryId}
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

                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={3}>
                            <DateInputField
                                variant='standard'
                                name="publishedAt"
                                label="Published Date (B.S)"
                                value={formData.publishedAt}
                                onChange={(value) => handleDateChange("publishedAt", value)}
                                format="YYYY-MM-DD"
                                required
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <DateInputField
                                variant='standard'
                                name="expiredAt"
                                label="Expiry Date (B.S)"
                                value={formData.expiredAt}
                                onChange={(value) => handleDateChange("expiredAt", value)}
                                format="YYYY-MM-DD"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl>
                                <FormLabel>Scrollable Status</FormLabel>
                                <RadioGroup
                                    row
                                    value={formData.isScrollable}
                                    onChange={handleChange}
                                    name="isScrollable"
                                >
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControl>
                                <FormLabel>Popup Status</FormLabel>
                                <RadioGroup
                                    row
                                    value={formData.isPopUp}
                                    onChange={handleChange}
                                    name="isPopUp"
                                >
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel>Active Status</FormLabel>
                                <RadioGroup
                                    row
                                    value={formData.displayStatus}
                                    onChange={handleChange}
                                    name="displayStatus"
                                >
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container className='border border-gray-300 rounded-lg mt-3 p-3'>
                        <Grid item xs={6} className='px-2'>
                            <Typography>Thumbnail Image</Typography>
                            <FileDroppable
                                placeholder='Drop new thumbnail image here'
                                name="thumbnailImage"
                                allowMultiple={false}
                                onImagesChange={(updatedFiles) => handleImageChange(updatedFiles, 'thumbnailImage')}
                            />
                            {fetchedImage && (
                                <div style={{ position: 'relative', marginTop: '5px', width: '100px', height: '80px' }}>
                                    <img src={`${IMAGE_URL}/thumb/${fetchedImage}`} alt="Fetched" style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveFetchedImage}
                                        style={{
                                            position: 'absolute',
                                            top: '-2px',
                                            right: '-2px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </div>
                            )}
                        </Grid>
                        <Grid item xs={6} className='px-2'>
                            <Typography>File</Typography>
                            <FileDroppableForFile
                                name="file"
                                allowMultiple={false}
                                onFilesChange={(uploadedFile) => handleFileChange(uploadedFile, 'file')}
                            />
                            {fetchedFile && (
                                <div className="relative mt-2 bg-gray-100 p-2 rounded-md inline-flex items-center pr-12">
                                    <p className="text-sm truncate max-w-[200px]">{fetchedFile}</p>
                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveFetchedFile}
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

                    <Grid item xs={12} mt={2}>
                        <TipTapEditor
                            placeholder="Enter description..."
                            name="description"
                            value={formData.description}
                            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                            height="320px"
                        />
                    </Grid>

                    <Button
                        type='submit'
                        variant='contained'
                        size='small'
                        className="mt-4"
                    >
                        Update Publication
                    </Button>
                </form>
            </Stack>
        </Grid>
    );
}

export default EditPublication