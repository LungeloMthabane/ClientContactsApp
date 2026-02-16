import React, { useState, useEffect } from "react";
import {
    DataGrid
} from "@mui/x-data-grid";
import PropTypes from 'prop-types';
import { Box, IconButton, Stack } from "@mui/material";

const CustomDataTableComponent = ({ columns, refreshDataTable, setRefreshDataTable, request, onRowClick, tableData, disableRowClick, actions, noRowsLabel }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (request) {
            request().then((response) => {
                setData(response);
            })
        } else {
            setData(tableData);
        }

        setRefreshDataTable?.(false)
    }, [request, refreshDataTable, tableData]);

    const actionColumn =
        actions && actions.length > 0
            ? {
                field: "actions",
                headerName: "",
                width: 150,
                sortable: false,
                filterable: false,
                align: "right",
                headerAlign: "right",
                renderCell: (params) => (
                    <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        {actions?.map((actionItem, index) => (
                            <IconButton
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    actionItem.action(params.row);
                                }}
                                size="small"
                            >
                                {actionItem.icon}
                            </IconButton>
                        ))}
                    </Stack>
                ),
            }
            : undefined;

    return (
        <Box>
            <DataGrid
                rows={data}
                columns={
                    actions && actions.length > 0
                        ? columns.concat(actionColumn)
                    : columns
                }
                pageSizeOptions={[10, 20, 50]}
                sx={{
                    border: 0,
                    mx: 2,
                    "& .MuiDataGrid-row:hover": {
                        cursor: disableRowClick ? "not-allowed" : "pointer",
                    },
                }}
                onRowClick={ onRowClick}
                loading={refreshDataTable}
                disableRowSelectionOnClick={disableRowClick}
                disableMultipleRowSelection
                localeText={{
                    noRowsLabel: noRowsLabel
                }}
            />
        </Box>
    )
}

/**
 *
 * @type {{columns: PropTypes.Validator<NonNullable<any[]>>}},
 * @type {{refreshDataTable: PropTypes.Validator<NonNullable<(...args: any[]) => any>>}},
 * @type {{setRefreshDataTable: PropTypes.Validator<NonNullable<(...args: any[]) => any>>}}
 * @type {{request: PropTypes.Validator<NonNullable<(...args: any[]) => any>>}}
 * @type {{onRowClick: PropTypes.Validator<NonNullable<(...args: any[]) => any>>}}
 */
CustomDataTableComponent.propTypes = {
    columns: PropTypes.array.isRequired,
    refreshDataTable: PropTypes.bool,
    setRefreshDataTable: PropTypes.func,
    request: PropTypes.func,
    onRowClick: PropTypes.func,
    tableData: PropTypes.array,
    disableRowClick: PropTypes.bool,
    actions: PropTypes.array,
    noRowsLabel: PropTypes.string
}


export default CustomDataTableComponent;
