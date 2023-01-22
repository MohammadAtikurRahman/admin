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

                {/* Add Beneficiary */}
                <Dialog
                    open={this.state.openProductModal}
                    onClose={this.handleProductClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="xl">
                    <DialogContent style={{ padding: "90px" }}>
                        <DialogTitle id="alert-dialog-title" >Add Beneficiary</DialogTitle>
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="name"
                            value={this.state.name}
                            onChange={this.onChange}
                            placeholder="Beneficiary Name"
                            required
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="u_nm"
                            value={this.state.u_nm}
                            onChange={this.onChange}
                            placeholder="Beneficiary's Husband/Wife names  "
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="f_nm"
                            value={this.state.f_nm}
                            onChange={this.onChange}
                            placeholder="Beneficiary Father"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="m_nm"
                            value={this.state.m_nm}
                            onChange={this.onChange}
                            placeholder="Beneficiary Mother"
                        />
                        <br />
                        <br />
                   
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="dis"
                            value={this.state.dis}
                            onChange={this.onChange}
                            placeholder="Beneficiary District"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="sub_dis"
                            value={this.state.sub_dis}
                            onChange={this.onChange}
                            placeholder="Beneficiary Thana"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="uni"
                            value={this.state.uni}
                            onChange={this.onChange}
                            placeholder="Benefciary Union"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="sl"
                            value={this.state.sl}
                            onChange={this.onChange}
                            placeholder="Beneficiary Ward No"
                        />
                        <br />
                        <br />
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="vill"
                            value={this.state.vill}
                            onChange={this.onChange}
                            placeholder="Beneficiary Village"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="bank"
                            value={this.state.bank}
                            onChange={this.onChange}
                            placeholder="Beneficiary Bank"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="job"
                            value={this.state.job}
                            onChange={this.onChange}
                            placeholder="Beneficiary Job"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="ben_nid"
                            value={this.state.ben_nid}
                            onChange={this.onChange}
                            placeholder="Beneficiary NID"
                            required
                        />
                        <br />
                        <br />
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="mob"
                            value={this.state.mob}
                            onChange={this.onChange}
                            placeholder="Beneficiary Mobile"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="r_out"
                            value={this.state.r_out}
                            onChange={this.onChange}
                            placeholder="Beneficiary Rout"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="mob_own"
                            value={this.state.mob_own}
                            onChange={this.onChange}
                            placeholder="Beneficiary Mobile Owner"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="branch"
                            value={this.state.branch}
                            onChange={this.onChange}
                            placeholder="Beneficiary Bank Branch "
                        />
                        <br />
                        <br />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <select
                            id="standard-basic"
                            name="gen"
                            value={this.state.gen}
                            onChange={this.onChange}
                            style={{
                                border: "none",
                                padding: "8px",
                                color: "grey",
                                background: "white",
                            }}>
                            <option value="" disabled>
                                Select Gender
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <select
                            id="standard-basic"
                            name="a_sts"
                            value={this.state.a_sts}
                            onChange={this.onChange}
                            style={{
                                border: "none",
                                padding: "8px",
                                color: "grey",
                                background: "white",
                            }}>
                            <option value="" disabled>
                                Approval Status
                            </option>
                            <option value="Approved">Approved</option>
                            <option value="Not Approved">Not Approvved</option>
                        </select>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <select
                            id="standard-basic"
                            name="age"
                            value={this.state.age}
                            onChange={this.onChange}
                            style={{
                                border: "none",
                                padding: "8px",
                                color: "grey",
                                background: "white",
                            }}>
                            <option value="" disabled>
                                Beneficiary Age
                            </option>
                            <option value="40">40</option>
                            <option value="41">41</option>
                            <option value="42">42</option>
                            <option value="43">43</option>
                            <option value="44">44</option>
                            <option value="45">45</option>
                            <option value="46">46</option>
                            <option value="47">47</option>
                            <option value="48">48</option>
                            <option value="49">49</option>
                            <option value="50">50</option>
                            <option value="51">51</option>
                            <option value="52">52</option>
                            <option value="53">53</option>
                            <option value="54">54</option>
                            <option value="55">55</option>
                            <option value="56">56</option>
                            <option value="57">57</option>
                            <option value="58">58</option>
                            <option value="59">59</option>
                            <option value="60">60</option>
                        </select>
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <select
                            id="standard-basic"
                            name="relgn"
                            value={this.state.relgn}
                            onChange={this.onChange}
                            style={{
                                border: "none",
                                padding: "8px",
                                color: "grey",
                                background: "white",
                            }}>
                            <option value="" disabled>
                                Beneficiary Religion
                            </option>
                            <option value="Islam">Islam</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Other">Other</option>
                        </select>
                
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                   
                        <br />
                        <br />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="date"
                            label="Date of Birth"
                            autoComplete="off"
                            name="dob"
                            value={this.state.dob}
                            onChange={this.onChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                style: { color: "grey" },
                            }}
                            placeholder="date of birth  "
                            format="dd/mm/yyyy"
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="date"
                            autoComplete="off"
                            label="Account Created"
                            name="accre"
                            value={this.state.accre}
                            onChange={this.onChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                style: { color: "grey" },
                            }}
                            placeholder="Account created "
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="date-picker-dialog"
                            type="date"
                            autoComplete="off"
                            label="First Allowance"
                            format="dd/MM/yyyy"
                            name="f_allow"
                            value={this.state.f_allow}
                            onChange={this.onChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                style: { color: "grey" },
                            }}
                            placeholder=" f_allow   "
                        />
                        &nbsp;
                    </DialogContent>

                    <DialogActions style={{ paddingRight: "80px", paddingBottom: "50px"}}>
                        <Button
                        
                        style={{ backgroundColor: '#FF0063', color: 'white' }}

                        onClick={this.handleProductClose} color="primary">
                            Cancel
                        </Button>
                        <Button 
                        
                        style={{ backgroundColor: '#3D1766', color: 'white' }}

                        onClick={(e) => this.addProduct()} color="primary" autoFocus>
                            Add Beneficiary
                        </Button>
                    </DialogActions>
                </Dialog>

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
            </div>
        );
    }
}
