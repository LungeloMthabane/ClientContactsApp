import React, { useState, useEffect } from 'react';
import { getAllContacts, deleteClientContact, createContactWithClients, updateContact } from '../../api/contactApi';
import { getAllClients } from '../../api/clientsApi';
import {Typography, Box, Stack, TextField, Button, IconButton} from "@mui/material";
import CustomDataTableComponent from "../../components/atoms/dataTable/dataTable";
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
import ToastComponent from "../../components/atoms/toast/toastComponent";
import CustomChipComponent from "../../components/atoms/chip/chip";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

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
    const [displayErrorAlert, setDisplayErrorAlert] = useState(false);
    const [apiResponseMessage, setApiResponseMessage] = useState();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState();
    const [editMode, setEditMode] = useState(false);

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
                    params.value.length : 'No Clients(s) found'
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

    const renderContactDetails = (editMode) => {
        return (
            <Box
                sx={{
                    m: 2,
                }}
            >
                <Stack direction="row" sx={{ mt: 2 }} spacing={13}>
                    <Stack direction="column">
                        {!editMode ? (
                            <>
                                <Typography sx={styles.detailsLabel}>
                                    Full Name:
                                </Typography>
                                <Typography sx={styles.detailsText}>
                                    {`${selectedContact?.name} ${selectedContact?.surname}`}
                                </Typography>
                            </>
                        ) : (
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
                                                ...selectedContact,
                                                name: event.target.value,
                                            }, editMode);
                                        }}
                                        value={selectedContact?.name}
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
                                                ...selectedContact,
                                                surname: event.target.value,
                                            }, editMode);
                                        }}
                                        value={selectedContact?.surname}
                                    />
                                </div>
                            </Stack>
                        )}
                    </Stack>
                    {!editMode && (
                        <>
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
                        </>
                    )}
                </Stack>
                {editMode && (
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
                                setDisplayErrorAlert(false);
                                setApiResponseMessage(undefined);

                                handleUpdateNewContactObject({
                                    ...selectedContact,
                                    email: event.target.value,
                                }, editMode);
                            }}
                            value={selectedContact?.email}
                        />
                    </div>
                )}
            </Box>
        )
    }

    const handleDelete = async (row) => {
        try {
            await deleteClientContact(selectedContact?.id, row?.id);

            setSelectedContact((prev) => {
                return {
                    ...prev,
                    clients: prev?.clients.filter((x) => x.id !== row?.id) || []
                };
            });

            setShowToast(true);
            setToastMessage(`${row.name} has been removed from linked clients.`)
            setRefreshDataTable(true);

        } catch (error) {
            alert("Failed to delete client");
        }
    };

    const renderClientTable = () => (
        <CustomDataTableComponent
            columns={clientDataTableColumns}
            tableData={selectedContact?.clients}
            refreshDataTable={refreshDataTable}
            setRefreshDataTable={setRefreshDataTable}
            disableRowClick
            noRowsLabel="No Client(s) found"
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


    const handleUpdateNewContactObject = (updatedObj, existingContact) => {
        !existingContact ? setNewContact(updatedObj) : setSelectedContact(updatedObj);
    };

    const handleOnChange = (selectedClient, existingContact) => {
        if (selectedClient) {
            const clientDetails = allClients.find((client) => client === selectedClient);

            handleUpdateNewContactObject({
                ...(!existingContact ? newContact : selectedContact),
                clients: [...(!existingContact ? newContact : selectedContact).clients,  {
                    id:  clientDetails.id,
                    name: clientDetails.name,
                    code: clientDetails.code,
                    newClientLink: true
                }],
            }, existingContact);
        }
    };

    const handleRemoveUnsavedClientLink = (client, existingContact) => {
        const updatedClientList = (!existingContact ? newContact : selectedContact).clients.filter(item => item !== client);

        handleUpdateNewContactObject({
            ...(!existingContact ? newContact : selectedContact),
            clients: [...updatedClientList],
        }, existingContact);
    }

    const handleUpsertContact = async (existingContact) => {
        const payload = {
            name: (!existingContact ? newContact : selectedContact).name,
            surname: (!existingContact ? newContact : selectedContact).surname,
            email: (!existingContact ? newContact : selectedContact).email,
            clientIds: (!existingContact ? newContact : selectedContact).clients.map((client) => client.id),
        }

        if (!existingContact) {
            await createContactWithClients(payload).then((response) => {
                if (response.success) {
                    setNewContact({
                        name: "",
                        surname: "",
                        email: "",
                        clients: []
                    })
                    setRefreshDataTable(true);
                    setOpenNewContactDialog(false);
                    setToastMessage(response.message);
                    setShowToast(true)
                } else {
                    setDisplayErrorAlert(true)
                    setApiResponseMessage(response.message);
                }
            });
        } else {
            await updateContact(selectedContact?.id, payload).then((response) => {
                if (response.success) {
                    handleResetContactObjects();
                    setRefreshDataTable(true);
                    setOpenDialog(false);
                    setToastMessage(response.message);
                    setShowToast(true)
                } else {
                    setDisplayErrorAlert(true)
                    setApiResponseMessage(response.message);
                }
            })
        }

    }

    const handleRenderClientEditSection = (existingContact) => {
        return (
            <div style={ existingContact ? {margin: "1rem"} : {}}>
                <Divider sx={{mt: 2, mb: 2}}/>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        onChange={(_event, value) =>
                            handleOnChange(value, existingContact)}
                        options={allClients}
                        getOptionLabel={(option) => {
                            return `${option.name}`
                        }}
                        getOptionDisabled={(option) => {
                            return !existingContact ? newContact?.clients.some((item) => item.name === option.name)
                                : selectedContact?.clients.some((item) => item.name === option.name)
                        }}
                        renderOption={(props, option) => {
                            const {key, ...optionProps} = props;
                            return (
                                <Box component="li" key={key} {...optionProps}>
                                    <div style={{
                                        fontWeight: 'bold',
                                    }}>{option.name}</div>
                                </Box>
                            )
                        }}
                        renderInput={(params) =>
                            <TextField {...params} label="Client Name" sx={{
                                width: "25rem",
                            }} size="small"
                                slotProps={{
                                   htmlInput: {
                                       ...params.inputProps,
                                  },
                                }}/>
                        }
                    />
                    {!existingContact && (
                        <Button
                            variant="text"
                            startIcon={<CloseIcon />}
                            onClick={() => {
                                setAddNewClient(false)
                            }}
                        />
                    )}
                </Stack>

                {(!existingContact ? newContact : selectedContact)?.clients.length > 0 && (
                    <Stack direction="column" spacing={2} sx={{mt: 3}}>
                        <Typography sx={{ fontSize: "12px", color: "grey" }}> Contact to be linked with: </Typography>
                        {(!existingContact ? newContact : selectedContact).clients.map((client, index) => (
                            <div key={index}>
                                <Stack direction="row" sx={{justifyContent: "space-between"}}>
                                    <Typography sx={{ fontSize: "14px", fontWeight: "bold"}} key={index}>
                                        {client.name}
                                    </Typography>
                                    {client.newClientLink && (
                                        <Button
                                            variant="text"
                                            startIcon={<CloseIcon/>}
                                            onClick={() => {
                                                handleRemoveUnsavedClientLink(client, existingContact)
                                            }}
                                        />
                                    )}
                                </Stack>
                                {index !== (!existingContact ? newContact : selectedContact)?.clients.length - 1 && (
                                    <Divider/>
                                )}
                            </div>
                        ))}
                    </Stack>
                )}
            </div>
        )
    }

    const handleResetContactObjects = () => {
        setSelectedContact(undefined);
        setNewContact({
            name: "",
            surname: "",
            email: "",
            clients: []
        });
        setAddNewClient(false);
        setEditMode(false);
        setValue('1')
    }


    return (
        <div>
            <Box sx={{ mt: "1rem", ml: "2rem", width: "100%" }}>
                <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: "grey"}}
                >
                    Contacts
                </Typography>
            </Box>
            <div style={styles.dataTableSection}>
                <CustomDataTableComponent
                    columns={contactDataTableColumns}
                    refreshDataTable={refreshDataTable}
                    setRefreshDataTable={setRefreshDataTable}
                    request={getAllContacts}
                    onRowClick={(row) => handleOnRowSelect(row.row)}
                    noRowsLabel="No Contact(s) found"
                />
            </div>

            <CustomDialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                handleCloseDialog={handleResetContactObjects}
                maxWidth="md"
                onSaveClicked={editMode ? () => handleUpsertContact(true) : undefined}
                enableSaveButton={!
                    (selectedContact?.name
                        && selectedContact?.surname
                        && selectedContact?.email
                        && selectedContact?.email.includes('@')
                        && selectedContact?.email.includes('.')
                        && !displayErrorAlert
                        && editMode)}
                showAlert={displayErrorAlert}
                alertMessage={apiResponseMessage}
                customHeader={
                    <Box sx={{
                        m: 2,
                    }}>
                        <Stack direction="row" sx={{justifyContent: "space-between"}}>
                            <Typography
                                sx={{fontWeight: "bold", fontSize: "22px"}}
                            >{`${selectedContact?.name} ${selectedContact?.surname}`}</Typography>
                            <Stack direction="row" spacing={1}>
                                <CustomChipComponent
                                    label={editMode ? "Edit" : "View"}
                                    color={editMode ? "primary" : "default"}
                                    variant={editMode ? "outlined" : "filled"}
                                />
                                {!editMode && (
                                    <IconButton onClick={() => {
                                        setEditMode(true)
                                    }} size="small">
                                        <EditIcon fontSize="small"/>
                                    </IconButton>
                                )}

                                {editMode && (
                                    <IconButton onClick={() => {
                                        setEditMode(false)
                                    }} size="small">
                                        <VisibilityOutlinedIcon fontSize="small"/>
                                    </IconButton>
                                )}
                            </Stack>
                        </Stack>
                    </Box>}
            >
                <Box sx={{ width: '100%', typography: 'body1' }}>
                    {!editMode && (
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Contact Details" value="1" sx={{ textTransform: 'none' }}/>
                                    <Tab label={`Clients (${selectedContact?.clients.length})`} value="2" sx={{ textTransform: 'none' }}/>
                                </TabList>
                            </Box>
                            <TabPanel value="1">{renderContactDetails(false)}</TabPanel>
                            <TabPanel value="2">{renderClientTable()}</TabPanel>
                        </TabContext>
                    )}
                </Box>

                {editMode && (
                    <>
                        {renderContactDetails(true)}
                        {handleRenderClientEditSection(true)}
                    </>
                )}
            </CustomDialogComponent>

            <CustomDialogComponent
                open={openNewContactDialog}
                setOpen={setOpenNewContactDialog}
                dialogTitle="New Contact"
                maxWidth="md"
                onSaveClicked={() => handleUpsertContact(false)}
                enableSaveButton={!
                    (newContact.name
                        && newContact.surname
                        && newContact.email
                        && newContact.email.includes('@')
                        && newContact.email.includes('.')
                        && !displayErrorAlert)}
                showAlert={displayErrorAlert}
                alertMessage={apiResponseMessage}
                handleCloseDialog={handleResetContactObjects}
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
                                    setDisplayErrorAlert(false);
                                    setApiResponseMessage(undefined);

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
                                Add Client (Optional)
                            </Button>
                        ) : (
                            <div>
                                {handleRenderClientEditSection(false)}
                            </div>
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

            <ToastComponent
                showToast={showToast}
                toastMessage={toastMessage}
                setShowToast={setShowToast}
            />
        </div>
    )
}

export default Contact;
