import React, { Component } from "react";
import {
    Button,
    TextField,
    TableBody,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    AppBar,
    Toolbar,
} from "@material-ui/core";
import DownloadIcon from '@mui/icons-material/Download';
import { Pagination } from "@material-ui/lab";
import swal from "sweetalert";

import { Link as MaterialLink } from "@material-ui/core";
import { Link } from "react-router-dom";
import BeneficiaryDelete from "./BeneficiaryDelete";
import { EditBeneficiary } from "./EditBeneficiary";
import { AddBeneficiary } from "./AddBeneficiary";
import axios from "axios";

const baseUrl = process.env.REACT_APP_URL;

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            token: "",
            openProductModal: false,
            openProductEditModal: false,
            id: "",
            name: "",
            f_nm: "",
            ben_nid: "",
            sl: "",
            ben_id: "",
            m_nm: "",
            age: "",
            dis: "",
            sub_dis: "",
            uni: "",
            vill: "",
            relgn: "",
            job: "",
            gen: "",
            mob: "",
            pgm: "",
            pass: "",
            bank: "",
            branch: "",
            r_out: "",
            mob_1: "",
            mob_own: "",
            ben_sts: "",
            nid_sts: "",
            a_sts: "",
            u_nm: "",
            dob: "",
            accre: "",
            f_allow: "",
            score1: "",
            score2: "",
            desc: "",
            price: "",
            discount: "",
            file: "",
            fileName: "",
            page: 1,
            search: "",
            beneficiaries: [],
            persons: [],
            pages: 0,
            loading: false,
            anchorEl: null,
            selectedItem: null,
            beneficiary: {},
            error: "",
            filteredBeneficiary: [],
            currentBeneficiary: "",
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSearchBeneficiary = this.onSearchBeneficiary.bind(this);
        this.pageChange = this.pageChange.bind(this);
    }

    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleClose() {
        this.setState({ anchorEl: null });
    }

    handleSelect(item) {
        this.setState({ selectedItem: item });
        this.handleClose();
    }

    componentDidMount = () => {
        let token = localStorage.getItem("token");
        if (!token) {
            this.props.history.push("/login");
        } else {
            this.setState({ token: token }, () => {
                this.getBeneficiaries();
            });
        }

        axios.get(baseUrl + "/user-details").then((res) => {
            const persons = res.data;
            this.setState({ persons });
        });
    };

    getBeneficiaries = () => {
        this.setState({ loading: true });
        axios
            .get(baseUrl + "/beneficiary", {
                headers: {
                    token: this.state.token,
                },
                params: {
                    page: this.state.page,
                },
            })
            .then((res) => {
                this.setState({
                    loading: false,
                    beneficiaries: res.data.beneficiaries,
                    filteredBeneficiary: res.data.beneficiaries,
                    page: res.data.page,
                    pages: res.data.totalPages,
                });
            })
            .catch((err) => {
                console.log("error = ", err)
                // swal({
                //     text: err,
                //     icon: "error",
                //     type: "error",
                // });
                // this.setState(
                //     { loading: false, beneficiaries: [], userinfo: [] },
                //     () => { }
                // );
            });
    };

    logOut = () => {
        localStorage.setItem("token", null);
        this.props.history.push("/");
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => { });
    };

    async onSearchBeneficiary() {
        const response = await axios.get(baseUrl + `/beneficiary/search/${this.state.search}`, {
            params: {
                page: this.state.page,
            },
        });
        this.setState({ filteredBeneficiary: response.data.beneficiaries });
    }

    handleProductOpen = () => {
        this.setState({
            openProductModal: true,
            id: "",
            name: "",
            desc: "",
            price: "",
            discount: "",
            fileName: "",
        });
    };

    handleCsv = () => {
        this.setState({
            openProductModal: true,
            id: "",
            name: "",
            desc: "",
            price: "",
            discount: "",
            fileName: "",
        });
    };

    handleProductClose = () => {
        this.setState({ openProductModal: false });
    };

    handleProductEditOpen = (row) => {
        this.setState({
            openProductEditModal: true,
            currentBeneficiary: row,
        });
    };

    handleProductEditClose = () => {
        this.setState({ openProductEditModal: false });
    };

    pageChange(event, value) {
        this.setState({ page: value }, () => {
            this.getBeneficiaries();
        });
    }

    render() {
        return (
            <div>
                <div>
                    <AppBar
                        position="static"
                        style={{ backgroundColor: "#1F8A7", height: "32px" }}
                    >
                        <Toolbar>
                            <h5 style={{ paddingTop: "10px" }}></h5>
                            <h6
                                style={{
                                    fontFamily: "Arial",
                                    fontWeight: "bold",
                                    paddingBottom: "20px",
                                }}
                            >
                                <b> ADMIN PANEL NDC </b>
                            </h6>
                            &nbsp; &nbsp;
                        </Toolbar>
                    </AppBar>
                    <br />
                    <h2>Dashboard</h2>
                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.handleProductOpen}
                    >
                        Add Beneficiary
                    </Button>
                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"
                    >
                        <MaterialLink
                            style={{ textDecoration: "none", color: "white" }}
                            href="/enumerator"
                        >
                            List Of Enumerator
                        </MaterialLink>
                    </Button>
                    <Button
                        className="button_style"
                        variant="contained"
                        color="inherit"
                        size="small"
                    >
                        <MaterialLink
                            style={{ textDecoration: "none", color: "black" }}
                            href="/test"
                        >
                            List Of Test
                        </MaterialLink>
                    </Button>
                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"
                    >
                        <MaterialLink
                            style={{ textDecoration: "none", color: "white" }}
                            href="/notest"
                        >
                            Disagree of test
                        </MaterialLink>
                    </Button>
                    <Button
                        className="button_style"
                        variant="contained"
                        size="small"
                        onClick={this.logOut}
                    >
                        <MaterialLink
                            style={{
                                textDecoration: "none",
                                color: "black",
                            }}
                            href="/"
                        >
                            logout
                        </MaterialLink>
                    </Button>
                </div>
                <br />
                <TableContainer>
                    <div className="search-container">
                        <TextField
                            id="standard-basic"
                            type="search"
                            autoComplete="off"
                            name="search"
                            value={this.state.search}
                            onChange={this.onChange}
                            placeholder="Search by Beneficiary"
                            required
                            style={{ border: "1px solid grey", padding: "1px" }}
                            InputProps={{
                                disableUnderline: true,
                                style: { paddingRight: "5px", paddingLeft: "50px" },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.onSearchBeneficiary}
                            style={{ marginLeft: '10px' }}
                        >
                            Search
                        </Button>
                        <a
                            href={`${baseUrl}/beneficiaries/download`}
                            download="beneficiaries.csv"
                            style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<DownloadIcon />}
                                style={{ marginLeft: '10px' }}
                            >
                                Download CSV
                            </Button>
                        </a>
                    </div>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">
                                    <b> Beneficiary Created Time </b>
                                </TableCell>
                                <TableCell align="center">
                                    <b> Beneficiary Name </b>
                                </TableCell>
                                <TableCell align="center">
                                    <b> Beneficiary Id </b>
                                </TableCell>
                                <TableCell align="center">
                                    <b> Test Score </b>
                                </TableCell>
                                <TableCell align="center">
                                    <b> Action </b>
                                </TableCell>
                                <TableCell align="center">
                                    <b> Details </b>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state?.filteredBeneficiary
                                ?.reverse()
                                .filter((row) => row.test_status !== "পরীক্ষা দিতে অসম্মত")
                                .map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">
                                            {new Date(row.updatedAt).toLocaleString("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                            })}
                                            &nbsp; &nbsp; &nbsp; &nbsp;
                                            {new Date(row.updatedAt).toLocaleString("en-GB", {
                                                month: "2-digit",
                                                day: "2-digit",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell align="center">{row.name}</TableCell>
                                        <TableCell align="center" component="th" scope="row">
                                            {row.beneficiaryId}
                                        </TableCell>
                                        <TableCell align="center">{row.score1}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                className="button_style"
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={() => this.handleProductEditOpen(row)}
                                            >
                                                Edit
                                            </Button>
                                            <BeneficiaryDelete row={row} />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                className="button_style"
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                            >
                                                <Link
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "white",
                                                    }}
                                                    to={`/profile/${row._id}`}
                                                    state={row}
                                                >
                                                    Beneficiary Details
                                                </Link>
                                            </Button>
                                            &nbsp;
                                            <Button
                                                className="button_style"
                                                variant="contained"
                                                color="inherit"
                                                size="small"
                                            >
                                                <Link
                                                    style={{
                                                        textDecoration: "none",
                                                        color: "black",
                                                    }}
                                                    to={`/transaction/${row.beneficiaryId}`}
                                                >
                                                    Transactions Details
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Pagination
                            count={this.state.pages}
                            page={this.state.page}
                            onChange={this.pageChange}
                            color="primary"
                        />
                    </div>
                </TableContainer>
                {this.state.openProductEditModal && (
                    <EditBeneficiary
                        beneficiary={this.state.currentBeneficiary}
                        isEditModalOpen={this.state.openProductEditModal}
                        handleEditModalClose={this.handleProductEditClose}
                        getBeneficiaries={this.getBeneficiaries}
                    />
                )}
                {this.state.openProductModal && (
                    <AddBeneficiary
                        isEditModalOpen={this.state.openProductModal}
                        handleEditModalClose={this.handleProductClose}
                        getBeneficiaries={this.getBeneficiaries}
                    />
                )}
            </div>
        );
    }
}
