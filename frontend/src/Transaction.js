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


    const totalCashIn = userProfile?.transaction.reduce((acc, t) => {
        return t.type === 'in' ? acc + t.amount : acc;
    }, 0);

    const totalCashOut = userProfile?.transaction.reduce((acc, t) => {
        return t.type === 'out' ? acc + t.amount : acc;
    }, 0);


    const totalMinutes = userProfile?.transaction.reduce((acc, t) => {
        return t.type != isNaN ? acc + t.duration : acc;
    }, 0);





    return (
        <div className="container text-center p-5 ">
            <div>
                <h3>Beneficiary Name: {userProfile?.name}</h3>
                <h3>Beneficiary Id: {userProfile?.beneficiaryId}</h3>
                <h3>Beneficiary mobile: {userProfile?.mob}</h3>


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

            {/* <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="transaction table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Beneficiary ID</TableCell>
                            <TableCell align="center">Cash In</TableCell>
                            <TableCell align="center">Cash Out</TableCell>
                            <TableCell align="center">Amount</TableCell>
                            <TableCell align="center">Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userProfile?.transaction.map(t => (
                            <TableRow key={t._id}>
                                <TableCell component="th" scope="row"
                                    align="center"
                                >
                                    {t.beneficiaryId}
                                </TableCell>
                                <TableCell align="center" style={{ color: 'green', fontWeight: 'bold' }}>
                                    {t.type === 'in' ? t.amount : ''}
                                </TableCell>

                                <TableCell align="center" style={{ color: 'red', fontWeight: 'bold' }}  >
                                    {t.type === 'out' ? t.amount : ''}
                                </TableCell>
                                <TableCell align="center">{t.amount}</TableCell>
                                <TableCell align="center">


                                    {new Date(t.date).toLocaleString("en-US", {
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                    })}
                                    &nbsp; &nbsp; &nbsp; &nbsp;
                                    {new Date(t.date).toLocaleString("en-GB", {
                                        month: "2-digit",
                                        day: "2-digit",
                                        year: "numeric",
                                    })}






                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer> */}

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="transaction table">
                    <TableHead>
                        <TableRow>
                            {/* <TableCell align="center">Beneficiary ID</TableCell> */}
                            <TableCell align="center">Cash In</TableCell>
                            <TableCell align="center">Cash Out</TableCell>
                            {/* <TableCell align="center">Amount</TableCell> */}
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Usages</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            userProfile.transaction = userProfile.transaction.filter(t => t.date)
                                .sort((a, b) => {
                                    const dateA = new Date(a.date);
                                    const dateB = new Date(b.date);
                                    return dateB - dateA;
                                })



                                .map(t => (
                                    <TableRow key={t._id}>
                                        {/* <TableCell component="th" scope="row" align="center">
                                    {t.beneficiaryId}
                                </TableCell> */}
                                        <TableCell align="center" style={{ color: 'green', fontWeight: 'bold' }}>
                                            {t.type === 'in' ? t.amount : ''}
                                        </TableCell>
                                        <TableCell align="center" style={{ color: 'red', fontWeight: 'bold' }}>
                                            {t.type === 'out' ? t.amount : ''}
                                        </TableCell>
                                        {/* <TableCell align="center">{t.amount}</TableCell> */}
                                        <TableCell align="center">



{/* 

                                            {new Date(t.date).toLocaleString('en-US', {
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true,
                                            })}{' '}


                                            &nbsp; &nbsp; &nbsp; &nbsp;


                                            {new Date(t.date).toLocaleString('en-GB', {
                                                month: '2-digit',
                                                day: '2-digit',
                                                year: 'numeric',
                                            })} */}

                                            {t.date}
                                        </TableCell>
                                        <TableCell align="center">
                                            {t.duration} Minutes

                                        </TableCell>
                                    </TableRow>
                                ))}
                        <TableRow>
                            <TableCell align="center" style={{ color: 'green', fontWeight: 'bold' }}>
                                Total Cash In: {totalCashIn}
                            </TableCell>
                            <TableCell align="center" style={{ color: 'red', fontWeight: 'bold' }}>
                                Total Cash Out: {totalCashOut}

                            </TableCell>
                            <TableCell align="center" style={{ color: 'purple', fontWeight: 'bold' }}>
                            </TableCell>

                            <TableCell align="center" style={{ color: 'purple', fontWeight: 'bold' }}>
                                Total minute: {totalMinutes}
                            </TableCell>
                        </TableRow>

                        

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
