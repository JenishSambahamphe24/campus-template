import React, { useState, useEffect } from 'react';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { Grid, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { deleteGallery } from '../galleryApii';
import { getAllGallery } from '../galleryApii';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { showStatus } from '../../../../../Components/utilityFunctions';
import CommonDeleteDialog from '../../cms-team/components/CommonDeleteDialog';
import MultipleImageDialog from '../MultipleImageDialog';


function GalleryList() {
  const [allGallery, setAllGallery] = useState([]);
  const [galleryId, setGalleryId] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addImgDialog, setImgDialog] = useState(false)

  const navigate = useNavigate();

  const fetchData = async () => {
    const data = await getAllGallery();
    if (Array.isArray(data)) {
      setAllGallery(data);
    } else {
      console.error("Unexpected data format:", data);
      setAllGallery([]);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteDialogOpen = (id) => {
    setDeleteDialogOpen(true);
    setGalleryId(id)
  };

  const handleClose = () => {
    setDeleteDialogOpen(false)
    fetchData()
  }

  const handleAddImgDialogOpen = (id) => {
    setImgDialog(true);
    setGalleryId(id)
  };

  const handleImgDialogClose = () => {
    setImgDialog(false)
    fetchData()
  }
  const galleryColumns = [
    { field: 'sNo', headerName: 'S.No.', flex: 0.5 },
    { field: 'type', headerName: 'Gallery Type', flex: 1 },
    { field: 'fileName', headerName: 'Gallery Name', flex: 2 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 2,
      renderHeader: () => (
        <div style={{ textAlign: 'center', fontWeight: '600' }}>Action</div>
      ),
      renderCell: (params) => (
        <Box display='flex' justifyContent='flex-start' gap='20px'>
          <Link onClick={() => navigate(`/admin/editGallery/${params.row.id}`)} sx={{ textDecoration: 'none' }} component={Typography}>
            Edit
          </Link>
          <Button
            size='small'
            color='error'
            sx={{ textTransform: 'none' }}
            onClick={() => handleDeleteDialogOpen(params.row.id)}
          >
            Delete
          </Button>
          {params.row.type.toLowerCase() === 'image' && (
            <Button
              size='small'
              color='info'
              sx={{ textTransform: 'none' }}
              onClick={() => handleAddImgDialogOpen(params.row.id)}
            >
              Add more images
            </Button>
          )}
        </Box>
      ),
    },
  ];
 
  console.log(allGallery)
  const galleryRows = allGallery.length > 0 && Array.isArray(allGallery)
    ? allGallery.sort((a, b) => b.id - a.id).map((item, index) => ({
      id: item.id,
      sNo: index + 1,
      fileName: item.galleryName,
      type: item.galleryType,
    }))
    : [];


  return (
    <Grid container className='px-20 pb-10' mx='auto'>
      <Typography mx='auto' variant='h4'>List of Gallery</Typography>
      <Box width='100%'>
        <Link to='/admin/addGallery'>
          <Button variant='outlined' size='small' sx={{ textTransform: 'none', float: 'right', marginBottom: '10px' }}>
            <AddIcon />
            Add a new gallery
          </Button>
        </Link>
        <DataGrid
          rows={galleryRows}
          columns={galleryColumns}
          density='compact'
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
                <Typography variant='h5' align='center'>No rows</Typography>
              </GridOverlay>
            ),
          }}
          sx={{
            minHeight: '360px',
            maxHeight: '464px',
            '.MuiDataGrid-columnHeader': {
              backgroundColor: '#1169bf',
              color: 'white',
              fontWeight: '600',
              borderRight: '1px solid white',
            },
            '.MuiDataGrid-footerContainer': {
              minHeight: '45px',
            },
            '.MuiDataGrid-columnSeparator': {
              display: 'none',
            },
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-selectedRowCount': {
              visibility: 'hidden',
            },
            width: '100%',
            marginTop: '0',
          }}
        />
      </Box>
      <Box>
        <CommonDeleteDialog id={galleryId} open={deleteDialogOpen} handleClose={handleClose} deleteApi={deleteGallery} content='Gallery' />
        <MultipleImageDialog id={galleryId} open={addImgDialog} handleClose={handleImgDialogClose} />
      </Box>
    </Grid>
  );
}

export default GalleryList;
