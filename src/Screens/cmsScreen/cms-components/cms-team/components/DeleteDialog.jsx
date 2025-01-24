import { Typography, Box, Dialog, DialogContent,  Button, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { deleteTeam, getAllTeams } from '../teamApi';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    height: 'auto',
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

function DeleteDialog({ handleClose, open, id }) {
    const handleDelete = async () => {
        try {
            await deleteTeam(id);
            toast.success('Team member deleted successfully!');
            getAllTeams()
            setTimeout(() => {
                handleClose();
            }, 900)
        } catch (error) {
            toast.error('Failed to delete team member. Please try again.');
        }
    };
    return (
        <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
        >
            <DialogContent>
                <Box mt='10px'>
                    <Typography >
                        Are you sure you want to delete this team member ? All associated data will also be permanently removed.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: '10px' }} mx='auto'>
                        <Button onClick={handleDelete} color='error' size='small' variant='outlined'>
                            delete
                        </Button>
                        <Button sx={{ marginLeft: '20px' }} color='primary' onClick={handleClose} size='small' variant='outlined'>
                            cancel
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default DeleteDialog