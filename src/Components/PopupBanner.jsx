

import { useState, useEffect } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { getAllpublication } from '../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import NepaliDate from 'nepali-datetime';
import { extractDate } from './utilityFunctions';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function PopupBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState([]);
    const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
    const pad = (n) => n.toString().padStart(2, "0");

    const nepaliDate = new NepaliDate();
    const nepaliDateToday = `${nepaliDate.year}-${pad(nepaliDate.month)}-${pad(nepaliDate.day)}`;

    const isExpired = (expiredAt) => {
        if (!expiredAt) return false;
        return expiredAt < nepaliDateToday;
    };


    useEffect(() => {
        const fetchAllPopups = async () => {
            try {
                const response = await getAllpublication();
                const popups = response
                    .filter(item => item.isPopUp === true)
                    .map(item => ({
                        title: item.title,
                        image: item.thumbnailImage,
                        publishedAt: item.publishedAt,
                        expiredAt: extractDate(item.expiredAt)
                    }))
                    .filter(item => !isExpired(item.expiredAt));

                setData(popups);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllPopups();
    }, [nepaliDateToday]);


    useEffect(() => {
        const popupTimer = setTimeout(() => {
            setIsVisible(true);
        }, 1000);

        return () => clearTimeout(popupTimer);
    }, []);

    const handleClose = () => {
        if (currentPopupIndex < data.length - 1) {
            setCurrentPopupIndex(prevIndex => prevIndex + 1);
        } else {
            setIsVisible(false);
        }
    };
console.log(data)
    if (!isVisible || data.length === 0 || currentPopupIndex >= data.length) {
        return null;
    }
    const currentPopup = data[currentPopupIndex];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative w-[550px] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden z-10 animate-fadeIn">
                {/* Header with close button */}
                <div className="relative bg-white p-4 border-b border-gray-200 z-20">
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-red-600 transition-colors"
                        onClick={handleClose}
                        aria-label="Close popup"
                    >
                        <IoIosCloseCircle className="text-3xl" />
                    </button>
                    {currentPopup.title && (
                        <h3 className="text-lg font-semibold text-gray-800 pr-10 truncate">
                            {currentPopup.title}
                        </h3>
                    )}
                </div>

                {/* Scrollable image container */}
                <div className="flex-1 overflow-auto custom-scrollbar" style={{ height: 'calc(100% - 80px)' }}>
                    <div className="p-4">
                        <img
                            src={`${IMAGE_URL}/thumb/${currentPopup.image}`}
                            alt={currentPopup.title || "Popup image"}
                            className="w-full h-auto object-contain rounded-lg shadow-md"
                            onError={(e) => {
                                e.target.src = '/path/to/fallback-image.jpg'; // Add fallback image path
                                e.target.alt = 'Image not available';
                            }}
                        />
                    </div>
                </div>

                {/* Footer with pagination info (optional) */}
                {data.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                        {currentPopupIndex + 1} of {data.length}
                    </div>
                )}
            </div>

            {/* Custom scrollbar styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `}</style>
        </div>
    );
}

export default PopupBanner;
