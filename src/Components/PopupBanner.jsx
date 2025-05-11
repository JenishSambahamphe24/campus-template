import { useState } from 'react';
import { Grid } from '@mui/material';
import { IoIosCloseCircle } from "react-icons/io";
import { Link } from 'react-router-dom';

function PopupBanner() {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };
    if (!isVisible) return null;

    return (
        <Grid container className="bg-cover py-8 w-full flex justify-center items-center">
            <Grid item position='relative' className="w-[620px] h-[540px] bg-white p-5 rounded-xl bg-opacity-60 backdrop-filter backdrop-blur-lg"
                style={{ backgroundImage: "url('https://i.pinimg.com/550x/97/11/05/9711053cff05acb6c9b53036de278f4a.jpg')" }}
            >
                <div className='absolute top-0 rounded-md right-0 cursor-pointer' onClick={handleClose}>
                    <IoIosCloseCircle className='text-white text-[28px]' />
                </div>
                <div className="flex justify-between text-sm font-medium">
                    <h1 className='text-white text-xs'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis quisquam, corrupti iusto hic tenetur repellat.
                    </h1>
                </div>
                <div className='mt-1'>
                    <button className='border-[1px] rounded-sm p-[2px] border-[#F36710]'>
                        <Link>
                            <h1 className='text-xs text-white'>
                                View More
                            </h1>
                        </Link>
                    </button>
                </div>
            </Grid>
        </Grid>
    );
}

export default PopupBanner;
