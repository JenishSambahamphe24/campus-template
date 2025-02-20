import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { AuthProvider } from './context/AuthContextProvider.jsx';
import { ThemeProvider } from '@material-tailwind/react'
import ContactUsPage from './Screens/userScreen/ContactUsPage.jsx';
import HomeScreen from './Screens/userScreen/HomeScreen.jsx';
import NewsPage from './Screens/userScreen/News/NewsPage.jsx';
import GalleryPage from './Screens/userScreen/Gallery/GalleryPage.jsx';
import GalleryGrid from './Screens/userScreen/Gallery/GalleryGrid.jsx';
import TeamMemberDetails from './Screens/userScreen/about-us/TeamMemberDetails.jsx';
import NewsGrid from './Screens/userScreen/News/NewsGrid.jsx';
import OurTeam from './Screens/userScreen/about-us/OurTeam.jsx';
import Publication from './Screens/userScreen/publications/Publication.jsx';
import Report from './Screens/userScreen/publications/Report.jsx';

import AdminLayout from './Screens/cmsScreen/AdminLayout.jsx';
import AdminHomePage from './Screens/cmsScreen/cms-components/AdminHomePage.jsx';
import TeamList from './Screens/cmsScreen/cms-components/cms-team/TeamList.jsx';
import AddTeam from './Screens/cmsScreen/cms-components/cms-team/AddTeam.jsx';
import AddGallery from './Screens/cmsScreen/cms-components/cms-gallery/AddGallery.jsx';
import PublicationList from './Screens/cmsScreen/cms-components/cms-publication/PublicationList.jsx';
import AddPublication from './Screens/cmsScreen/cms-components/cms-publication/AddPublication.jsx';
import PublicationCategory from './Screens/cmsScreen/cms-components/cms-publication/PublicationCategory.jsx';
import GalleryList from './Screens/cmsScreen/cms-components/cms-gallery/Image-gallery/GalleryList.jsx';
import 'react-toastify/dist/ReactToastify.css';
import CmsFeedback from './Screens/cmsScreen/cms-components/Feedback/CmsFeedback.jsx';
import FaqPage from './Components/FaqPage.jsx';
import Faqlist from './Screens/cmsScreen/cms-components/cms-faq/Faqlist.jsx';
import AddFaq from './Screens/cmsScreen/cms-components/cms-faq/AddFaq.jsx';
import PublicationPage from './Screens/userScreen/publications/PublicationPage.jsx';
import AdminSignIn from './Screens/userScreen/AdminSignIn.jsx';
import PrivateRoutes from './Screens/PrivateRoutes.jsx';
import AddAboutUs from './Screens/cmsScreen/cms-components/cms-aboutUs/AddAboutUs.jsx';
import AboutUsList from './Screens/cmsScreen/cms-components/cms-aboutUs/AboutUsList.jsx';
import EditTeam from './Screens/cmsScreen/cms-components/cms-team/components/EditTeam.jsx';
import EditPublication from './Screens/cmsScreen/cms-components/cms-publication/EditPublication.jsx';
import FileUpload from './Screens/FileUpload.jsx';
import EditGallery from './Screens/cmsScreen/cms-components/cms-gallery/EditGallery.jsx';
import ScrollToTop from './ScrollToTop.js';
import EditAboutUs from './Screens/cmsScreen/cms-components/cms-aboutUs/EditAboutUs.jsx';

import ProgramPage from './Components/Programs/ProgramPage.jsx';
import FacultyList from './Screens/cmsScreen/cms-components/cms-academics/FacultyList.jsx';
import ProgramList from './Screens/cmsScreen/cms-components/cms-academics/ProgramList.jsx';
import AddFaculty from './Screens/cmsScreen/cms-components/cms-academics/AddFaculty.jsx';
import AddProgram from './Screens/cmsScreen/cms-components/cms-academics/AddProgram.jsx';
import TestimonialsPage from './Screens/userScreen/about-us/TestimonialsPage.jsx';
import ProgramListUser from './Components/Programs/ProgramListUser.jsx';
import TestimonialsList from './Screens/cmsScreen/cms-components/cms-academics/cms-testimonials/TestimonialsList.jsx';
import AddTestimonials from './Screens/cmsScreen/cms-components/cms-academics/cms-testimonials/AddTestimonials.jsx';
import EditTestimonial from './Screens/cmsScreen/cms-components/cms-academics/cms-testimonials/EditTestimonial.jsx';
import ReportTabs from './Components/ReportTab/ReportTabs.jsx';
import LinkLists from './Screens/cmsScreen/cms-components/cms-links/LinkLists.jsx';
import AddLink from './Screens/cmsScreen/cms-components/cms-links/AddLink.jsx';
import ChairmanMessage from './Components/AboutUs/ChairmanMessage.jsx';
import CampusChiefMessage from './Components/AboutUs/CampusChiefMessage.jsx';
import EditProgram from './Screens/cmsScreen/cms-components/cms-academics/EditProgram.jsx';
import Introduction from './Components/AboutUs/Introduction.jsx';
import Notices from './Screens/userScreen/publications/Notices.jsx';
import Downloads from './Screens/userScreen/publications/Downloads.jsx';
import Curriculum from './Screens/userScreen/publications/Curriculum.jsx';
import CurriculumPage from './Screens/userScreen/publications/CurriculumPage.jsx';
import ChangePassword from './Screens/cmsScreen/cms-components/ChangePassword.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index={true} path='/' element={<HomeScreen />} />
        <Route index={true} path='/signIn' element={<AdminSignIn />} />
        <Route index={true} path='/contact' element={<ContactUsPage />} />
        <Route index={true} path='/news' element={<NewsGrid />} />
        <Route index={true} path='/news/:id' element={<NewsPage />} />
        <Route index={true} path='/gallery' element={<GalleryPage />} />
        <Route index={true} path='/galleryGrid/:id' element={<GalleryGrid />} />
        <Route index={true} path='/member-details/:id' element={<TeamMemberDetails />} />
        <Route index={true} path='/team' element={<OurTeam />} />
        <Route index={true} path='/report' element={<Report />} />
        <Route index={true} path='/downloads' element={<Downloads />} />
        <Route index={true} path='/notices' element={<Notices />} />
        <Route index={true} path='/report-tab' element={<ReportTabs />} />
        <Route index={true} path='/publication' element={<Publication />} />
        <Route index={true} path='/publication/:id' element={<PublicationPage />} />

        <Route index={true} path='/curriculum' element={<Curriculum />} />
        <Route index={true} path='/curriculum/:id' element={<CurriculumPage />} />

        <Route index={true} path='/faq' element={<FaqPage />} />
        <Route index={true} path='/testimonials' element={<TestimonialsPage />} />
        <Route index={true} path='/program/:id' element={<ProgramPage />} />
        <Route index={true} path='/program-list' element={<ProgramListUser />} />

        <Route index={true} path='/introduction' element={<Introduction />} />
        <Route index={true} path='/message-from-chairman' element={<ChairmanMessage />} />
        <Route index={true} path='/message-from-campus_chief' element={<CampusChiefMessage />} />
      </Route>

      <Route element={<PrivateRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index={true} path='/admin' element={<AdminHomePage />} />
          <Route index={true} path='fileUpload' element={<FileUpload />} />
          <Route index={true} path='viewTeam' element={<TeamList />} />
          <Route index={true} path='addTeam' element={<AddTeam />} />
          <Route index={true} path='editTeam/:teamId' element={<EditTeam />} />
          <Route index={true} path='publications' element={<PublicationList />} />
          <Route index={true} path='addPublication' element={<AddPublication />} />
          <Route index={true} path='editPublication/:pubId' element={<EditPublication />} />
          <Route index={true} path='addCategory' element={<PublicationCategory />} />
          <Route index={true} path='addGallery' element={<AddGallery />} />
          <Route index={true} path='viewGallery' element={<GalleryList />} />
          <Route index={true} path='editGallery/:id' element={<EditGallery />} />
          <Route index={true} path='feedback' element={<CmsFeedback />} />
          <Route index={true} path='faq' element={<Faqlist />} />
          <Route index={true} path='addFaq' element={<AddFaq />} />
          <Route index={true} path='addAboutUs' element={<AddAboutUs />} />
          <Route index={true} path='aboutUs' element={<AboutUsList />} />
          <Route index={true} path='editAboutUs/:itemId' element={<EditAboutUs />} />

          <Route index={true} path='testimonials' element={<TestimonialsList />} />
          <Route index={true} path='addTestimonial' element={<AddTestimonials />} />
          <Route index={true} path='links' element={<LinkLists />} />
          <Route index={true} path='addLink' element={<AddLink />} />
          <Route index={true} path='editTestimonial/testimonialId' element={<EditTestimonial />} />

          <Route index={true} path='addFaculty' element={<AddFaculty />} />
          <Route index={true} path='faculties' element={<FacultyList />} />
          <Route index={true} path='programs' element={<ProgramList />} />
          <Route index={true} path='addProgram' element={<AddProgram />} />
          <Route index={true} path='editProgram/:id' element={< EditProgram />} />

          <Route index={true} path='password-settings' element={< ChangePassword />} />
        </Route>
      </Route>
    </>
  ),
);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}>
        <ThemeProvider>
          <ScrollToTop />
          <App />
        </ThemeProvider>
      </RouterProvider>
    </AuthProvider>
  </React.StrictMode>,
)
