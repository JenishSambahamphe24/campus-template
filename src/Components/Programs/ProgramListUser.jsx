import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { FaBookReader } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { getAllPrograms } from '../../Screens/cmsScreen/cms-components/cms-academics/academicsApi';

function ProgramListUser() {
  const { tab } = useParams();
  const [bachelorPrograms, setBachelorPrograms] = useState([])
  const [masterPrograms, setMasterPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const response = await getAllPrograms()
      setBachelorPrograms(response.filter(item => item.level === 'Bachelor'))
      setMasterPrograms(response.filter(item => item.level === 'Master'))
    } catch (error) {
      console.error("Error fetching programs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const [activeTab, setActiveTab] = React.useState(tab || "Bachelor");
  const data = [
    {
      label: "Bachelor",
      value: "Bachelor",
    },
   
    {
      label: "Master",
      value: "Master",
    },
  ];

  // No programs message component
  const NoProgramsMessage = () => (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="bg-blue-50 rounded-lg p-6 text-center max-w-md">
        <FaBookReader className="h-16 w-16 mx-auto text-blue-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Programs Available</h3>
        <p className="text-gray-600 mb-4">
          Please login to the CMS and set up programs to display here.
        </p>
      </div>
    </div>
  );

  return (
    <Grid container className='px-2 md:px-6 lg:px-9' my='25px'>
      <Grid item sm={12}>
        <h1 className='text-center mb-4 text-2xl font-bold'>Our Programs</h1>
      </Grid>
      <Grid item xs={12}>
        <Tabs value={activeTab}>
          <Grid item md={12} >
            <TabsHeader
                style={{
                  background: '#1169bf',
                  color: 'white',
                  zIndex: '1',
                  height: '35px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  gap: '10px'
              }}
              className='rounded'
            >
              {data.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={activeTab === value ? "text-gray-900" : ""}
                  style={{
                    padding: '0 16px',
                    minWidth: 'auto',
                    width: 'auto',
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
          </Grid>

          <TabsBody>
            {activeTab === 'Bachelor' ? (
              <TabPanel style={{ marginTop: '20px', padding: '0' }} value='Bachelor'>
                {loading ? (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-600">Loading programs...</p>
                  </div>
                ) : bachelorPrograms.length > 0 ? (
                  <Grid justifyContent='flex-start' container gap='10px'>
                    {bachelorPrograms.map((item, index) => (
                      <Grid
                        component={Link}
                        to={`/program/${item.id}`}
                        item
                        key={index}
                        xs={5.8}
                        sm={3.8}
                        lg={1.9}
                        className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#1169bf] px-6 pt-10 pb-8 ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 sm:mx-auto sm:max-w-sm sm:rounded-3xl sm:px-10"
                      >
                        <span className="absolute invisible group-hover:visible top-10 z-0 h-20 w-20 rounded-full bg-[#f36710] transition-all duration-300 group-hover:scale-[10]"></span>
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#f36710] transition-all duration-300 group-hover:bg-[#f36710]">
                            <FaBookReader className="h-10 w-10 text-white transition-all" />
                          </span>
                          <div className="pt-3 text-base font-semibold leading-7 text-center">
                            <p className="text-white transition-all duration-300 group-hover:text-white text-md">
                              {item.shortName}
                            </p>
                          </div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <NoProgramsMessage />
                )}
              </TabPanel>
            ) : (
              <TabPanel value='Master' style={{ padding: '0px', marginTop: '20px' }}>
                {loading ? (
                  <div className="w-full text-center py-8">
                    <p className="text-gray-600">Loading programs...</p>
                  </div>
                ) : masterPrograms.length > 0 ? (
                  <Grid container gap='10px'>
                    {masterPrograms.map((item, index) => (
                      <Grid
                        component={Link}
                        to={`/program/${item.id}`}
                        item
                        key={index}
                        xs={6}
                        sm={4}
                        lg={1.9}
                        className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#1169bf] px-6 pt-10 pb-8 ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1 sm:mx-auto sm:max-w-sm sm:rounded-3xl sm:px-10"
                      >
                        <span className="absolute invisible group-hover:visible top-10 z-0 h-20 w-20 rounded-full bg-[#f36710] transition-all duration-300 group-hover:scale-[10]"></span>
                        <div className="relative z-10 flex flex-col items-center">
                          <span className="grid h-20 w-20 place-items-center rounded-full bg-[#f36710] transition-all duration-300 group-hover:bg-[#f36710]">
                            <FaBookReader className="h-10 w-10 text-white transition-all" />
                          </span>
                          <div className="pt-3 text-base font-semibold leading-7 text-center">
                            <p className="text-white transition-all duration-300 group-hover:text-white text-sm">
                              {item.shortName}
                            </p>
                          </div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <NoProgramsMessage />
                )}
              </TabPanel>
            )}
          </TabsBody>
        </Tabs>
      </Grid>
    </Grid>
  )
}

export default ProgramListUser