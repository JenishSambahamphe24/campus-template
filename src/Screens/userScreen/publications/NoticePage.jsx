import { Grid } from '@mui/material'
import { useParams } from 'react-router-dom'
import { SlCalender } from "react-icons/sl";
import { downloadPublicationFile, getPublicationById } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
import { FaRegFilePdf } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { extractDate } from '../../../Components/utilityFunctions';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL
const defaultImage = import.meta.env.VITE_DEFAULT_IMG

function NoticePage() {
    const { id } = useParams()
    const [notice, setNotice] = useState({})
    useEffect(() => {
        const fetchData = async () => {
            const response = await getPublicationById(id)
            setNotice(response)
        }
        fetchData()
    }, [id])

    return (
        <Grid container justifyContent='center'>
            <Grid item className='p-16'>
                <div className=" w-sm  bg-white border border-gray-200 rounded-lg shadow-sm ">
                    <img src={notice.thumbnailImage ? `${IMAGE_URL}/thumb/${notice.thumbnailImage}` : defaultImage}
                        onError={(e) => { e.target.src = defaultImage }}
                    />

                    <div className="px-5 mt-4 pb-5">
                        <a href="#">
                            <h5 className="text-l font-semibold tracking-tight text-gray-900">
                                {notice.title}
                            </h5>
                        </a>
                        <div className="flex items-center mt-2.5 mb-2">
                            <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                <SlCalender
                                    className="w-4 h-4 "
                                />

                            </div>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm  ms-3">{extractDate(notice.publishedAt)}</span>
                        </div>
                        {
                            notice.isFile === true && (
                                <button onClick={() => downloadPublicationFile(notice.file)} className='flex h-5 mt-1 ml-1 px-2  bg-[#F36710] rounded-lg'>
                                    <span className='text-xs mt-[1px] text-white'>
                                        download
                                    </span>
                                    <FaRegFilePdf fontSize="16px" style={{ marginLeft: '5px', color: 'white', marginTop: '2px' }} />
                                </button>
                            )
                        }

                    </div>
                </div>
            </Grid>

        </Grid>

    )
}

export default NoticePage