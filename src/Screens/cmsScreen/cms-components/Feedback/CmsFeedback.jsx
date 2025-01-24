import React, { useState, useEffect } from 'react'
import { Typography, Box, Grid, Button } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom';
import { getAllFeedbacks } from './feedbackApi'
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';



function CmsFeedback() {
    const navigate = useNavigate()
    const [allFeedbacks, setAllFeedbacks] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllFeedbacks()
            setAllFeedbacks(data)
        };
        fetchData()
    }, [])

    const columns = [
        { field: 'sNo', headerName: 'SNo', flex: .7 },
        {
            field: 'userName',
            headerName: 'Respondant Name',
            flex: 1.5,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'contact',
            headerName: 'Contact No',
            flex: .8,
        },
        {
            field: 'message',
            headerName: 'Message',
            flex: 6,
        },

    ]

    const rows = allFeedbacks?.sort((a, b) => b.id - a.id).map((item, index) => ({
        sNo: index + 1,
        id: item.id,
        userName: item.fullName,
        email: item.email,
        contact: item.contactNo,
        message: item.message,
    }))


    return (
        <>
            <Grid container className='px-20 pb-10' mx='auto'>
                <Typography mx='auto' variant='h4' mb='2rem' >   List of feedbacks</Typography>
                <Box width='100%'>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        density='compact'
                        pagination
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } },
                        }}
                        disableColumnFilter={true}
                        disableColumnMenu={true}
                        disableColumnSelector={true}
                        disableColumnSorting={true}
                        disableDensitySelector={true}
                        columnHeaderHeight={70}
                        showCellVerticalBorder={true}
                        components={{
                            NoRowsOverlay: () => (
                                <GridOverlay>
                                    <Typography variant='h5' align='center'>
                                        No rows
                                    </Typography>
                                </GridOverlay>
                            ),
                        }}

                        sx={{
                            minHeight: '464px',
                            maxHeight: '464px',
                            '.MuiDataGrid-columnHeader': {
                                backgroundColor: '#0368b0',
                                color: 'white',
                                fontWeight: '40px',
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
                            '& .MuiDataGrid-columnHeader': {
                                fontWeight: '600',
                                fontSize: '14px',
                            },
                            '& .MuiDataGrid-selectedRowCount': {
                                visibility: 'hidden',
                            },
                            width: '100%',
                            marginTop: '0',
                        }}
                    />

                </Box>

            </Grid>
        </>
    )
}

export default CmsFeedback