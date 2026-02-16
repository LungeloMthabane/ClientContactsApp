import React, { useState } from 'react';
import { getAllContacts, deleteClientContact } from '../../api/contactApi';
import { Typography, Box, Stack } from "@mui/material";
import CustomDataTableComponent from "../../components/atoms/dataTable/dataTable";
import CustomGroupedAvatar from "../../components/atoms/groupedAvatar/groupedAvatar";
import CustomDialogComponent from "../../components/atoms/dialog/dialog";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

function Contact() {
    const [selectedContact, setSelectedContact] = useState();
    const [refreshDataTable, setRefreshDataTable] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const styles = {
        headerBox: {
            height: "4rem",
            borderRadius: "35px",
            boxShadow: "5",
            m: "0.5rem"
        },
        headerText: {
            fontWeight: "500",
            fontSize: "24px",
            color: "black",
            alignItems: "left"
        },
        dataTableSection: {
            paddingTop: "2rem",
        },
        detailsLabel: {
            fontSize: "14px",
            color: "grey"
        },
        detailsText: {
            fontSize: "16px",
        }
    }

    const contactDataTableColumns = [
        {
            field: "name",
            headerName: "Name",
            width: 550,
        },
        {
            field: "surname",
            headerName: "Surname",
            width: 550,
        },
        {
            field: "email",
            headerName: "Email",
            width: 550,
        },
        {
            field: 'clients',
            headerName: "Linked Clients",
            width: 150,
            align: "left",
            renderCell: (params) => (
                params.value.length > 0 ?
                    <CustomGroupedAvatar groupedItems={params.value} /> : 'No Clients(s) found'
            )
        }
    ]

    const clientDataTableColumns = [
        {
            field: "name",
            headerName: "Client Name",
            width: 300,
        },
        {
            field: "code",
            headerName: "Client Code",
            width: 300,
        },
    ]

    const handleOnRowSelect = (selectedContact) => {
        setSelectedContact(selectedContact);
        setOpenDialog(true)
    }

    const renderContactDetails = () => {
        return (
            <Box
                sx={{
                    m: 2,
                }}
            >
                <Stack direction="row" sx={{ mt: 2 }} spacing={13}>
                    <Stack direction="column">
                        <Typography sx={styles.detailsLabel}>
                            Full Name:
                        </Typography>
                        <Typography sx={styles.detailsText}>
                            {`${selectedContact?.name} ${selectedContact?.surname}`}
                        </Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography sx={styles.detailsLabel}>
                            Email Address:
                        </Typography>
                        <Typography sx={styles.detailsText}>
                            {selectedContact?.email}
                        </Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography sx={styles.detailsLabel}>
                            No.of Linked Clients:
                        </Typography>
                        <Typography sx={styles.detailsText}>
                            {selectedContact?.clients.length >  0 ? selectedContact?.clients.length : "No Client(s) found"}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        )
    }

    const handleDelete = async (row) => {
        try {
            await deleteClientContact(selectedContact?.id, row?.id);

            setSelectedContact((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    contacts: prev.clients?.filter((x) => x.id !== row.id) || []
                };
            });

            setRefreshDataTable(true);

        } catch (error) {
            console.error("Failed to delete client:", error);
            alert("Failed to delete client");
        }
    };

    const renderClientTable = () => (
        <CustomDataTableComponent
            columns={clientDataTableColumns}
            tableData={selectedContact?.clients}
            refreshDataTable={refreshDataTable}
            disableRowClick
            actions={[
                {
                    action: (row) => {handleDelete(row)},
                    icon: <DeleteOutlinedIcon color='error'/>
                }
            ]}
        />
    )

    return (
        <div>
            <Box sx={styles.headerBox}>
                <div>
                    <Typography sx={styles.headerText}>
                        Contacts
                    </Typography>
                </div>
            </Box>
            <div style={styles.dataTableSection}>
                <CustomDataTableComponent
                    columns={contactDataTableColumns}
                    refreshDataTable={refreshDataTable}
                    setRefreshDataTable={setRefreshDataTable}
                    request={getAllContacts}
                    onRowClick={(row) => handleOnRowSelect(row.row)}/>
            </div>

            <CustomDialogComponent open={openDialog} setOpen={setOpenDialog} dialogTitle={`${selectedContact?.name} ${selectedContact?.surname}`} maxWidth="md">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Client Details" value="1" sx={{ textTransform: 'none' }}/>
                                <Tab label={`Contacts (${selectedContact?.clients.length})`} value="2" sx={{ textTransform: 'none' }}/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">{renderContactDetails()}</TabPanel>
                        <TabPanel value="2">{renderClientTable()}</TabPanel>
                    </TabContext>
                </Box>
            </CustomDialogComponent>
        </div>
    )
}

export default Contact;
