import React, { useState, useEffect } from "react";
import { deleteFaq, getAllFaq } from "./faqApi";
import {
  Box,
  Typography,
  Grid,
  Stack,
  Button,
  useMediaQuery,
} from "@mui/material";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import EditFaq from "./EditFaq";
import { showStatus } from "../../../../Components/utilityFunctions";
import CommonDeleteDialog from "../cms-team/components/CommonDeleteDialog";

function Faqlist() {
  const [allFaqs, setAllFaqs] = useState([]);
  const [faqId, setFaqId] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // ✅ Added media query for responsive tweaks
  const isMobile = useMediaQuery("(max-width:600px)");

  const fetchData = async () => {
    try {
      const data = await getAllFaq();
      const addedData = data.map((item, index) => ({
        ...item,
        sNo: index + 1,
      }));
      setAllFaqs(addedData);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditDialogOpen = (id) => {
    setFaqId(id);
    setEditDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    fetchData();
  };

  const handleDeleteDialogOpen = (id) => {
    setFaqId(id);
    setDeleteDialogOpen(true);
  };

  const handleEditDialogClose = async () => {
    setEditDialogOpen(false);
    try {
      const updatedFaqs = await getAllFaq();
      setAllFaqs(updatedFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  const columns = [
    { field: "sNo", headerName: "SNo", flex: 1 },
    {
      field: "question",
      headerName: "Question",
      flex: 3,
    },
    {
      field: "answer",
      headerName: "Answer",
      flex: 3,
    },
    {
      field: "status",
      headerName: "Active Status",
      flex: 1,
    },
    {
      field: "Action",
      flex: 1,
      renderHeader: () => (
        // ✅ Fixed missing return statement
        <div style={{ textAlign: "center", fontWeight: "600" }}>Action</div>
      ),
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around">
          <Typography
            fontSize="14px"
            color="primary"
            mt="7px"
            onClick={() => handleEditDialogOpen(params.row.id)}
            sx={{ cursor: "pointer" }}
          >
            Edit
          </Typography>
          <Typography
            fontSize="14px"
            color="error"
            mt="7px"
            onClick={() => handleDeleteDialogOpen(params.row.id)}
            sx={{ cursor: "pointer" }}
          >
            Delete
          </Typography>
        </Box>
      ),
    },
  ];

  const rows = allFaqs?.map((item) => ({
    sNo: item.sNo,
    id: item.id,
    question: item.question,
    answer: item.answer,
    status: showStatus(item.status),
  }));

  return (
    <Grid container sx={{ px: { xs: 2, sm: 4, md: 8 }, pb: 5 }} mx="auto">
      <Stack direction="column" gap={3} sx={{ width: "100%" }}>
        <Typography mx="auto" variant="h4">
          FAQs
        </Typography>

        <Box
          sx={{
            width: "100%",
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            autoHeight
            density="compact"
            pagination
            rowsPerPageOptions={[10, 20, 50]}
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
                    No rows
                  </Typography>
                </GridOverlay>
              ),
            }}
            sx={{
              ".MuiDataGrid-columnHeader": {
                backgroundColor: "#1169bf",
                color: "white",
                fontWeight: 600,
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
              "& .MuiDataGrid-columnHeader": {
                fontSize: "14px",
              },
              "& .MuiDataGrid-selectedRowCount": {
                visibility: "hidden",
              },
            }}
          />
        </Box>

        <Link to="/admin/addFaq">
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none", width: "7rem" }}
          >
            Add a FAQ
          </Button>
        </Link>

        <Box>
          <EditFaq
            faqId={faqId}
            open={editDialogOpen}
            handleClose={handleEditDialogClose}
            setOpen={setEditDialogOpen}
          />
        </Box>
      </Stack>

      <Box>
        <CommonDeleteDialog
          id={faqId}
          open={deleteDialogOpen}
          handleClose={handleDeleteDialogClose}
          deleteApi={deleteFaq}
          content="FAQ"
        />
      </Box>
    </Grid>
  );
}

export default Faqlist;
