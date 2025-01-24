import Slider from '../../Components/Slider'
import PublicationTabs from '../../Components/publicationTab/PublicationTabs'
import AboutUs from '../../Components/AboutUs/AboutUs'
import VideoPlayer from '../../Components/ReportTab/VideoPlayer'
import { Grid, Stack } from '@mui/material'
import ProgramSection from '../../Components/Programs/ProgramSection'
import ReportTabs from '../../Components/ReportTab/ReportTabs'
import NoticeMarque from '../../Components/NoticeMarque'

function HomeScreen() {
    return (
        <div>
            <NoticeMarque />
            <Slider />
            <Stack px='2rem' rowGap='1rem'>
                <AboutUs />
                <ProgramSection />
                <ReportTabs />
                <PublicationTabs />
                <VideoPlayer />
            </Stack>
        </div>

    )
}

export default HomeScreen