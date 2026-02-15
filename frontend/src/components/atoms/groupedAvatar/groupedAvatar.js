import React from "react";
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import PropTypes from 'prop-types';
import { Box } from "@mui/material";

const CustomGroupedAvatar = ({ groupedItems }) => {
    return (
       <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
           <AvatarGroup max={1}  total={groupedItems.length}>
               {groupedItems.map((item, index) => (
                   <Avatar key={index} alt={item.name}>
                       {`${item.name.substring(0, 1)}${item.surname.substring(0, 1)}`}
                   </Avatar>
               ))}
           </AvatarGroup>
       </Box>
    )
}

/**
 *
 * @type {{groupedItems: PropTypes.Validator<NonNullable<any[]>>}}
 */
CustomGroupedAvatar.propTypes = {
    groupedItems: PropTypes.array.isRequired,
}

export default CustomGroupedAvatar;
