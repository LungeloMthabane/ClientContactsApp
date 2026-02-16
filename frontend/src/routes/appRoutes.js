import * as React from "react";
import Client from "../pages/client/Client";
import Contact from "../pages/contact/Contact";
import ContactsIcon from '@mui/icons-material/Contacts';
import PeopleIcon from '@mui/icons-material/People';

export const AppRoutes = [
    {
        label: "Clients",
        path: "/",
        element: <Client/>,
        icon: PeopleIcon
    },
    {
        label: "Contacts",
        path: "/contacts",
        element: <Contact/>,
        icon: ContactsIcon
    }
]
