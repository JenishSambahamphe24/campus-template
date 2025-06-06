import { useState, useEffect } from 'react';
import { TbSpeakerphone } from "react-icons/tb";
import { getAllpublication } from '../Screens/cmsScreen/cms-components/cms-publication/publicationApi';
import { Link } from 'react-router-dom';

function NoticeMarque() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllpublication();
      const latestReports = data
        .filter(item => item.categoryName === 'Report' && item.isScrollable === true)
        .sort((a, b) => b.id - a.id)
        .slice(0, 2).map(item => ({
          ...item,
          route: "/report"
        }));

      const latestNotices = data
        .filter(item => item.categoryName === 'Notices' && item.isScrollable === true)
        .sort((a, b) => b.id - a.id)
        .slice(0, 2).map(item => ({
          ...item,
          route: "/notices"
        }));

      const latestPublication = data
        .filter(item => item.categoryName === 'Publication' && item.isScrollable === true)
        .sort((a, b) => b.id - a.id)
        .slice(0, 2).map(item => ({
          ...item,
          route: "/publication"
        }));

      const latestDownloads = data
        .filter(item => item.categoryName === 'Downloads' && item.isScrollable === true)
        .sort((a, b) => b.id - a.id)
        .slice(0, 2).map(item => ({
          ...item,
          route: "/downloads"
        }));

      const latestNews = data
        .filter(item => item.categoryName === 'News and Events')
        .sort((a, b) => b.id - a.id)
        .slice(0, 2).map(item => ({
          ...item,
          route: "/news"
        }));
      setNotices([...latestReports, ...latestNews, ...latestNotices, ...latestPublication, ...latestDownloads]);
    };
    fetchData();
  }, []);


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
            {
              notices.map((item, index) => (
                <Link to={item.route} key={index}>
                  <span className="mx-4 text-sm text-[#f36710] hover:text-[#1169bf]">
                    {item.title}  <span className='text-[#a52a2a]'> | </span>
                  </span>
                </Link>

              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoticeMarque;
