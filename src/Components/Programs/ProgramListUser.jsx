import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { Box, Grid, Button } from '@mui/material'
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

  const fetchPrograms = async () => {
    const response = await getAllPrograms()
    setBachelorPrograms(response.filter(item => item.level === 'Bachelor'))
    setMasterPrograms(response.filter(item => item.level === 'Master'))
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
      label: "PGD",
      value: "PGD",
    },
    {
      label: "Master",
      value: "Master",
    },
    {
      label: "MPhil",
      value: "MPhil",
    },
    {
      label: "PHD",
      value: "PHD",
    },
  
  ];

  return (
    <Grid container className='px-14' my='25px'>
        <h1 className='mx-auto text-center text-2xl mb-6 font-bold'>Our Programs</h1>
      <Grid mx='30px' item md={12}>
        <Tabs value={activeTab}>
          <Grid item md={12} >
            <TabsHeader
              style={{ background: '#0368B0', color: 'white', zIndex: '1' }}
              className='rounded'
            >
              {data.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={activeTab === value ? "text-gray-900" : ""}
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
          </Grid>

          <TabsBody>
            {
              activeTab === 'Bachelor' ? (
                <TabPanel style={{ marginTop: '20px', padding: '0'}} value='Bachelor'>
               
                    <Grid container gap='15px' >
                      {
                        bachelorPrograms.map((item, index) => (
                          <Grid
                            component={Link}
                            to={`/program/${item.id}`}
                            item
                            key={index}
                            sm={1.9}
                            className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#0368b0]  px-6 pt-10 pb-8 ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1  sm:mx-auto sm:max-w-sm sm:rounded-3xl sm:px-10"
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
                        ))
                      }
                    </Grid>
                </TabPanel>
              ) :
                (
                  <TabPanel value='Master' style={{ padding: '0px', marginTop: '20px' }}>
                    <Grid container gap='15px' >
                      {masterPrograms.map((item, index) => {
                        return (
                          <Grid
                            component={Link}
                            to={`/program/${item.id}`}
                            item
                            key={index}
                            sm={1.9}
                            className="group relative flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-gray-200 px-6 pt-10 pb-8 ring-1 ring-gray-900/5 transition-all duration-300 hover:-translate-y-1  sm:mx-auto sm:max-w-sm sm:rounded-3xl sm:px-10"
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
                        );
                      })}

                    </Grid>
                  </TabPanel>
                )
            }
          </TabsBody>
        </Tabs>
      </Grid>
    </Grid >
  )
}

export default ProgramListUser