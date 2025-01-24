import { Button, Grid, Typography, Box, Divider } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiBookOpen } from "react-icons/fi";
import { getAllPrograms } from '../../Screens/cmsScreen/cms-components/cms-academics/academicsApi'
import { FaBookReader } from "react-icons/fa";

function ProgramSection() {
  const [allPrograms, setAllPrograms] = useState([])
  const fetchData = async () => {
    const response = await getAllPrograms()
    if (response) {
      setAllPrograms(response)
    } else {
      setAllPrograms([])
    }
  }
  useEffect(() => {
    fetchData()
  }, [])


  return (
    <Grid container rowGap='20px'>
      <Divider style={{ width: '100%', backgroundColor: '#c2c2c2' }} />
      <h1 className='text-2xl'>
        Our current Programs
      </h1>
      <Grid container gap='15px'>
        {
          allPrograms.map((item, index) => (
            <Grid
              component={Link}
              to={`/program/${item.id}`}
              item
              key={index}
              sm={2}
              className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-200 px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:mx-auto sm:max-w-sm sm:rounded-3xl sm:px-10"
            >
              <span className="absolute invisible group-hover:visible top-10 z-0 h-20 w-20 rounded-full bg-sky-500 transition-all duration-300 group-hover:scale-[10]"></span>
              <div className="relative z-10 flex flex-col items-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-[#0368b0] transition-all duration-300 group-hover:bg-sky-400">
                  <FaBookReader className="h-10 w-10 text-white transition-all" />
                </span>
                <div className="pt-3 text-base font-semibold leading-7 text-center">
                  <p className="text-[#0368b0] transition-all duration-300 group-hover:text-white text-sm">
                    {item.shortName}
                  </p>
                </div>
              </div>
            </Grid>
          ))
        }
      </Grid>
      <div className='w-full flex justify-center'>
        <Button sx={{ textTransform: 'none' }} size="small" variant="outlined" className="flex items-center gap-2">
          <Link to='/program-list'>
            <Typography >
              All Programs
            </Typography>
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </Button>
      </div>
    </Grid>
  )
}

export default ProgramSection