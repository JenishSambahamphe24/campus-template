import React, { useState, useEffect } from 'react'
import { Stack, Dialog, DialogContent, DialogActions, DialogTitle, Grid, Button, IconButton, TextField, } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
// import { getPublicationCategoryById, updatePublicationCategoryById } from './publicationApi';
import { extractDate } from '../../../../Components/utilityFunctions';
import { getFacultyById, updateFacultyById } from './academicsApi';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function EditFaculty({handleClose, open, categoryId}) {

    const [formData, setFormData] = useState({
        level: '',
        facultyName: ''
    })
console.log(formData)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getFacultyById(categoryId)
                setFormData(data)
            } catch (error) {
                console.error('Error fetching team data:', error);
            }
        };
        fetchData()
    }, [categoryId])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedData = {
            ...formData,
            createdAt: extractDate(formData.createdAt),
            updatedAt: extractDate(formData.updatedAt)
        }
        try {
            await updateFacultyById(categoryId, formattedData);
            toast.success('Category  updated successfully');
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
            <DialogTitle sx={{ m: 'auto auto', p: 1 }} >
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
            <DialogContent >
                <Stack direction='column' rowGap='10px'>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing='1rem'>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Level'
                                    name='level'
                                    value={formData.level}
                                    onChange={handleChange}

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant='standard'
                                    name="facultyName"
                                    label='Faculty Name'
                                    value={formData.facultyName}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button type='submit' size='small' variant='contained' >
                                Edit
                            </Button>
                        </DialogActions>
                    </form>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default EditFaculty