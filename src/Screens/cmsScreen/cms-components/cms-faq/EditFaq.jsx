import React, { useState, useEffect } from 'react'
import { FormLabel, Stack, Dialog, DialogContent, DialogActions, DialogTitle, Grid, Button, IconButton, TextField, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { TextareaAutosize } from '@mui/material';
import { toast } from 'react-toastify';
import { getFaqById, updateFaqById } from './faqApi';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));


function EditFaq({ handleClose, open, faqId }) {
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        status: true,
    });
    useEffect(() => {
        const fetchData = async () => {
            if (faqId) {
                try {
                    const data = await getFaqById(faqId);
                    setFormData(data);
                } catch (error) {
                    console.error('Error fetching team data:', error);
                }
            }
        };
        fetchData();
    }, [faqId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateFaqById(faqId, formData);
            toast.success('Faq updated successfully');
            handleClose();
        } catch (error) {
            console.error('Error updating Faq:', error);
            toast.error('Failed to update Faq');
        }
    };

    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 'auto auto', p: 1 }}>
                Edit Faq
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
                <Stack direction='column'>
                    <form onSubmit={handleSubmit}>
                        <Grid container width='35rem' >
                            <TextField
                                fullWidth
                                size='small'
                                variant='standard'
                                label='Question'
                                name='question'
                                value={formData.question}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid container mt='1rem'>
                            <TextareaAutosize
                                className='bg-gray-100'
                                fullWidth
                                minRows={3}
                                size='small'
                                placeholder='Answer'
                                style={{ width: "100%", padding: '5px 10px' }}
                                value={formData.answer}
                                name='answer'
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item md={12}>
                            <FormControl>
                                <FormLabel>Active Status</FormLabel>
                                <RadioGroup
                                    row
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value={true} control={<Radio size="small" />} label="Active" />
                                    <FormControlLabel value={false} control={<Radio size="small" />} label="Inactive" />
                                </RadioGroup>
                            </FormControl>
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
    )
}

export default EditFaq