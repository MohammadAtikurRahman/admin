import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
    Button,

} from "@material-ui/core";
import { Link } from "@material-ui/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
export default function Transaction() {
    const [persons, setPerson] = useState([]);
    const location = useLocation();
    const userProfile = location.state;
    console.log("transaction details", userProfile);
    const navigate = useNavigate();

    function logOut() {
        localStorage.setItem("token", null);
        navigate("/");
    }
    const classes = useStyles();

    return (
        <div className="container text-center p-5 ">
            <div>
                <h3>Beneficiary Name: {userProfile?.name}</h3>
                <h3>Beneficiary Id: {userProfile?.beneficiaryId}</h3>

                <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small">
                    <Link
                        style={{ textDecoration: "none", color: "white" }}
                        href="/dashboard">
                        List Of BeneFiciary
                    </Link>
                </Button>

                <Button
                    className="button_style"
                    variant="contained"
                    color="secondary"
                    size="small">
                    <Link
                        style={{ textDecoration: "none", color: "white" }}
                        href="/enumerator">
                        List Of Enumerator
                    </Link>
                </Button>

                <Button
                    className="button_style"
                    variant="contained"
                    color="inherit"
                    size="small">
                    <Link
                        style={{ textDecoration: "none", color: "black" }}
                        href="/test">
                        List Of Test
                    </Link>
                </Button>

                <Button
                    className="button_style"
                    variant="contained"
                    size="small"
                    onClick={logOut}>
                    Log Out
                </Button>
            </div>
        
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="transaction table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Beneficiary ID</TableCell>
                            <TableCell align="right">Cash In/ Cash Out</TableCell>

                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userProfile?.transaction.map(t => (
                            <TableRow key={t._id}>
                                <TableCell component="th" scope="row">
                                    {t.beneficiaryId}
                                </TableCell>
                                <TableCell align="right">{t.type}</TableCell>

                                <TableCell align="right">{t.amount}</TableCell>
                                <TableCell align="right">{t.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
