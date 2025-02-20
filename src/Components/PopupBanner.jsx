import React from 'react';
import { Grid } from '@mui/material';

function PopupBanner() {
    return (
        <Grid  container className="bg-cover py-8 w-full flex justify-center items-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1124&q=100')" }}>

            <Grid item className="w-1/2 h-[300px]  bg-white p-5 rounded-xl bg-opacity-60 backdrop-filter backdrop-blur-lg">
                <div className="header-card flex justify-between text-sm font-medium">
                    <div>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis quisquam, corrupti iusto hic tenetur repellat.</div>
                </div>

                <div className="card-content divide-y flex flex-col gap-y-3 mt-5">

                    <div className="card-content-profil flex justify-between items-center">
                        <div className="flex gap-x-2 items-center">
                            <div className="card-name-user text-xs">
                                <h3 className="font-semibold">Chris Wood</h3>
                                <div className="flex items-center gap-x-1">
                                    <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                    <span>Online</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-action">
                            <button className="flex items-center px-2 py-1 text-xs text-white bg-gray-500 hover:bg-gray-600">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                </svg>
                                <span>Invite</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Grid>
        </Grid>
    );
}

export default PopupBanner;
