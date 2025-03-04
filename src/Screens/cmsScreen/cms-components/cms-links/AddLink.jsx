import  { useState } from 'react'
import { TextField, FormControl, Button, Grid, Typography, Paper, InputLabel, Select, MenuItem } from '@mui/material'
import { toast } from 'react-toastify';
import { addLink } from './linkApi';
import { useNavigate } from 'react-router-dom';


function AddLink() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        url: '',
        index: 0
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const newLink = await addLink(formData);
            toast.success('Link added successfully');
            navigate('/admin/links')
        } catch (error) {
            console.error('Error adding team:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography mb='20px' variant='h5' textAlign='center'>
                Add a new Link
            </Typography>
            <Grid component={Paper} container width='70%' mx='auto' spacing='10px' paddingRight='10px' paddingBottom='10px'>
                <Grid item sm={12} md={4}>
                    <FormControl size='small' fullWidth>
                        <InputLabel>Link Type</InputLabel>
                        <Select
                            required InputLabelProps={{
                                sx: {
                                    '& .MuiInputLabel-asterisk': {
                                        color: 'brown',
                                    },
                                },
                            }}
                            variant='standard'
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            label='Link Type'
                        >
                            <MenuItem value='socials'> Social Links</MenuItem>
                            <MenuItem value='application'>Applications</MenuItem>
                            <MenuItem value='otherLink'>Other-Links</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    {
                        formData.type === 'socials' ?
                            (
                                <>
                                    <FormControl size='small' fullWidth>
                                        <InputLabel>Link Name</InputLabel>
                                        <Select
                                            required InputLabelProps={{
                                                sx: {
                                                    '& .MuiInputLabel-asterisk': {
                                                        color: 'brown',
                                                    },
                                                },
                                            }}
                                            variant='standard'
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            label='Link Name'
                                        >
                                            <MenuItem value='facebook'> FaceBook</MenuItem>
                                            <MenuItem value='twitter'>Twitter (X)</MenuItem>
                                            <MenuItem value='youtube'>Youtube</MenuItem>
                                        </Select>
                                    </FormControl>
                                </>
                            ) : (
                                <>
                                    <TextField
                                        fullWidth
                                        size='small'
                                        variant='standard'
                                        label='Link Name'
                                        name='name'
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </>
                            )
                    }

                </Grid>
                <Grid item xs={4}>
                    <TextField
                        fullWidth
                        size='small'
                        variant='standard'
                        label='Index'
                        type='number'
                        inputProps={{
                            min: 0
                        }}
                        name='index'
                        value={formData.index}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        size='small'
                        variant='standard'
                        label='URL'
                        name='url'
                        value={formData.url}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item md={12}>
                    <Button
                        type='submit'
                        size='small'
                        variant='contained'
                    >
                        Add a new Link
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default AddLink