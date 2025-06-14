import { useState, useEffect } from 'react'
import { Grid, Button } from '@mui/material'
import ReusablePagination from '../ReusablePagination'
import { Link } from 'react-router-dom'
import { getAllTeams } from '../../cmsScreen/cms-components/cms-team/teamApi'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

const IMAGE_URL = import.meta.env.VITE_IMAGE_URL

function OurTeam() {
    const [allTeamMember, setAllTeamMeber] = useState([])
    const [activeTab, setActiveTab] = useState("Committe member");

    // Separate pagination state for each category
    const [paginationState, setPaginationState] = useState({
        "Committe member": { currentPage: 1 },
        "Teaching staff": { currentPage: 1 },
        "Non-teaching staff": { currentPage: 1 }
    });

    const defaultImage = 'https://media.istockphoto.com/id/1327592506/vector/default-avatar-photo-placeholder-icon-grey-profile-picture-business-man.jpg?s=612x612&w=0&k=20&c=BpR0FVaEa5F24GIw7K8nMWiiGmbb8qmhfkpXcp1dhQg='

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllTeams()
            setAllTeamMeber(data)
        };
        fetchData()
    }, [])

    const tabData = [
        {
            label: "Committee Members",
            value: "Committe member",
        },
        {
            label: "Teaching staffs",
            value: "Teaching staff",
        },
        {
            label: "Non-teaching staffs",
            value: "Non-teaching staff",
        },
    ];

    const itemsPerPage = 8;

    // Get filtered data for current tab
    const getFilteredData = (category) => {
        return allTeamMember
            ?.filter(item => item.category === category)
            .sort((a, b) => a.index - b.index) || [];
    };

    // Get paginated data for current tab
    const getPaginatedData = (category) => {
        const filteredData = getFilteredData(category);
        const currentPage = paginationState[category].currentPage;
        const indexOfLastItem = itemsPerPage * currentPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Get total pages for current category
    const getTotalPages = (category) => {
        const filteredData = getFilteredData(category);
        return Math.ceil(filteredData.length / itemsPerPage);
    };

    // Handle page change for specific category
    const handlePageChange = (category, page) => {
        setPaginationState(prev => ({
            ...prev,
            [category]: { currentPage: page }
        }));
    };

    // Handle tab change
    const handleTabChange = (value) => {
        setActiveTab(value);
    };

    // Render team member card
    const renderTeamMemberCard = (item, index, showLinkWrapper = false) => {
        const cardContent = (
            <>
                <img
                    src={item.ppImage ? `${IMAGE_URL}/team/${item.ppImage}` : defaultImage}
                    alt=""
                    className="h-[250px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="relative border border-gray-100 bg-white p-1">
                    <h3 className="mt-1 text-sm font-medium text-gray-900 line-clamp-1">
                        {`${item.salutation ? item.salutation : ''} ${item.firstName} ${item.middleName} ${item.lastName}`}
                    </h3>
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.subCategory}
                        {item.department ? `, ${item.department}` : ''}
                    </h3>
                    <h3 className="text-sm  font-medium text-gray-900 line-clamp-1">
                        {item.highestAcademicDeg ? `${item.highestAcademicDeg}` : ''}
                    </h3>

                    {!showLinkWrapper && (
                        <Link to={`/member-details/${item.id}`} className="group relative block overflow-hidden">
                            <Button
                                sx={{ textTransform: 'none', mt: '10px' }}
                                size="small"
                                variant="outlined"
                                className="flex items-center gap-3 bg-red-900"
                            >
                                Learn More
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                    />
                                </svg>
                            </Button>
                        </Link>
                    )}

                    {showLinkWrapper && (
                        <Button
                            sx={{ textTransform: 'none', mt: '10px' }}
                            size="small"
                            variant="outlined"
                            className="flex items-center gap-3 bg-red-900"
                        >
                            Learn More
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-4 w-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                />
                            </svg>
                        </Button>
                    )}
                </div>
            </>
        );

        return (
            <Grid
                item
                xs={11.8}
                sm={5.8}
                md={2.9}
                lg={2.9}
                key={index}
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                {showLinkWrapper ? (
                    <Link to={`/member-details/${item.id}`} className="group relative block overflow-hidden">
                        {cardContent}
                    </Link>
                ) : (
                    <div className="group relative block overflow-hidden">
                        {cardContent}
                    </div>
                )}
            </Grid>
        );
    };

    return (
        <Grid container className='px-2 md:px-6 lg:px-9 py-8'>
            <Grid item xs={12}>
                <h1 className='text-center mb-4 text-2xl font-bold'>Our Team</h1>
            </Grid>
            <Grid item xs={12}>
                <Tabs value={activeTab}>
                    <TabsHeader
                        style={{
                            background: '#1169bf',
                            color: 'white',
                            zIndex: '1',
                            height: '35px',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            gap: '10px'
                        }}
                        className="rounded"
                    >
                        {tabData.map(({ label, value }) => (
                            <Tab
                                key={value}
                                value={value}
                                onClick={() => handleTabChange(value)}
                                style={{
                                    color: activeTab === value ? 'black' : 'white',
                                    padding: '0 16px',
                                    minWidth: 'auto',
                                    width: 'auto',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <h1 className='xs:text-xs'>
                                    {label}
                                </h1>
                            </Tab>
                        ))}
                    </TabsHeader>

                    <TabsBody>
                        {/* Committee Members Tab */}
                        <TabPanel style={{ marginTop: '20px', padding: '0' }} value="Committe member">
                            <Grid minHeight='250px' gap='10px' container mx='auto' mb='1.5rem' padding='10px 0px'>
                                {getPaginatedData("Committe member").map((item, index) =>
                                    renderTeamMemberCard(item, index, false)
                                )}
                            </Grid>

                            {getTotalPages("Committe member") > 1 && (
                                <div className="flex justify-center mt-6">
                                    <ReusablePagination
                                        currentPage={paginationState["Committe member"].currentPage}
                                        totalPages={getTotalPages("Committe member")}
                                        onPageChange={(page) => handlePageChange("Committe member", page)}
                                    />
                                </div>
                            )}
                        </TabPanel>

                        {/* Teaching Staff Tab */}
                        <TabPanel style={{ marginTop: '20px', padding: '0' }} value="Teaching staff">
                            <Grid container minHeight='250px' spacing={2} mx='auto' mb='1.5rem' padding='10px 0px'>
                                {getPaginatedData("Teaching staff").map((item, index) =>
                                    renderTeamMemberCard(item, index, true)
                                )}
                            </Grid>

                            {getTotalPages("Teaching staff") > 1 && (
                                <div className="flex justify-center mt-6">
                                    <ReusablePagination
                                        currentPage={paginationState["Teaching staff"].currentPage}
                                        totalPages={getTotalPages("Teaching staff")}
                                        onPageChange={(page) => handlePageChange("Teaching staff", page)}
                                    />
                                </div>
                            )}
                        </TabPanel>

                        {/* Non-Teaching Staff Tab */}
                        <TabPanel style={{ marginTop: '20px', padding: '0' }} value="Non-teaching staff">
                            <Grid container minHeight='250px' spacing={2} mx='auto' mb='1.5rem' padding='10px 0px'>
                                {getPaginatedData("Non-teaching staff").map((item, index) =>
                                    renderTeamMemberCard(item, index, true)
                                )}
                            </Grid>

                            {getTotalPages("Non-teaching staff") > 1 && (
                                <div className="flex justify-center mt-6">
                                    <ReusablePagination
                                        currentPage={paginationState["Non-teaching staff"].currentPage}
                                        totalPages={getTotalPages("Non-teaching staff")}
                                        onPageChange={(page) => handlePageChange("Non-teaching staff", page)}
                                    />
                                </div>
                            )}
                        </TabPanel>
                    </TabsBody>
                </Tabs>
            </Grid>
        </Grid>
    )
}

export default OurTeam