import React from 'react'
import AdminNavbar from './cms-components/AdminNavbar'
import { Outlet } from 'react-router-dom'
import Footer from '../../Components/Footer'
import { Stack } from '@mui/material'
import { ToastContainer } from 'react-toastify'

function AdminLayout() {
    return (
        <>
            <Stack direction='column' gap='2rem'>
                <AdminNavbar />
                <div style={{ minHeight: '25rem' }}>
                    <Outlet />
                </div>
            </Stack>
            <Footer />
            <ToastContainer />
        </>
    )
}

export default AdminLayout