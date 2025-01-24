import React, { useState, useEffect } from 'react'
import { Stack, Dialog, DialogContent, DialogActions, DialogTitle, Grid, Button, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { extractDate } from '../../../../Components/utilityFunctions';
import { getLinkById, updateLinkById } from './linkApi';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function EditLinkDialog({ handleClose, open, linkId }) {
    const [formData, setFormData] = useState({
        name: '',
        url: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            if (linkId) {
                try {
                    const data = await getLinkById(linkId);
                    setFormData(data[0]);
                } catch (error) {
                    console.error('Error fetching link:', error);
                }
            }
        };
        fetchData()
    }, [linkId])
    
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
            await updateLinkById(linkId, formattedData);
            toast.success('Link  updated successfully');
            handleClose();
        } catch (error) {
            console.error('Error updating Link:', error);
            toast.error('Failed to update Link');
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}

        >
            <DialogTitle sx={{ m: 'auto auto', p: 1 }} >
                Edit Link
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
                                    label='name'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    variant='standard'
                                    name="url"
                                    label='URL'
                                    value={formData.url}
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

export default EditLinkDialog