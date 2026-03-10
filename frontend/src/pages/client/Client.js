import React, {useEffect, useState} from 'react';
import {getAllClients, deleteClientContact, createClientsWithContacts, updateClient} from '../../api/clientsApi';
import {getAllContacts} from '../../api/contactApi';
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
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import ToastComponent from "../../components/atoms/toast/toastComponent";
import CustomChipComponent from "../../components/atoms/chip/chip";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

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
    const [displayErrorAlert, setDisplayErrorAlert] = useState(false);
    const [apiResponseMessage, setApiResponseMessage] = useState();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState();
    const [editMode, setEditMode] = useState(false);

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
            alignItems: "left",
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
                    params.value.length : 'No Contact(s) found'
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

    const renderClientDetails = (editMode) => {
        return (
            <Box
                sx={{
                    m: 2,
                }}
            >
                <Stack direction="row" sx={{mt: 2}} spacing={13}>
                    <Stack direction="column">
                        {!editMode ? (
                            <>
                                <Typography sx={styles.detailsLabel}>
                                    Client Name:
                                </Typography>
                                <Typography sx={styles.detailsText}>
                                    {selectedClient?.name}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <div>
                                    <Typography
                                        sx={{
                                            fontSize: "12px",
                                            color: "grey",
                                        }}
                                    >
                                        Client Name:
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
                                            setApiResponseMessage(undefined);
                                            setDisplayErrorAlert(false);

                                            handleUpdateNewContactObject({
                                                ...selectedClient,
                                                name: event.target.value,
                                            }, editMode);
                                        }}
                                        value={selectedClient?.name}
                                    />
                                </div>
                            </>
                        )}

                    </Stack>
                    <Stack direction="column">
                        <Typography sx={styles.detailsLabel}>
                            Client Code:
                        </Typography>
                        <Typography sx={styles.detailsText}>
                            {selectedClient?.code}
                        </Typography>
                    </Stack>
                    {!editMode && (
                        <Stack direction="column">
                            <Typography sx={styles.detailsLabel}>
                                No.of Linked Contacts:
                            </Typography>
                            <Typography sx={styles.detailsText}>
                                {selectedClient?.contacts.length > 0 ? selectedClient?.contacts.length : "No Contact(s) found"}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </Box>
        )
    }

    const handleDelete = async (row) => {
        try {
            await deleteClientContact(selectedClient?.id, row?.id);

            setSelectedClient((prev) => {
                return {
                    ...prev,
                    contacts: prev?.contacts.filter((x) => x.id !== row.id) || []
                };
            });

            setShowToast(true);
            setToastMessage(`${row.name} ${row.surname} has been removed from linked contacts.`)
            setRefreshDataTable(true);

        } catch (error) {
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
                    action: (row) => {
                        handleDelete(row)
                    },
                    icon: <DeleteOutlinedIcon color='error'/>
                }
            ]}
            noRowsLabel="No Contact(s) found"
        />
    )

    const actions = [
        {
            key: "addClient",
            icon: <NoteAddOutlinedIcon/>,
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


    const handleUpdateNewContactObject = (updatedObj, existingClient) => {
        !existingClient ? setNewClientObj(updatedObj) : setSelectedClient(updatedObj);
    };

    const handleOnChange = (selectedContact, existingClient) => {
        if (selectedContact) {
            const contactDetails = allContacts.find((contact) => contact === selectedContact);

            handleUpdateNewContactObject({
                ...(!existingClient ? newClientObj : selectedClient),
                contacts: [...(!existingClient ? newClientObj : selectedClient).contacts, {
                    id: contactDetails.id,
                    name: contactDetails.name,
                    surname: contactDetails.surname,
                    email: contactDetails.email,
                    newContactLink: true
                }],
            }, existingClient);
        }
    };

    const handleRemoveUnsavedContactLink = (contact, existingClient) => {
        const updatedContactList = (!existingClient ? newClientObj : selectedClient).contacts.filter(item => item !== contact);

        handleUpdateNewContactObject({
            ...(!existingClient ? newClientObj : selectedClient),
            contacts: [...updatedContactList],
        }, existingClient);
    }

    const handleUpsertClient = async (existingClient) => {
        const payload = {
            name: (!existingClient ? newClientObj : selectedClient).name,
            contactIds: (!existingClient ? newClientObj : selectedClient).contacts.map((contact) => contact.id),
        }

        if (!existingClient) {
            await createClientsWithContacts(payload).then((response) => {
                if (response.success) {
                    setNewClientObj({
                        name: "",
                        contacts: []
                    });
                    setRefreshDataTable(true);
                    setOpenNewClientDialog(false);
                    setToastMessage(response.message);
                    setShowToast(true)
                } else {
                    setDisplayErrorAlert(true)
                    setApiResponseMessage(response.message);
                }
            });
        } else {
            await updateClient(selectedClient?.id, payload).then((response) => {
                if (response.success) {
                    handleResetClientObjects();
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

    const handleRenderContactsEditSection = (existingClient) => {
        return (
            <div style={ existingClient ? {margin: "1rem"} : {}}>
                <Divider sx={{mt: 2, mb: 2}}/>
                <Stack direction="row" sx={{justifyContent: "space-between"}}>
                    <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        onChange={(_event, value) =>
                            handleOnChange(value, existingClient)}
                        getOptionLabel={(option) => {
                            return `${option.name} ${option.surname}`
                        }}
                        options={allContacts}
                        renderOption={(props, option) => {
                            const {key, ...optionProps} = props;
                            return (
                                <Box component="li" key={key} {...optionProps}>
                                    <Stack direction='column' spacing={1}>
                                        <div style={{
                                            fontWeight: 'bold',
                                        }}>{option.name} {option.surname}</div>
                                        <div style={{
                                            color: "grey",
                                            fontSize: "12px",
                                        }}>{option.email}</div>
                                    </Stack>
                                </Box>
                            )
                        }}
                        getOptionDisabled={(option) => {
                            return !existingClient ? newClientObj?.contacts.some((item) => item.email === option.email)
                                : selectedClient?.contacts.some((item) => item.email === option.email)
                        }}
                        renderInput={(params) =>
                            <TextField {...params} label="Contact Name" sx={{
                                width: "25rem",
                            }} size="small"
                                       slotProps={{
                                           htmlInput: {
                                               ...params.inputProps,
                                           },
                                       }}/>
                        }
                    />
                    {!existingClient && (
                        <Button
                            variant="text"
                            startIcon={<CloseIcon/>}
                            onClick={() => {
                                setAddNewClient(false)
                            }}
                        />
                    )}
                </Stack>

                {(!existingClient ? newClientObj : selectedClient)?.contacts.length > 0 && (
                    <Stack direction="column" spacing={2} sx={{mt: 3}}>
                        <Typography sx={{fontSize: "12px", color: "grey"}}> Client to be linked
                            with: </Typography>
                        {(!existingClient ? newClientObj : selectedClient).contacts.map((contact, index) => (
                            <div key={index}>
                                <Stack direction="row" sx={{justifyContent: "space-between"}}>
                                    <div>
                                        <Typography sx={{fontSize: "14px"}} key={index}>
                                            <div style={{
                                                fontWeight: 'bold',
                                            }}>{contact.name} {contact.surname}</div>
                                            <div style={{
                                                color: "grey",
                                                fontSize: "12px",
                                            }}>{contact.email}</div>
                                        </Typography>
                                    </div>
                                    {contact.newContactLink && (
                                        <Button
                                            variant="text"
                                            startIcon={<CloseIcon/>}
                                            onClick={() => {
                                                handleRemoveUnsavedContactLink(contact, existingClient)
                                            }}
                                        />
                                    )}
                                </Stack>
                                {index !== (!existingClient ? newClientObj : selectedClient)?.contacts.length - 1 && (
                                    <Divider/>
                                )}
                            </div>
                        ))}
                    </Stack>
                )}
            </div>
        )
    }

    const handleResetClientObjects = () => {
        setSelectedClient(undefined);
        setNewClientObj({
            name: "",
            contacts: []
        });
        setAddNewClient(false);
        setEditMode(false);
        setValue('1')
    }

    return (
        <div>
            <Box sx={{mt: "1rem", ml: "2rem", width: "100%"}}>
                <Typography
                    variant="h4"
                    sx={{fontWeight: "bold", color: "grey"}}
                >
                    Clients
                </Typography>
            </Box>
            <div style={styles.dataTableSection}>
                <CustomDataTableComponent
                    columns={clientDataTableColumns}
                    refreshDataTable={refreshDataTable}
                    setRefreshDataTable={setRefreshDataTable}
                    request={getAllClients}
                    onRowClick={(row) => handleOnRowSelect(row.row)}
                    noRowsLabel="No Client(s) found"
                />
            </div>

            <CustomDialogComponent
                open={openDialog}
                setOpen={setOpenDialog}
                handleCloseDialog={handleResetClientObjects}
                onSaveClicked={editMode ? () => handleUpsertClient(true) : undefined}
                enableSaveButton={!(selectedClient?.name && !displayErrorAlert && editMode)}
                showAlert={displayErrorAlert}
                alertMessage={apiResponseMessage}
                maxWidth="md"
                customHeader={
                    <Box sx={{
                        m: 2,
                    }}>
                        <Stack direction="row" sx={{justifyContent: "space-between"}}>
                            <Typography
                                sx={{fontWeight: "bold", fontSize: "22px"}}
                            >{selectedClient?.name}</Typography>
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
                <Box sx={{width: '100%', typography: 'body1'}}>
                    {!editMode && (
                        <TabContext value={value}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <TabList onChange={handleChange} aria-label="lab API tabs example">
                                    <Tab label="Client Details" value="1" sx={{textTransform: 'none'}}/>
                                    <Tab label={`Contacts (${selectedClient?.contacts.length})`} value="2"
                                         sx={{textTransform: 'none'}}/>
                                </TabList>
                            </Box>
                            <TabPanel value="1">{renderClientDetails(false)}</TabPanel>
                            <TabPanel value="2">{renderContactsTable()}</TabPanel>
                        </TabContext>
                    )}

                    {editMode && (
                        <>
                            {renderClientDetails(true)}
                            {handleRenderContactsEditSection(true)}
                        </>
                    )}
                </Box>
            </CustomDialogComponent>

            <CustomDialogComponent
                open={openNewClientDialog}
                setOpen={setOpenNewClientDialog}
                dialogTitle="New Client"
                maxWidth="md"
                onSaveClicked={() => handleUpsertClient(false)}
                enableSaveButton={!(newClientObj.name && !displayErrorAlert)}
                showAlert={displayErrorAlert}
                alertMessage={apiResponseMessage}
                handleCloseDialog={handleResetClientObjects}
            >
                <Box sx={{typography: 'body1', m: "2rem"}}>
                    <Stack direction="column" spacing={2}>
                        <div>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    color: "grey",
                                }}
                            >
                                Client Name:
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
                                    setApiResponseMessage(undefined);
                                    setDisplayErrorAlert(false);

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
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    setAddNewClient(true)
                                }}
                            >
                                Add Contact (Optional)
                            </Button>
                        ) : (
                            <div>
                                {handleRenderContactsEditSection(false)}
                            </div>
                        )}
                    </Stack>
                </Box>
            </CustomDialogComponent>

            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{position: "absolute", bottom: 16, right: 16}}
                icon={<SpeedDialIcon/>}
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

export default Client;
