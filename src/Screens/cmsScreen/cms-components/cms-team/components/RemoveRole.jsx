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

function RemoveRole({ handleClose, open, itemId }) {
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogTitle sx={{ m: 'auto auto', p: 1 }}>
                Remove Role
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
                    <form >
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

                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel shrink variant="standard">
                                        Select Role
                                    </InputLabel>
                                    <NativeSelect
                                        name='role'
                                    >
                                        <option value='admin'>Admin</option>
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
                                />
                            </Grid>
                        </Grid>

                        <DialogActions>
                            <Button type='submit' size='small' variant='contained' >
                                submit
                            </Button>
                        </DialogActions>
                    </form>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default RemoveRole