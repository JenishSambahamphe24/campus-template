import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// function DateInputField({ name, value, label, variant, onChange, format }) {
//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <DateField
//                 size='small'
//                 label={label}
//                 fullWidth
//                 variant={variant}
//                 name={name}
//                 value={value ? dayjs(value, format) : null} 
//                 onChange={(newValue) => {
//                     const formattedValue = newValue ? newValue.format(format || "YYYY/MM/DD") : "";
//                     onChange(formattedValue);
//                 }}
//                 format={format || "YYYY/MM/DD"}
//                 sx={{
//                     '& .MuiInputBase-root-MuiInput-root': {
//                         fontSize: '12px'
//                     },
//                     '& .MuiFormLabel-root.Mui-error': {
//                         color: 'inherit',
//                     },
//                     '& .MuiInputBase-root.Mui-error:before': {
//                         borderColor: 'black',
//                     },
//                     '& .MuiInputBase-root.Mui-error:after': {
//                         borderColor: 'black',
//                     },
//                 }}
//             />
//         </LocalizationProvider>
//     );
// }
function DateInputField({ name, value, label, variant, onChange, format }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateField
                size='small'
                label={label}
                fullWidth
                variant={variant}
                name={name}
                value={value ? dayjs(value, format) : null}
                onChange={(newValue) => {
                    // Return null instead of empty string when no date is selected
                    const formattedValue = newValue ? newValue.format(format || "YYYY/MM/DD") : null;
                    onChange(formattedValue);
                }}
                format={format || "YYYY/MM/DD"}
                sx={{
                    '& .MuiInputBase-root-MuiInput-root': {
                        fontSize: '12px'
                    },
                    '& .MuiFormLabel-root.Mui-error': {
                        color: 'inherit',
                    },
                    '& .MuiInputBase-root.Mui-error:before': {
                        borderColor: 'black',
                    },
                    '& .MuiInputBase-root.Mui-error:after': {
                        borderColor: 'black',
                    },
                }}
            />
        </LocalizationProvider>
    );
}

export default DateInputField;
