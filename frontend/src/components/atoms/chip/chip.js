import {Chip} from "@mui/material";
import PropTypes from "prop-types";

const CustomChipComponent = ({label, color, size, variant}) => {
    return (
        <Chip
            label={label}
            color={color}
            size={size}
            variant={variant}
        />
    )
}

CustomChipComponent.propTypes = {
    variant: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    label: PropTypes.string

}

export default CustomChipComponent;
