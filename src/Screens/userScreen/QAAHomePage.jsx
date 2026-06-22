import { Grid, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import adminImage from '../../../public/admin1.png'

const collegeName = import.meta.env.VITE_COLLEGE_NAME;

function QAAHomePage() {
  return (
    <Grid className='px-20'>
      <div>
        <div className='relative'>
          <img src={adminImage} alt="QAA dashboard" className="relative w-full h-[460px] object-contain" />
          <div className="absolute top-4 left-[30px]">
            <h1 className=" text-[36px] font-bold " style={{ color: '#1169bf' }}>
              Hello UGC user, <br />
              Welcome to the QAA Portal of {collegeName}
            </h1>
            <Link to='/qaa/publications'>
              <Button size='small' variant='outlined' sx={{ textTransform: 'none', marginTop: '15px' }}>
                Browse Contents
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Grid>
  )
}

export default QAAHomePage
