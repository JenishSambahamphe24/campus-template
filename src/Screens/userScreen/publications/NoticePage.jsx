import { Grid } from '@mui/material'
import { useParams } from 'react-router-dom'
import { SlCalender } from "react-icons/sl";
import { downloadPublicationFile, getPublicationById } from '../../cmsScreen/cms-components/cms-publication/publicationApi';
import { MdOutlineFileDownload } from "react-icons/md";
import { useState, useEffect } from 'react';
import { extractDate, renderSafeHTML } from '../../../Components/utilityFunctions';
import PDFBookViewer from './component/PDFBookViewer';

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

    const isPdfNotice = notice.isFile === true && notice.file;

    return (
        <Grid container justifyContent='center' className="bg-slate-50 min-h-screen py-8 px-4 lg:px-8">
            <Grid item xs={12} md={isPdfNotice ? 11 : 8} lg={isPdfNotice ? 10 : 6} className="space-y-6">
                
                {/* 1. PDF Book Reader Section */}
                {isPdfNotice && (
                    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                        <PDFBookViewer file={notice.file} title={notice.title} />
                    </div>
                )}

                {/* 2. Notice details Card */}
                <div className="w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-6 lg:p-8">
                    
                    {/* Notice Image / Fallback (only shown if NOT a PDF notice) */}
                    {!isPdfNotice && (
                        <div className="w-full rounded-xl overflow-hidden bg-gray-100 border border-gray-100 mb-6 flex justify-center">
                            <img 
                                src={notice.thumbnailImage ? `${IMAGE_URL}/thumb/${notice.thumbnailImage}` : defaultImage}
                                onError={(e) => { e.target.src = defaultImage }}
                                className="w-full max-w-xl h-auto max-h-[60vh] object-contain rounded-lg"
                                alt="Notice Thumbnail"
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
                                {notice.title}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                                <SlCalender className="w-4 h-4 text-blue-600" />
                                <span className="text-xs font-semibold text-gray-700">{extractDate(notice.publishedAt)}</span>
                            </div>
                        </div>

                        {notice.description && (
                            <div className="text-sm lg:text-base text-gray-700 leading-relaxed py-2">
                                <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(notice.description) }} />
                            </div>
                        )}

                        {notice.isFile === true && notice.file && (
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => downloadPublicationFile(notice.file)} 
                                    className="inline-flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#1169bf] hover:text-[#0b4d91] font-bold text-xs px-5 py-3 rounded-xl transition-all duration-300"
                                >
                                    <span>Download</span>
                                    <MdOutlineFileDownload fontSize="18px" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}

export default NoticePage
