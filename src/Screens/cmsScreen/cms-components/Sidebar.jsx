import React from 'react'
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    PowerIcon,
    NewspaperIcon,
    PencilSquareIcon,
    FolderOpenIcon,
    VideoCameraIcon
} from "@heroicons/react/24/solid";




import { ChevronRightIcon, ChevronDownIcon, } from "@heroicons/react/24/outline";

function Sidebar() {
    const [open, setOpen] = React.useState(0);
    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };
    return (
        <Card className="h-[calc(100vh-2rem)] w-full max-w-[15rem] py-2 px-4 pl-1 bg-gray-200 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2 p-4">
                <Typography variant="h5" color="blue-gray">
                    Sidebar
                </Typography>
            </div>
            <List style={{paddingLeft:'0'}}>
                <Accordion
                    open={open === 1}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-5 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem  className="p-0" selected={open === 1}>
                        <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3 ">
                            <ListItemPrefix>
                                <PresentationChartBarIcon className="h-5 w-5" />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                Dashboard
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                        <List className="p-0">
                            <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Analytics
                            </ListItem>
                            <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Reporting
                            </ListItem>
                            <ListItem>
                                <ListItemPrefix>
                                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                                </ListItemPrefix>
                                Projects
                            </ListItem>
                        </List>
                    </AccordionBody>
                </Accordion>
                <Accordion
                    open={open === 2}
                    icon={
                        <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`}
                        />
                    }
                >
                    <ListItem className="p-0" selected={open === 2}>
                        <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
                            <ListItemPrefix>
                                <PencilSquareIcon className="h-5 w-5 " />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="mr-auto font-normal">
                                Publication
                            </Typography>
                        </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-0">
                        <List className="p-0">
                            <ListItem style={{ marginLeft: '30px' }}>
                                Reports
                            </ListItem>
                            <ListItem style={{ marginLeft: '30px' }}>
                                Products
                            </ListItem>
                        </List>
                    </AccordionBody>
                </Accordion>
                <ListItem>
                    <ListItemPrefix>
                        <VideoCameraIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Gallery
                    <ListItemSuffix>
                        <Chip value="14" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
                    </ListItemSuffix>
                </ListItem>
                <ListItem>
                    <ListItemPrefix>
                        <FolderOpenIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Projects
                </ListItem>
                <ListItem>
                    <ListItemPrefix>
                        <NewspaperIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    News and Articles
                </ListItem>
                <ListItem>
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Log Out
                </ListItem>
            </List>
        </Card>
    )
}

export default Sidebar