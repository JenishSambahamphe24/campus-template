import React from 'react'
import { Grid, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import adminImage from '../../../assets/admin1.png'
const collegeName = import.meta.env.VITE_COLLEGE_NAME;

function AdminHomePage() {
  return (
    <Grid className='px-20'>
      <div>
        <div className='relative'>
          <img src={adminImage} alt="admin dashboard" className="relative w-full h-[460px] 400 object-contain" />
          <div className="absolute top-4 left-[30px]">
            <h1 className=" text-[36px] font-bold " style={{ color: '#0368B0' }}> Hello Admin, <br></br> Welcome to the CMS of {collegeName} </h1>
            <Link to='/admin/publications'>
              <Button size='small' variant='outlined' sx={{ textTransform: 'none', marginTop: '15px' }} >
                Browse Contents
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </Grid>
  )
}

export default AdminHomePage