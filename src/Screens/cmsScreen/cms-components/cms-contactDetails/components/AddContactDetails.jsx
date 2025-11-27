import { Button, Grid, TextField, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { addContactDetails } from "../ContactDetailsAPI";

// ------------------ ZOD VALIDATION -----------------------
const contactSchema = z.object({
  contactEmail1: z.string().email("Invalid email"),
  contactEmail2: z
    .string()
    .optional()
    .refine((value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: "Invalid email",
    }),
  phoneNo1: z
    .string()
    .min(10, "Must be at least 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers"),
  phoneNo2: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: "Phone must contain only numbers",
    })
    .refine((value) => !value || value.length >= 10, {
      message: "Must be at least 10 digits",
    }),
  address: z.string().min(1, "Address is required"),
  addressNepali: z.string().optional(),
  collegeName: z.string().min(1, "College Name is required"),
  collegeNameNepali: z.string().optional(),
});

function AddContactDetails() {
  const collegeName = import.meta.env.VITE_COLLEGE_NAME;
  const address = import.meta.env.VITE_ADDRESS;
  const collegeNameNepali = import.meta.env.VITE_COLLEGE_NAME_NEPALI;
  const addressNepali = import.meta.env.VITE_ADDRESS_NEPALI;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contactEmail1: "",
      contactEmail2: "",
      phoneNo1: "",
      phoneNo2: "",
      address: "",
      addressNepali: "",
      collegeName: "",
      collegeNameNepali: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        contactEmail1: data.contactEmail1,
        contactEmail2: data.contactEmail2 || null,
        phoneNo1: data.phoneNo1,
        phoneNo2: data.phoneNo2 || null,
        address: data.address,
        addressNepali: data.addressNepali || null,
        collegeName: data.collegeName,
        collegeNameNepali: data.collegeNameNepali || null,
      };

      await addContactDetails(payload);

      toast.success("Contact details added!");
      reset();
      navigate("/admin/contactDetails");
    } catch (err) {
      console.error("Error adding contact details:", err);
      toast.error("Error adding contact details!");
    }
  };

  return (
    <Grid container justifyContent="center" mt={4}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 4 }} elevation={3}>
          <Typography variant="h5" textAlign="center" mb={3}>
            Add Contact Details
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Primary Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Primary Email"
                  {...register("contactEmail1")}
                  error={!!errors.contactEmail1}
                  helperText={errors.contactEmail1?.message}
                />
              </Grid>

              {/* Secondary Email */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Secondary Email (Optional)"
                  {...register("contactEmail2")}
                  error={!!errors.contactEmail2}
                  helperText={errors.contactEmail2?.message}
                />
              </Grid>

              {/* Primary Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Primary Phone Number"
                  {...register("phoneNo1")}
                  error={!!errors.phoneNo1}
                  helperText={errors.phoneNo1?.message}
                />
              </Grid>

              {/* Secondary Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Secondary Phone Number (Optional)"
                  {...register("phoneNo2")}
                  error={!!errors.phoneNo2}
                  helperText={errors.phoneNo2?.message}
                />
              </Grid>
              {/* College Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="College Name"
                  placeholder={collegeName}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  {...register("collegeName")}
                />
              </Grid>

              {/* College Name Nepali */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="College Name (Nepali)"
                  placeholder={collegeNameNepali}
                  {...register("collegeNameNepali")}
                />
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address"
                  placeholder={address}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  {...register("address")}
                />
              </Grid>

              {/* Address Nepali */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Address (Nepali)"
                  placeholder={addressNepali}
                  {...register("addressNepali")}
                />
              </Grid>

              {/* Submit */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Contact Details"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AddContactDetails;
