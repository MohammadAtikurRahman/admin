import React, {useEffect, useState} from "react";
import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    Button,
    Link,
    TextField,
} from "@material-ui/core"

import DownloadIcon from '@mui/icons-material/Download';
import Pagination from "@material-ui/lab/Pagination";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const baseUrl = process.env.REACT_APP_URL;
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

export default function PingDashboard() {
    const [transactions, setTransactions] = useState([]);

    const navigate = useNavigate();
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const [searchingKeyword, setSearchingKeyword] = useState(null);

    async function fetchPings() {
        if (!fromDate || !toDate) return;
        const response = await axios.get(baseUrl + `/pings/${fromDate}/${toDate}/limit/20/page/${page}`);
        setTransactions(response.data?.transactions);
        setTotalPages(response.data?.totalPages)
        setPage(response.data?.page)
    }
    useEffect(() => {
        let d = new Date();
        d = d.toISOString().substring(0, 10);
        console.log("d = ", d);
        setFromDate(d);
        setToDate(d);
        return () => {}
    }, [])

    async function handlePageChange(event, value) {
        setPage(value);
    }
    useEffect(() => {
        console.log("inside search, searchingKeyword = ", searchingKeyword);
        if (searchingKeyword) {
            console.log("inside searchPings")
            searchPings();
        }
        else {
            console.log("inside fetchPings")
            fetchPings();
        }
    }, [searchingKeyword, fromDate, toDate, limit, page])

    async function searchPings() {
        if (!searchingKeyword) {
            return;
        }
        const response = await axios.get(baseUrl + `/pings/fromDate/${fromDate}/toDate/${toDate}/search/${searchingKeyword}/limit/${limit}/page/${page}`);
        setTransactions(response.data?.transactions);
        setPage(response.data?.page);
        setTotalPages(response.data?.totalPages);
    }


    function logOut() {
        localStorage.setItem("token", null);
        navigate("/");
    }

    function capitalizeFirstLetter(string) {
        if (!string) return "";
        return string
            .toLowerCase()
            .split(" ")
            .map(function (word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
    }

    const classes = useStyles();

    return (
        <div className="container text-center p-2 ">
            <div className="mb-2">
                <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                >
                    <Link
                        style={{textDecoration: "none", color: "white"}}
                        href="/dashboard"
                    >
                        List Of Beneficiary
                    </Link>
                </Button>

                <Button
                    className="button_style"
                    variant="contained"
                    color="secondary"
                    size="small"
                >
                    <Link
                        style={{textDecoration: "none", color: "white"}}
                        href="/enumerator"
                    >
                        List Of Enumerator
                    </Link>
                </Button>

                <Button
                    className="button_style"
                    variant="contained"
                    color="inherit"
                    size="small"
                >
                    <Link style={{textDecoration: "none", color: "black"}} href="/test">
                        List Of Test
                    </Link>
                </Button>

                <Button
                    className="button_style"
                    variant="contained"
                    size="small"
                    onClick={logOut}
                >
                    Log Out
                </Button>
            </div>

            <div style={{display: "flex", justifyContent: "center", marginBottom: "20px"}}>
                <TextField
                    id="from-date"
                    label="From Date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    style={{marginRight: "10px"}}
                />
                <TextField
                    id="to-date"
                    label="To Date"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <div className="search-container">
                    <TextField
                        id="standard-basic"
                        type="search"
                        autoComplete="off"
                        name="search"
                        value={searchingKeyword}
                        onChange={(event) => setSearchingKeyword(event.target.value)}
                        placeholder="Search Transactions"
                        required
                        style={{border: "1px solid grey", padding: "1px", marginTop: "12px", marginLeft: "20px"}}
                        InputProps={{
                            disableUnderline: true,
                            style: {paddingRight: "5px", paddingLeft: "50px"},
                        }}
                    />
                </div>
                <a
                    href={`${baseUrl}/beneficiaries/download`}
                    download="beneficiaries.csv"
                    style={{textDecoration: 'none'}}>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<DownloadIcon />}
                        style={{marginLeft: '10px', marginTop: '10px'}}
                    >
                        Download CSV
                    </Button>
                </a>

            </div>
            <TableContainer
                component={Paper}
                style={{width: "100%", marginBottom: "20px"}}
            >
                <Table
                    className={classes.table}
                    aria-label="transaction table"
                    style={{minWidth: "650px"}}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Beneficiary Id</TableCell>
                            <TableCell align="center">Beneficiary Mobile</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="center">Thrift Usages</TableCell>
                            <TableCell align="center">Trxid</TableCell>
                            <TableCell align="center">Payment Type</TableCell>
                            <TableCell align="center">Bkash Usages</TableCell>
                            <TableCell align="center">Nagad Usages</TableCell>
                            <TableCell align="center">M-Banking</TableCell>
                            <TableCell align="center">SMS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions && transactions.map((t) => (
                            <TableRow key={t._id}>
                                <TableCell align="center">{t.beneficiaryId}</TableCell>
                                <TableCell align="center">{t.beneficiaryMobile}</TableCell>
                                <TableCell align="center">{(new Date(t.createdAt)).toLocaleString()}</TableCell>
                                <TableCell align="center">{t.duration} Minutes</TableCell>
                                <TableCell align="center">{t.trxid}</TableCell>
                                <TableCell align="center">{t.sub_type}</TableCell>
                                <TableCell align="center">{t.duration_bkash}</TableCell>
                                <TableCell align="center">{t.duration_nagad}</TableCell>
                                <TableCell align="center">
                                    {capitalizeFirstLetter(t.sender)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />
        </div>
    );
}
