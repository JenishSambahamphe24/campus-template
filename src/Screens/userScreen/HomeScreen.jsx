import Slider from '../../Components/Slider'
import VideoPlayer from '../../Components/ReportTab/VideoPlayer'
import { Stack } from '@mui/material'
import ReportTabs from '../../Components/ReportTab/ReportTabs'
import NoticeMarque from '../../Components/NoticeMarque'
import NoticeTabs from '../../Components/Notice-tab/NoticeTabs'

function HomeScreen() {
    return (
        <div>
            <NoticeMarque />
            <Slider />
            <Stack px='2rem' rowGap='1rem'>
            <NoticeTabs />
                <ReportTabs />
                <VideoPlayer />
            </Stack>
        </div>

    )
}

export default HomeScreen