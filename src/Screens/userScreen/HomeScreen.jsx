import Slider from '../../Components/Slider';
import VideoPlayer from '../../Components/ReportTab/VideoPlayer';
import { Stack, Box } from '@mui/material';
import ReportTabs from '../../Components/ReportTab/ReportTabs';
import NoticeMarque from '../../Components/NoticeMarque';
import NoticeTabs from '../../Components/Notice-tab/NoticeTabs';
import MessageSection from '../../Components/MessageSection';


function HomeScreen() {
    return (
        <Box >
            <NoticeMarque />
            <Box mb={4}>
                <Slider />
            </Box>
            <Stack
                spacing={3}
                sx={{
                    px: { xs: '1rem', sm: '2rem' },
                    mb: 4
                }}
            >
                <MessageSection/>
                <NoticeTabs />
                <ReportTabs />
                <VideoPlayer />
            </Stack>
        </Box>
    );
}

export default HomeScreen;