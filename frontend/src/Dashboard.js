import React, { Component } from "react";
import jwt_decode from "jwt-decode";
import SearchIcon from "@material-ui/icons/Search";

import moment from "moment";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    TableBody,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import swal from "sweetalert";

import { Link as MaterialLink } from "@material-ui/core";
import { Link } from "react-router-dom";
import BeneficiaryDelete, { beneficiarydelete } from "./BeneficiaryDelete";
import { searchBeneficiary } from "./utils/search";
import { EditBeneficiary } from "./EditBeneficiary";
import { AddBeneficiary } from "./AddBeneficiary";

const axios = require("axios");
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
            })
            .then((res) => {
                this.setState({
                    loading: false,
                    beneficiaries: res.data.beneficiaries,
                    filteredBeneficiary: res.data.beneficiaries,
                });
            })
            .catch((err) => {
                swal({
                    text: err,
                    icon: "error",
                    type: "error",
                });
                this.setState({ loading: false, beneficiaries: [], userinfo: [] }, () => {});
            });
    };
    logOut = () => {
        localStorage.setItem("token", null);
        this.props.history.push("/");
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => {});

        if (e.target.name === "search") {
            const needle = e.target.value;
            this.setState({
                filteredBeneficiary: searchBeneficiary(this.state.beneficiaries, needle),
            });
        }
    };

    addProduct = () => {
        axios
            .post(baseUrl + "/beneficiary/add", {
                beneficiary: {
                    name: this.state.name,
                    f_nm: this.state.f_nm,
                    ben_nid: this.state.ben_nid,
                    sl: this.state.sl,
                    ben_id: this.state.ben_id,
                    m_nm: this.state.m_nm,
                    age: this.state.age,
                    dis: this.state.dis,
                    sub_dis: this.state.sub_dis,
                    uni: this.state.uni,
                    vill: this.state.vill,
                    relgn: this.state.relgn,
                    job: this.state.job,
                    gen: this.state.gen,
                    mob: this.state.mob,

                    pgm: this.state.pgm,
                    pass: this.state.pass,
                    bank: this.state.bank,

                    branch: this.state.branch,
                    r_out: this.state.r_out,
                    mob_1: this.state.mob_1,
                    mob_own: this.state.mob_own,
                    ben_sts: this.state.ben_sts,
                    nid_sts: this.state.nid_sts,
                    a_sts: this.state.a_sts,
                    u_nm: this.state.u_nm,
                    dob: this.state.dob,
                    accre: this.state.accre,
                    f_allow: this.state.f_allow,
                    score1: this.state.score1,
                },
                token: localStorage.getItem("token"),
            })
            .then((res) => {
                window.location.reload();
                swal({
                    text: res.data.title,
                    icon: "success",
                    type: "success",
                });

                this.handleProductClose();
                this.setState(
                    {
                        name: "",
                        desc: "",
                        discount: "",
                        price: "",
                        file: "",
                        page: 1,
                    },
                    () => {
                        this.getBeneficiaries();
                    }
                );
            })
            .catch((err) => {
                swal({
                    text: err.response.data.errorMessage,
                    icon: "error",
                    type: "error",
                });
                this.handleProductClose();
            });
    };

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

    render() {
        return (
            <div>
                <div>
                    <br></br>
                    <h2>Dashboard</h2>

                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.handleProductOpen}>
                        Add Beneficiary
                    </Button>

                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small">
                        <MaterialLink
                            style={{ textDecoration: "none", color: "white" }}
                            href="/enumerator">
                            List Of Enumerator
                        </MaterialLink>
                    </Button>

                    <Button
                        className="button_style"
                        variant="contained"
                        color="inherit"
                        size="small">
                        <MaterialLink
                            style={{ textDecoration: "none", color: "black" }}
                            href="/test">
                            List Of Test
                        </MaterialLink>
                    </Button>

                    <Button
                        className="button_style"
                        variant="contained"
                        color="inherit"
                        size="small">
                        <MaterialLink
                            style={{ textDecoration: "none", color: "black" }}
                            href="/test">
                            Transactions
                        </MaterialLink>
                    </Button>

                    <Button
                        className="button_style"
                        variant="contained"
                        size="small"
                        onClick={this.logOut}>
                        <MaterialLink
                            style={{
                                textDecoration: "none",
                                color: "black",
                            }}
                            href="/">
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
                                    <b> View BeneFiciary </b>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {this.state?.filteredBeneficiary?.reverse().map((row, index) => (
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
                                            onClick={() => this.handleProductEditOpen(row)}>
                                            Edit
                                        </Button>

                                        <BeneficiaryDelete row={row} />
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            className="button_style"
                                            variant="contained"
                                            color="primary"
                                            size="small">
                                            {/* <MaterialLink
                                                style={{
                                                    textDecoration: "none",
                                                    color: "white",
                                                }}
                                                href="/profile">
                                                BeneFiciary Details
                                            </MaterialLink> */}
                                            <Link
                                                style={{
                                                    textDecoration: "none",
                                                    color: "white",
                                                }}
                                                to={`/profile/${row._id}`}
                                                state={row}>
                                                BeneFiciary Details
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <br />
                    <Pagination
                        count={this.state.pages}
                        page={this.state.page}
                        onChange={this.pageChange}
                        color="primary"
                    />
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
