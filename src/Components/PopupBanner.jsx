

import { useState, useEffect } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { getAllpublication } from '../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;


function PopupBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState([]);
    const [currentPopupIndex, setCurrentPopupIndex] = useState(0);

    useEffect(() => {
        const fetchAllPopups = async () => {
            try {
                const response = await getAllpublication();
                const popups = response.filter(item => item.isPopUp === true).map(item => ({
                    title: item.title,
                    image: item.thumbnailImage,
                    publishedAt: item.publishedAt
                }));
                setData(popups);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllPopups();
    }, []);

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

            <div className="relative w-[620px] h-[540px] bg-white rounded-xl shadow-2xl overflow-hidden z-10 animate-fadeIn">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: `url(${IMAGE_URL}/thumb/${currentPopup.image})` }}
                />

                <div className="relative p-6">

                    <button
                        className="absolute top-2 right-2 text-gray-900 hover:text-red-900 transition-colors"
                        onClick={handleClose}
                        aria-label="Close popup"
                    >
                        <IoIosCloseCircle className="text-3xl" />
                    </button>

                    <div className="flex flex-col space-y-4 text-white">
                        <h2 className="text-xl mt-8">{currentPopup.title}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupBanner;
