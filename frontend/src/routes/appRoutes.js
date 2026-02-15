import * as React from "react";
import Client from "../pages/client/Client";
import MailIcon from '@mui/icons-material/Mail';
import Contact from "../pages/contact/Contact";

export const AppRoutes = [
    {
        label: "Clients",
        path: "/",
        element: <Client/>,
        icon: MailIcon
    },
    {
        label: "Contacts",
        path: "/contacts",
        element: <Contact/>,
        icon: MailIcon
    }
]
