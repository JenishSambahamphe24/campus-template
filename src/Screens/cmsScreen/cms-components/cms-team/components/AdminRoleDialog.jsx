import React, { useState, useEffect } from 'react'
import { Typography, Stack, Dialog, DialogContent, DialogTitle, DialogActions, FormControl, Grid, Button, IconButton, TextField, FormControlLabel, Radio, InputLabel, NativeSelect } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { getTeamById } from '../teamApi';
const BASE_URL = import.meta.env.VITE_API_URL;


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function AdminRoleDialog({ handleClose, open, itemId }) {
    const [memberCredential, setMemberCredentials] = useState({});
    const [passwordError, setPasswordError] = useState(false);

    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        role: 'admin',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTeamById(itemId);
            setMemberCredentials(data);
            setFormData(prevFormData => ({
                ...prevFormData,
                email: data.email
            }));
        };
        if (itemId) {
            fetchData();
        }
    }, [itemId]);

    // Handle input changes and password matching logic
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'password' || name === 'confirmPassword') {
            if (name === 'password' && formData.confirmPassword && value !== formData.confirmPassword) {
                setPasswordError(true);
            } else if (name === 'confirmPassword' && formData.password && value !== formData.password) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
    
        // Create a copy of formData excluding confirmPassword
        const { confirmPassword, ...dataToSubmit } = formData;
    
        try {
            const response = await axios.post(`${BASE_URL}/admin/signup`, dataToSubmit);
            toast.success('The user has been assigned the selected role');
        } catch (error) {
            toast.error('No user found', { autoClose: 200 });
            console.error('Error during login:', error.response?.data || error.message);
        }
    };
    
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 'auto auto', p: 1 }}>
                Assign  Role
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
                        <Grid container width='35rem' spacing={2}>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='First Name'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled
                                    value={memberCredential.firstName}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Middle Name'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled
                                    value={memberCredential.middleName}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Last Name'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    disabled
                                    value={memberCredential.lastName}
                                />
                            </Grid>
                        </Grid>
                        <Grid container width='35rem' spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Email'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={memberCredential.email}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    disabled
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Phone Number'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={memberCredential.phoneNo}
                                />
                            </Grid>
                        </Grid>
                        <Grid mt='1px' container width='35rem' spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Create a Username'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    name='userName'
                                    value={memberCredential.email}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel shrink variant="standard">
                                        Select Role
                                    </InputLabel>
                                    <NativeSelect
                                        name='role'
                                        value={formData.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value='user'>user</option>
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container width='35rem' spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Password'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    name='password'
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    error={passwordError}
                                    helperText={passwordError ? "Passwords do not match" : ""}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    size='small'
                                    variant='standard'
                                    label='Confirm Password'
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    name='confirmPassword'
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    error={passwordError}
                                    helperText={passwordError ? "Passwords do not match" : ""}
                                />
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button type='submit' size='small' variant='contained' disabled={passwordError}>
                                submit
                            </Button>
                        </DialogActions>
                    </form>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    );
}

export default AdminRoleDialog;
