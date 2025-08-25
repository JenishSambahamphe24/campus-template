import { useState, useEffect } from 'react';
import { TbSpeakerphone } from "react-icons/tb";
import { getAllpublication } from '../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import { Link } from 'react-router-dom';
import NepaliDate from 'nepali-datetime';
import { extractDate } from './utilityFunctions';

function NoticeMarque() {
  const [notices, setNotices] = useState([]);
  const pad = (n) => n.toString().padStart(2, "0");

  const nepaliDate = new NepaliDate();
  const nepaliDateToday = `${nepaliDate.year}-${pad(nepaliDate.month)}-${pad(nepaliDate.day)}`;

  const isExpired = (expiredAt) => {
    if (!expiredAt) return false;
    return expiredAt < nepaliDateToday;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllpublication();

        const latestReports = data
          .filter(item => item.categoryName === 'Report' && item.isScrollable === true)
          .map(item => ({
            ...item,
            expiredAt: extractDate(item.expiredAt),
            route: "/report"
          }))
          .filter(item => !isExpired(item.expiredAt))
          .sort((a, b) => b.id - a.id)
          .slice(0, 2);

        const latestNotices = data
          .filter(item => item.categoryName === 'Notices' && item.isScrollable === true)
          .map(item => ({
            ...item,
            expiredAt: extractDate(item.expiredAt),
            route: `/notices/${item.id}`
          }))
          .filter(item => !isExpired(item.expiredAt))
          .sort((a, b) => b.id - a.id)
          .slice(0, 2);

        const latestPublication = data
          .filter(item => item.categoryName === 'Publication' && item.isScrollable === true)
          .map(item => ({
            ...item,
            expiredAt: extractDate(item.expiredAt),
            route: "/publication"
          }))
          .filter(item => !isExpired(item.expiredAt))
          .sort((a, b) => b.id - a.id)
          .slice(0, 2);

        const latestDownloads = data
          .filter(item => item.categoryName === 'Downloads' && item.isScrollable === true)
          .map(item => ({
            ...item,
            expiredAt: extractDate(item.expiredAt),
            route: "/downloads"
          }))
          .filter(item => !isExpired(item.expiredAt))
          .sort((a, b) => b.id - a.id)
          .slice(0, 2);

        const latestNews = data
          .filter(item => item.categoryName === 'News and Events')
          .map(item => ({
            ...item,
            expiredAt: extractDate(item.expiredAt),
            route: "/news"
          }))
          .filter(item => !isExpired(item.expiredAt))
          .sort((a, b) => b.id - a.id)
          .slice(0, 2);

        setNotices([...latestReports, ...latestNews, ...latestNotices, ...latestPublication, ...latestDownloads]);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };
    fetchData();
  }, [nepaliDateToday]);

  return (
    <div>
      <div className='border border-1 border-[#f36710] rounded-sm flex'>
        <div className='py-[2px] flex bg-[#f36710] pr-2'>
          <p className='border-1 pl-1 text-sm text-white tracking-tight'>
            Highlights
          </p>
          <TbSpeakerphone style={{ marginTop: '2px', marginLeft: '3px', color: 'white' }} />
        </div>

        <div className="relative flex-1 overflow-hidden group">
          <div className="absolute left-0 animate-marquee group-hover:cursor-pointer group-hover:animate-paused whitespace-nowrap">
            {notices.length > 0 ? (
              notices.map((item, index) => (
                <Link to={item.route} key={index}>
                  <span className="mx-4 text-sm text-[#f36710] hover:text-[#1169bf]">
                    {item.title}  <span className='text-[#a52a2a]'> | </span>
                  </span>
                </Link>
              ))
            ) : (
              <span className="mx-4 text-sm text-gray-500">No active notices available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeMarque;