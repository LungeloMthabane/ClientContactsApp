import React, {useEffect, useState} from 'react';
import { getAllClients, deleteClientContact, createClientsWithContacts } from '../../api/clientsApi';
import { getAllContacts } from '../../api/contactApi';
import {Typography, Box, Stack, TextField, Button} from "@mui/material";
import CustomDataTableComponent from "../../components/atoms/dataTable/dataTable";
import CustomGroupedAvatar from "../../components/atoms/groupedAvatar/groupedAvatar";
import CustomDialogComponent from "../../components/atoms/dialog/dialog";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";

function Client() {
    const [selectedClient, setSelectedClient] = useState();
    const [refreshDataTable, setRefreshDataTable] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = React.useState('1');
    const [newClientObj, setNewClientObj] = useState({
        name: "",
        contacts: []
    });
    const [addNewClient, setAddNewClient] = useState(false);
    const [allContacts, setAllContacts] = useState([]);
    const [openNewClientDialog, setOpenNewClientDialog] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        getAllContacts().then(setAllContacts);
    }, []);

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

    const clientDataTableColumns = [
        {
            field: "name",
            headerName: "Client Name",
            width: 550,
        },
        {
            field: "code",
            headerName: "Client Code",
            width: 550,
        },
        {
            field: 'contacts',
            headerName: "Linked Contacts",
            width: 150,
            align: "left",
            renderCell: (params) => (
                params.value.length > 0 ?
                    <CustomGroupedAvatar groupedItems={params.value} /> : 'No Contact(s) found'
            )
        }
    ]

    const contactsDataTableColumns = [
        {
            field: "name",
            headerName: "Full Name",
            width: 300,
            valueGetter: (_value, row) => `${row.name || ''} ${row.surname || ''}`
        },
        {
            field: "email",
            headerName: "Email Address",
            width: 300,
        },
    ]

    const handleOnRowSelect = (selectedClient) => {
        setSelectedClient(selectedClient);
        setOpenDialog(true)
    }

    const renderClientDetails = () => {
        return (
            <Box
                sx={{
                    m: 2,
                }}
            >
                <Stack direction="row" sx={{ mt: 2 }} spacing={13}>
                    <Stack direction="column">
                        <Typography sx={styles.detailsLabel}>
                            Client Name:
                        </Typography>
                        <Typography sx={styles.detailsText}>
                            {selectedClient?.name}
                        </Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography sx={styles.detailsLabel}>
                            Client Code:
                        </Typography>
                        <Typography sx={styles.detailsText}>
                            {selectedClient?.code}
                        </Typography>
                    </Stack>
                    <Stack direction="column">
                        <Typography sx={styles.detailsLabel}>
                            No.of Linked Contacts:
                        </Typography>
                        <Typography sx={styles.detailsText}>
                            {selectedClient?.contacts.length >  0 ? selectedClient?.contacts.length : "No Contact(s) found"}
                        </Typography>
                    </Stack>
                </Stack>
            </Box>
        )
    }

    const handleDelete = async (row) => {
        try {
            await deleteClientContact(selectedClient?.id, row?.id);

            setSelectedClient((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    contacts: prev.contacts?.filter((x) => x.id !== row.id) || []
                };
            });

            setRefreshDataTable(true);

        } catch (error) {
            console.error("Failed to delete contact:", error);
            alert("Failed to delete contact");
        }
    };

    const renderContactsTable = () => (
        <CustomDataTableComponent
            columns={contactsDataTableColumns}
            tableData={selectedClient?.contacts}
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

    const actions = [
        {
            key: "addClient",
            icon: <NoteAddOutlinedIcon />,
            name: "Add Action Point",
        },
    ];

    const handleSpeedDialActionButtonClicked = (key) => {
        switch (key) {
            case "addClient":
                setOpenNewClientDialog(true);
                break;
        }
    };


    const handleUpdateNewContactObject = (updatedObj) => {
        setNewClientObj(updatedObj);
    };

    const handleOnChange = (event, newValue) => {
        if (newValue) {
            const value = newValue.split(' ');
            const contactDetails = allContacts.find((client) => client.name === value[0] && client.surname === value[1]);

            handleUpdateNewContactObject({
                ...newClientObj,
                contacts: [...newClientObj.contacts,  {
                    id:  contactDetails.id,
                    name: contactDetails.name,
                    surname: contactDetails.surname,
                }],
            });
        }
    };

    const handleCreateClient = async () => {
        const payload = {
            name: newClientObj.name,
            contactIds: newClientObj.contacts.map((contact) => contact.id),
        }

        try {
            await createClientsWithContacts(payload).then(() => {
                setRefreshDataTable(true);
                setOpenNewClientDialog(false);
            });
        } catch (error) {

        }
    }

    return (
        <div>
            <Box sx={styles.headerBox}>
                <div>
                    <Typography sx={styles.headerText}>
                        Clients
                    </Typography>
                </div>
            </Box>
            <div style={styles.dataTableSection}>
                <CustomDataTableComponent
                    columns={clientDataTableColumns}
                    refreshDataTable={refreshDataTable}
                    setRefreshDataTable={setRefreshDataTable}
                    request={getAllClients}
                    onRowClick={(row) => handleOnRowSelect(row.row)}/>
            </div>

            <CustomDialogComponent open={openDialog} setOpen={setOpenDialog} dialogTitle={selectedClient?.name} maxWidth="md">
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Client Details" value="1" sx={{ textTransform: 'none' }}/>
                                <Tab label={`Contacts (${selectedClient?.contacts.length})`} value="2" sx={{ textTransform: 'none' }}/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">{renderClientDetails()}</TabPanel>
                        <TabPanel value="2">{renderContactsTable()}</TabPanel>
                    </TabContext>
                </Box>
            </CustomDialogComponent>

            <CustomDialogComponent
                open={openNewClientDialog}
                setOpen={setOpenNewClientDialog}
                dialogTitle="New Client"
                maxWidth="md"
                onSaveClicked={handleCreateClient}
                enableSaveButton={!(newClientObj.name)}
            >
                <Box sx={{ typography: 'body1', m: "2rem" }}>
                    <Stack direction="column" spacing={2}>
                        <div>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "grey",
                                }}
                            >
                                Name:
                            </Typography>
                            <TextField
                                required
                                id="outlined-required"
                                defaultValue=""
                                sx={{
                                    width: "25rem",
                                }}
                                size="small"
                                onChange={(event) => {
                                    handleUpdateNewContactObject({
                                        ...newClientObj,
                                        name: event.target.value,
                                    });
                                }}
                                value={newClientObj?.name}
                            />
                        </div>

                        {!addNewClient ? (
                            <Button
                                variant="text"
                                sx={{
                                    justifyContent: "left",
                                    textTransform: "none",
                                }}
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setAddNewClient(true)
                                }}
                            >
                                Add Contact
                            </Button>
                        ) : (
                            <div>
                                <Divider sx={{ mt: 2, mb: 2}}/>
                                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                    <Autocomplete
                                        id="free-solo-demo"
                                        freeSolo
                                        onChange={handleOnChange}
                                        options={allContacts.map((option) => {
                                            return `${option.name} ${option.surname}`;
                                        })}
                                        renderInput={(params) => <TextField {...params} label="Contact Name" sx={{
                                            width: "25rem",
                                        }} size="small"/>}
                                    />
                                    <Button
                                        variant="text"
                                        startIcon={<CloseIcon />}
                                        sx={{
                                            marginTop: "1.5rem",
                                        }}
                                        onClick={() => {
                                            setAddNewClient(false)
                                        }}
                                    />
                                </Stack>
                            </div>
                        )}

                        {newClientObj?.contacts.length > 0 && (
                            <Stack direction="column" spacing={2}>
                                <Typography sx={{ fontSize: "12px", color: "grey" }}> Client to be linked with: </Typography>
                                {newClientObj.contacts.map((client, index) => (
                                    <Typography sx={{ fontSize: "14px"}} key={index}>
                                        {client.name}
                                    </Typography>
                                ))}
                            </Stack>
                        )}
                    </Stack>
                </Box>
            </CustomDialogComponent>

            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        onClick={() => handleSpeedDialActionButtonClicked(action.key)}
                    />
                ))}
            </SpeedDial>
        </div>
    )
}

export default Client;
