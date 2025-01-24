import React from 'react';
import { Grid } from '@mui/material';
import ReusablePagination from '../ReusablePagination';

function TestimonialsPage() {
    return (
        <Grid container sm={12} direction='column' className='gap-y-4'>
            <h1 className='mt-8 text-center text-xl font-semibold mx-auto'>What our students say about us</h1>
            <Grid sm={8} className="rounded-lg mx-auto w-full bg-white border border-gray-200 flex">
                <div className="pl-2 py-1 flex flex-col items-start w-28">
                    <img
                        src="https://www.svgrepo.com/show/491978/gas-costs.svg"
                        className="w-12 mx-auto h-12 object-cover object-center"
                        alt="Sital Shah"
                    />
                    <div className="text-xs ">
                        <cite className="not-italic tracking-tight">ram kumar shrestha</cite>
                        <p className="text-gray-700 tracking-tighter">BIM Student</p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col ">
                    <h2 className="text-xs p-2 line-clamp-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos aperiam repellat culpa impedit voluptas nam quo, illo aliquam eligendi quidem exercitationem corporis vel rem assumenda voluptate beatae, rerum illum qui.
                    </h2>
                </div>
            </Grid>
            <Grid sm={8} className="rounded-lg mx-auto w-full bg-white border border-gray-200 flex">
                <div className="pl-2 py-1 flex flex-col items-start w-28">
                    <img
                        src="https://www.svgrepo.com/show/491978/gas-costs.svg"
                        className="w-12 mx-auto h-12 object-cover object-center"
                        alt="Sital Shah"
                    />
                    <div className="text-xs ">
                        <cite className="not-italic tracking-tight">ram kumar shrestha</cite>
                        <p className="text-gray-700 tracking-tighter">BIM Student</p>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col ">
                    <h2 className="text-xs p-2 line-clamp-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos aperiam repellat culpa impedit voluptas nam quo, illo aliquam eligendi quidem exercitationem corporis vel rem assumenda voluptate beatae, rerum illum qui.
                    </h2>
                </div>
            </Grid>
            <Grid sm={8} className="rounded-lg mx-auto w-full flex">
                <ReusablePagination/>
            </Grid>

        </Grid>
    )
}

export default TestimonialsPage