import { useEffect, useState } from "react";
import { Button, Grid, TextField, Typography, Paper } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  getContactDetailsById,
  updateContactDetailsById,
} from "../ContactDetailsAPI";

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
    .min(10, "Minimum 10 digits")
    .regex(/^\d+$/, "Only digits allowed"),
  phoneNo2: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: "Only digits allowed",
    })
    .refine((value) => !value || value.length >= 10, {
      message: "Minimum 10 digits",
    }),
  address: z.string().optional(),
  addressNepali: z.string().optional(),
  collegeName: z.string().optional(),
  collegeNameNepali: z.string().optional(),
});

export default function EditContactDetails() {
  const { id } = useParams(); // contactId
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
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

  const [loading, setLoading] = useState(true);

  // ------------------ LOAD EXISTING DATA -----------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getContactDetailsById(id);

        // populate form fields
        setValue("contactEmail1", data.contactEmail1 || "");
        setValue("contactEmail2", data.contactEmail2 || "");
        setValue("phoneNo1", data.phoneNo1 || "");
        setValue("phoneNo2", data.phoneNo2 || "");
        setValue("address", data.address || "");
        setValue("addressNepali", data.addressNepali || "");
        setValue("collegeName", data.collegeName || "");
        setValue("collegeNameNepali", data.collegeNameNepali || "");

        setLoading(false);
      } catch (error) {
        toast.error("Failed to load contact details");
        console.error(error);
      }
    };

    if (id) fetchData();
  }, [id, setValue]);

  // ------------------ SUBMIT HANDLER -----------------------
  const onSubmit = async (formData) => {
    try {
      const payload = {
        contactEmail1: formData.contactEmail1,
        contactEmail2: formData.contactEmail2 || null,
        phoneNo1: formData.phoneNo1,
        phoneNo2: formData.phoneNo2 || null,
        address: formData.address || null,
        addressNepali: formData.addressNepali || null,
        collegeName: formData.collegeName || null,
        collegeNameNepali: formData.collegeNameNepali || null,
      };

      await updateContactDetailsById(id, payload);

      toast.success("Contact details updated successfully!");

      setTimeout(() => navigate("/admin/contactDetails"), 600);
    } catch (err) {
      toast.error("Failed to update contact details");
      console.error(err);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Grid container mx="auto" md={8} className="px-10 pb-10">
      <Typography mb="20px" variant="h5" textAlign="center" width="100%">
        Edit Contact Details
      </Typography>

      <Paper elevation={4} style={{ width: "100%", padding: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Email 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Primary Email"
                variant="standard"
                fullWidth
                {...register("contactEmail1")}
                error={!!errors.contactEmail1}
                helperText={errors.contactEmail1?.message}
              />
            </Grid>

            {/* Email 2 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Secondary Email (Optional)"
                variant="standard"
                fullWidth
                {...register("contactEmail2")}
                error={!!errors.contactEmail2}
                helperText={errors.contactEmail2?.message}
              />
            </Grid>

            {/* Phone 1 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Primary Phone Number"
                variant="standard"
                fullWidth
                {...register("phoneNo1")}
                error={!!errors.phoneNo1}
                helperText={errors.phoneNo1?.message}
              />
            </Grid>

            {/* Phone 2 */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Secondary Phone Number (Optional)"
                variant="standard"
                fullWidth
                {...register("phoneNo2")}
                error={!!errors.phoneNo2}
                helperText={errors.phoneNo2?.message}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                variant="standard"
                fullWidth
                {...register("address")}
              />
            </Grid>

            {/* Address Nepali */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address (Nepali)"
                variant="standard"
                fullWidth
                {...register("addressNepali")}
              />
            </Grid>

            {/* College Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="College Name"
                variant="standard"
                fullWidth
                {...register("collegeName")}
              />
            </Grid>

            {/* College Name Nepali */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="College Name (Nepali)"
                variant="standard"
                fullWidth
                {...register("collegeNameNepali")}
              />
            </Grid>
          </Grid>

          <div className="flex justify-end mt-4">
            <Button
              variant="contained"
              size="small"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Details"}
            </Button>
          </div>
        </form>
      </Paper>
    </Grid>
  );
}
