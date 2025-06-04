import { useState, useEffect } from 'react';
import { getAllaboutUs } from '../../Screens/cmsScreen/cms-components/cms-aboutUs/aboutsAPI';
import { Grid } from '@mui/material';
import { renderSafeHTML } from '../utilityFunctions';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;
const defaultImage = import.meta.env.VITE_DEFAULT_IMG

function Introduction() {
    const [data, setData] = useState({});
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllaboutUs();
                const introData = result.find(item => item.heading === 'Introduction');
                setData(introData || {});
            } catch (error) {
                console.error("Error fetching data:", error);
                setData({});
            }
        };
        fetchData();
    }, []);

    const handleImageError = () => {
        setImgError(true);
    };
    const imageSource = imgError ?
        defaultImage :
        (data.aboutUsImage ? `${IMAGE_URL}/aboutUs/${data.aboutUsImage}` : defaultImage);
    return (
        <>
            <Grid container className='px-10 sm:px-2 md:px-4 lg:px-20 py-10' display='flex' justifyContent='center' gap='10px'>
                <Grid
                    display='flex'
                    justifyContent='space-between'
                    flexDirection='column'
                    item
                    xs={12}
                    sm={7.4}
                    md={8.3}
                    lg={8.8}
                    order={{ xs: 2, sm: 2, md: 2, lg: 1 }}
                >
                    <div>

                        <h1 className='text-sm tracking-wide'>
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: renderSafeHTML(data.description)
                                }}
                            />
                        </h1>
                    </div>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={4.3}
                    md={3.5}
                    lg={3}
                    order={{ xs: 1, sm: 1, md: 1, lg: 1 }}
                >
                    <div className="full group relative block overflow-hidden">
                        <img
                            src={imageSource}
                            alt="Campus Logo"
                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-52"
                            onError={handleImageError}
                        />
                    </div>
                </Grid>
            </Grid>
        </>
    );
}

export default Introduction;