import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { getAllpublication } from "../Screens/cmsScreen/cms-components/cms-publication/publicationApi";
import { extractDate } from "./utilityFunctions";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function PopupBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [popups, setPopups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get today's Gregorian date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Check if popup is expired
  const isExpired = (expiredAt) => {
    if (!expiredAt) {
      return false; // No expiry date means it never expires
    }

    const todayDate = getTodayDate();
    return expiredAt < todayDate;
  };
  // Fetch popups from API
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const response = await getAllpublication();
        
        const validPopups = response
          .filter((item) => item.isPopUp === true && item.displayStatus === true)
          .map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.popUpImage || item.thumbnailImage || null,
            expiredAt: extractDate(item.expiredAt),
          }))
          .filter((item) => !isExpired(item.expiredAt))
          .sort((a, b) => b.id - a.id);

        setPopups(validPopups);
        if (validPopups.length > 0) setIsVisible(true);
      } catch (error) {
        console.error("Error fetching popups:", error);
      }
    };

    fetchPopups();
  }, []);

  const handleClose = () => {
    if (currentIndex < popups.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsVisible(false);
    }
  };

  if (!isVisible || popups.length === 0 || currentIndex >= popups.length) {
    return null;
  }

  const currentPopup = popups[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative w-[550px] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden z-10 animate-fadeIn">
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

        <div
          className="flex-1 overflow-auto custom-scrollbar"
          style={{ height: "calc(100% - 80px)" }}
        >
          <div className="p-4">
            {currentPopup.image ? (
              <img
                src={`${IMAGE_URL}/thumb/${currentPopup.image}`}
                alt={currentPopup.title || "Popup image"}
                className="w-full h-auto object-contain rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {currentPopup.description ? (
                  <div dangerouslySetInnerHTML={{ __html: currentPopup.description }} />
                ) : (
                  <p className="text-center text-gray-500">No additional content</p>
                )}
              </div>
            )}
          </div>
        </div>

        {popups.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} of {popups.length}
          </div>
        )}
      </div>

      <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
            `}</style>
    </div>
  );
}

export default PopupBanner;
