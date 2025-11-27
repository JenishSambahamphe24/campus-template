import { Typography, Box, Dialog, DialogContent, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast } from "react-toastify";
import { deleteContactDetails } from "../ContactDetailsAPI";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  height: "auto",
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// Now receiving both id and sNo
function DeleteDialogContactDetails({ handleClose, open, id, sNo }) {
  const handleDelete = async () => {
    try {
      await deleteContactDetails(id);

      toast.success(`Contact detail ${sNo} deleted successfully!`);

      setTimeout(() => {
        handleClose();
      }, 900);
    } catch (error) {
      toast.error("Failed to delete contact detail. Please try again.");
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="delete-contact-details-dialog"
      open={open}
    >
      <DialogContent>
        <Box mt="10px">
          <Typography>
            Are you sure you want to delete this contact detail? This action
            cannot be undone.
          </Typography>

          <Box
            sx={{ display: "flex", justifyContent: "center", mt: "10px" }}
            mx="auto"
          >
            <Button
              onClick={handleDelete}
              color="error"
              size="small"
              variant="outlined"
            >
              Delete
            </Button>

            <Button
              sx={{ marginLeft: "20px" }}
              color="primary"
              onClick={handleClose}
              size="small"
              variant="outlined"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  );
}

export default DeleteDialogContactDetails;
