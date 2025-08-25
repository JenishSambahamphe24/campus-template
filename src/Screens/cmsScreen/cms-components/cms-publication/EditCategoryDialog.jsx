import React, { useState, useEffect } from 'react';
import { Stack, Dialog, DialogContent, DialogActions, DialogTitle, Grid, Button, IconButton, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { getPublicationCategory, getPublicationCategoryById, updatePublicationCategoryById } from './publicationApi';
import { extractDate } from '../../../../Components/utilityFunctions';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function EditCategoryDialog({ handleClose, open, categoryId }) {
    const [allCatName, setAllCatName] = useState([]);

    const [formData, setFormData] = useState({
        categoryName: '',
        subCategoryName: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPublicationCategoryById(categoryId);
                const catResponse = await getPublicationCategory();
                setAllCatName(catResponse.map(item => item.categoryName));
                setFormData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            updatedAt: extractDate(formData.updatedAt)
        };
        try {
            await updatePublicationCategoryById(categoryId, formattedData);
            toast.success('Category updated successfully');
            handleClose();
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Failed to update category');
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 'auto auto', p: 1 }}>
                Edit Category Information
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                <Stack direction='column' rowGap='10px'>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing='1rem'>
                            <Grid item xs={6}>
                                <FormControl size='small' fullWidth>
                                    <InputLabel>Category Name </InputLabel>
                                    <Select
                                        required
                                        InputLabelProps={{
                                            sx: {
                                                '& .MuiInputLabel-asterisk': {
                                                    color: 'brown',
                                                },
                                            },
                                        }}
                                        variant='standard'
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleChange}
                                        label='Category Name'
                                    >
                                        {
                                            allCatName.length > 0 && (
                                                allCatName.map((item, index) => (
                                                    <MenuItem key={index} value={item}>{item}</MenuItem>
                                                ))
                                            )
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant='standard'
                                    name="subCategoryName"
                                    label='Sub Category'
                                    value={formData.subCategoryName}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button type='submit' size='small' variant='contained'>
                                Edit
                            </Button>
                        </DialogActions>
                    </form>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    );
}

export default EditCategoryDialog;