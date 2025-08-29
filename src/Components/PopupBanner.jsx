import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { getAllpublication } from "../Screens/cmsScreen/cms-components/cms-publication/publicationApi";
import NepaliDate from "nepali-datetime";
import { extractDate } from "./utilityFunctions";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL;

function PopupBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [popups, setPopups] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nepaliDate = new NepaliDate();
  const nepaliDateToday = `${nepaliDate.year}-${String(
    nepaliDate.month + 1
  ).padStart(2, "0")}-${String(nepaliDate.day).padStart(2, "0")}`;

  // Check if popup is expired
  const isExpired = (expiredAt) => {
    if (!expiredAt) {
      console.log("No expiry date provided - treating as expired");
      return true;
    }

    const expiredDateStr = expiredAt.split("T")[0];
    const result = expiredDateStr < nepaliDateToday;

    // // Debug logs
    // console.log("Today:", nepaliDateToday);
    // console.log("Expired at:", expiredAt);
    // console.log("Extracted expiry date:", expiredDateStr);
    // console.log("Is expired:", result);

    return result;
  };

  // Fetch popups from API
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const response = await getAllpublication();
        const validPopups = response
          .filter((item) => item.isPopUp === true)
          .map((item) => ({
            id: item.id, // Use ID to sort by upload order
            title: item.title,
            image: item.thumbnailImage,
            expiredAt: extractDate(item.expiredAt),
          }))
          .filter((item) => !isExpired(item.expiredAt))
          .sort((a, b) => b.id - a.id); // Latest uploaded first

        setPopups(validPopups);
        if (validPopups.length > 0) setIsVisible(true);
      } catch (error) {
        console.error("Error fetching popups:", error);
      }
    };

    fetchPopups();
  }, [nepaliDateToday]);

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
            <img
              src={`${IMAGE_URL}/thumb/${currentPopup.image}`}
              alt={currentPopup.title || "Popup image"}
              className="w-full h-auto object-contain rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = "/path/to/fallback-image.jpg";
                e.target.alt = "Image not available";
              }}
            />
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
