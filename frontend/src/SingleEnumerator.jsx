import { TableRow, TableCell } from "@material-ui/core";

import { InputAdornment, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { useState } from "react";

export function SingleEnumerator(props) {
    const { row } = props;
    const [showPassword, setShowPassword] = useState(false);

    function handleClickShowPassword() {
        setShowPassword((showPassword) => !showPassword);
    }

    return (
        <TableRow key={row.name}>
            <TableCell align="center">{row.userId}</TableCell>
            <TableCell align="center" component="th" scope="row">
                {row.username}
            </TableCell>
            <TableCell align="center">
                {new Date(row.createdAt).toLocaleString("en-GB", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })}
                &nbsp; &nbsp; &nbsp; &nbsp;
                {new Date(row.createdAt).toLocaleString("en-GB", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                })}
            </TableCell>
            <TableCell align="center">
                {showPassword ? row.password : "*".repeat(row.password.length)}
                <InputAdornment position="middle">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => handleClickShowPassword()}
                        style={{ paddingBottom: "34px" }}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            </TableCell>
        </TableRow>
    );
}
