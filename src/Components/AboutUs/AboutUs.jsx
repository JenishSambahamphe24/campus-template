import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardFooter,
} from "@material-tailwind/react";
import { Grid, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { getAllaboutUs } from '../../Screens/cmsScreen/cms-components/cms-aboutUs/aboutsAPI';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;


function AboutUs() {
    const [messageChairman, setMessageChairman] = useState({})
    const [messageChief, setMessageChief] = useState({})

    const fetchData = async () => {
        try {
            const response = await getAllaboutUs();
            const chairmanMessage = response.find(item => item.heading === 'Chairman-Message');
            const chiefMessage = response.find(item => item.heading === 'Message-campus-chief');
            setMessageChairman(chairmanMessage || {});
            setMessageChief(chiefMessage || {});
        } catch (error) {
            console.error('Error fetching data:', error);
            setMessageChairman({});
        }
    };
    const defaultImage = 'https://img.freepik.com/free-vector/boss-man-concept-illustration_114360-19846.jpg'
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Grid container gap='20px' marginY='20px' >
            <Grid item sm={12} md={5.9} sx={{ maxHeight: '270px', display: 'flex', alignItems: 'center' }}>
                <div
                    className="bg-gray-200 p-1 flex flex-row border border-gray-200 rounded-xl shadow h-full hover:bg-gray-100"
                >
                    <img
                        className="object-cover w-[30%] rounded-lg md:h-auto"
                        src={messageChairman.aboutUsImage}
                        onError={(e) => { e.target.src = defaultImage; }}
                        alt=""
                    />
                    <div className="flex flex-col justify-center max-h-[250px] min-h-[250px] overflow-hidden p-4 leading-normal">
                        <p className="text-xl font-medium">Message from campus Chief</p>
                        <p
                            className="mb-3 mt-2 font-normal text-gray-700 line-clamp-6 text-sm"
                            dangerouslySetInnerHTML={{ __html: messageChairman.description }}
                        />
                    </div>
                </div>
            </Grid>
            <Grid item sm={12} md={5.9} sx={{ maxHeight: '270px', display: 'flex', alignItems: 'center' }}>
                <div
                    className="bg-gray-200 p-1 flex flex-row border border-gray-200 rounded-xl shadow h-full hover:bg-gray-100"
                >
                    <img
                        className="object-cover w-[30%] rounded-lg md:h-auto"
                        src={messageChief.aboutUsImage}
                        onError={(e) => { e.target.src = defaultImage; }}
                        alt=""
                    />
                    <div className="flex flex-col justify-center max-h-[250px] min-h-[250px] overflow-hidden p-4 leading-normal">
                        <p className="text-xl font-medium">Message from campus Chief</p>
                        <p
                            className="mb-3 mt-2 font-normal text-gray-700 line-clamp-6 text-sm"
                            dangerouslySetInnerHTML={{ __html: messageChief.description }}
                        />
                    </div>
                </div>
            </Grid>

        </Grid>
    );
}

export default AboutUs;
