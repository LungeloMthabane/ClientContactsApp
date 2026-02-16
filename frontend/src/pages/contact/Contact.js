import React, { useState, useEffect } from 'react';
import { getAllContacts, deleteClientContact, createContactWithClients } from '../../api/contactApi';
import { getAllClients } from '../../api/clientsApi';
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
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import AddIcon from "@mui/icons-material/Add";
import Autocomplete from '@mui/material/Autocomplete';
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

function Contact() {
    const [selectedContact, setSelectedContact] = useState();
    const [refreshDataTable, setRefreshDataTable] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openNewContactDialog, setOpenNewContactDialog] = useState(false);
    const [value, setValue] = useState('1');
    const [newContact, setNewContact] = useState({
        name: "",
        surname: "",
        email: "",
        clients: []
    });
    const [addNewClient, setAddNewClient] = useState(false);
    const [allClients, setClients] = useState([]);

    useEffect(() => {
        getAllClients().then(setClients)
    }, []);


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
            width: 300,
        },
        {
            field: "surname",
            headerName: "Surname",
            width: 300,
        },
        {
            field: "email",
            headerName: "Email",
            width: 300,
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

    const actions = [
        {
            key: "addContact",
            icon: <NoteAddOutlinedIcon />,
            name: "Add Action Point",
        },
    ];

    const handleSpeedDialActionButtonClicked = (key) => {
        switch (key) {
            case "addContact":
                setOpenNewContactDialog(true);
                break;
        }
    };


    const handleUpdateNewContactObject = (updatedObj) => {
        setNewContact(updatedObj);
    };

    const handleOnChange = (event, newValue) => {
        if (newValue) {
            const clientDetails = allClients.find((client) => client.name === newValue);

            handleUpdateNewContactObject({
                ...newContact,
                clients: [...newContact.clients,  {
                    id:  clientDetails.id,
                    name: clientDetails.name,
                    code: clientDetails.code,
                }],
            });
        }
    };

    const handleCreateContact = async () => {
        const payload = {
            name: newContact.name,
            surname: newContact.surname,
            email: newContact.email,
            clientIds: newContact.clients.map((client) => client.id),
        }

        try {
            await createContactWithClients(payload).then(() => {
                setRefreshDataTable(true);
                setOpenNewContactDialog(false);
            });
        } catch (error) {

        }
    }

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

            <CustomDialogComponent
                open={openNewContactDialog}
                setOpen={setOpenNewContactDialog}
                dialogTitle="New Contact"
                maxWidth="md"
                onSaveClicked={handleCreateContact}
                enableSaveButton={!(newContact.name && newContact.surname && newContact.email && newContact.email.includes('@'))}
            >
                <Box sx={{ typography: 'body1', m: "2rem" }}>
                    <Stack direction="column" spacing={2}>
                        <Stack direction="row" spacing={2}>
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
                                            ...newContact,
                                            name: event.target.value,
                                        });
                                    }}
                                    value={newContact?.name}
                                />
                            </div>

                            <div>
                                <Typography
                                    sx={{
                                        fontSize: "12px",
                                        color: "grey",
                                    }}
                                >
                                    Surname:
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
                                            ...newContact,
                                            surname: event.target.value,
                                        });
                                    }}
                                    value={newContact?.surname}
                                />
                            </div>
                        </Stack>

                        <div>
                            <Typography
                                sx={{ fontSize: "12px", color: "grey", marginBottom: "0.5rem" }}
                            >
                                Email Address:
                            </Typography>
                            <TextField
                                required
                                id="outlined-required"
                                defaultValue=""
                                sx={{
                                    width: "25rem",
                                }}
                                type="email"
                                size="small"
                                name="email"
                                onChange={(event) => {
                                    handleUpdateNewContactObject({
                                        ...newContact,
                                        email: event.target.value,
                                    });
                                }}
                                value={newContact?.email}
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
                                Add Client
                            </Button>
                        ) : (
                            <div>
                                <Divider sx={{ mt: 2, mb: 2}}/>
                                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                    <Autocomplete
                                        id="free-solo-demo"
                                        freeSolo
                                        onChange={handleOnChange}
                                        options={allClients.map((option) => option.name)}
                                        renderInput={(params) => <TextField {...params} label="Client Name" sx={{
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

                        {newContact.clients.length > 0 && (
                            <Stack direction="column" spacing={2}>
                                <Typography sx={{ fontSize: "12px", color: "grey" }}> Contact to be linked with: </Typography>
                                {newContact.clients.map((client, index) => (
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

export default Contact;
