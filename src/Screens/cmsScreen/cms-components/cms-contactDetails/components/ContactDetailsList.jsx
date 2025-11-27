import { useEffect, useState } from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { useAuth } from "../../../../../context/AuthContextProvider";
import { Link, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {
  getAllContactDetails,
  deleteContactDetails,
} from "../ContactDetailsAPI";
import DeleteDialogContactDetails from "./DeleteDialogContactDetails";

function ContactDetailsList() {
  const { role } = useAuth();
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ id: null, sNo: null });

  // ------------------ FETCH CONTACTS ------------------
  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllContactDetails();
      console.log("Fetched contacts:", data);

      if (!Array.isArray(data)) {
        throw new Error("GET /contacts did not return an array");
      }

      const mappedData = data.map((item, index) => ({
        sNo: index + 1,
        id: item.id,
        contactEmail1: item.contactEmail1,
        contactEmail2: item.contactEmail2,
        contactPhone1: item.phoneNo1,
        contactPhone2: item.phoneNo2,
        address: item.address,
        addressNepali: item.addressNepali,
        collegeName: item.collegeName,
        collegeNameNepali: item.collegeNameNepali,
      }));

      setContacts(mappedData);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError(err.message || "Failed to fetch contacts");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ------------------ DELETE HANDLER ------------------
  const handleDeleteClick = (id, sNo) => {
    setDeleteItem({ id, sNo });
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = async () => {
    setDeleteDialogOpen(false);
    await fetchContacts(); 
  };

  // ------------------ DATA GRID COLUMNS ------------------
  const columns = [
    { field: "sNo", headerName: "SNo", flex: 0.6 },
    { field: "contactEmail1", headerName: "Primary Email", flex: 2.5 },
    { field: "contactEmail2", headerName: "Secondary Email", flex: 2.5 },
    { field: "contactPhone1", headerName: "Primary Phone Number", flex: 2.5 },
    { field: "contactPhone2", headerName: "Secondary Phone Number", flex: 2.5 },
    { field: "address", headerName: "Address", flex: 2.5 },
    { field: "addressNepali", headerName: "Address (Nepali)", flex: 2.5 },
    { field: "collegeName", headerName: "College Name", flex: 2.5 },
    {
      field: "collegeNameNepali",
      headerName: "College Name (Nepali)",
      flex: 2.5,
    },
    {
      field: "Action",
      flex: 2.5,
      renderHeader: () => (
        <div style={{ textAlign: "center", fontWeight: "600" }}>Action</div>
      ),
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around">
          <Typography
            fontSize="14px"
            color="primary"
            mt="7px"
            onClick={() =>
              navigate(`/admin/EditContactDetails/${params.row.id}`)
            }
            sx={{ cursor: "pointer" }}
          >
            Edit
          </Typography>
          {role === "admin" && (
            <Typography
              fontSize="14px"
              color="error"
              mt="7px"
              onClick={() => handleDeleteClick(params.row.id, params.row.sNo)}
              sx={{ cursor: "pointer" }}
            >
              Delete
            </Typography>
          )}
        </Box>
      ),
    },
  ];

  if (loading)
    return (
      <Typography textAlign="center" mt={4}>
        Loading contact details...
      </Typography>
    );

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );

  return (
    <Grid className="px-20 sm:px-10 md:px-20 pb-10" sx={{ mx: "auto" }}>
      <Typography mx="auto" variant="h4" mb={2}>
        List of Contact Details
      </Typography>

      <Box width="100%">
        <Link to="/admin/addContactDetails">
          <Button
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", float: "right", mb: 2 }}
          >
            <AddIcon />
            Add new contact detail
          </Button>
        </Link>

        <DataGrid
          rows={contacts}
          columns={columns}
          density="compact"
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableColumnSorting
          disableDensitySelector
          columnHeaderHeight={70}
          showCellVerticalBorder
          components={{
            NoRowsOverlay: () => (
              <GridOverlay>
                <Typography variant="h5" align="center">
                  No rows found
                </Typography>
              </GridOverlay>
            ),
          }}
          sx={{
            minHeight: "360px",
            maxHeight: "600px",
            ".MuiDataGrid-columnHeader": {
              backgroundColor: "#1169bf",
              color: "white",
              fontWeight: "600",
              borderRight: "1px solid white",
            },
            ".MuiDataGrid-footerContainer": {
              minHeight: "45px",
            },
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            width: "100%",
            marginTop: "0",
          }}
        />

        {/* Delete dialog */}
        <DeleteDialogContactDetails
          id={deleteItem.id}
          sNo={deleteItem.sNo}
          open={deleteDialogOpen}
          handleClose={handleDeleteDialogClose}
        />
      </Box>
    </Grid>
  );
}

export default ContactDetailsList;
