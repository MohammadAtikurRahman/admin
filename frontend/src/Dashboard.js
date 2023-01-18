import React, { Component } from "react";
import jwt_decode from "jwt-decode";

import moment from 'moment';
import DatePicker from "react-datepicker";

import { KeyboardDatePicker } from "@material-ui/pickers";


import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    LinearProgress,
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
            userinfo: [],
            persons: [],
            pages: 0,
            loading: false,

            anchorEl: null,
            selectedItem: null,
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

        this._isMounted = true;

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
            const userDetails = this.state.persons.payload;

            var enumerator_name = userDetails.user;

            var enumerator_id = userDetails.id;

        });
    };

  

    getBeneficiaries = () => {
        this.setState({ loading: true });

        let data = "?";
        data = `${data}page=${this.state.page}`;
        if (this.state.search) {
            data = `${data}&search=${this.state.search}`;
        }
        axios
            .get(baseUrl + "/beneficiary", {
                message: "hello",
                headers: {
                    token: this.state.token,
                },
            })
            .then((res) => {
                console.log("here", Object.values(jwt_decode(res.config.headers.token)));
                console.log("here", res.data.beneficiaries);

                this.setState({
                    loading: false,
                    beneficiaries: res.data.beneficiaries,
                    pages: res.data?.pages,
                    userinfo: Object.values(jwt_decode(res.config.headers.token)),
                });
            })
            .catch((err) => {
                swal({
                    text: err,
                    icon: "error",
                    type: "error",
                });
                this.setState(
                    { loading: false, beneficiaries: [], userinfo: [], pages: 0 },
                    () => { }
                );
            });
    };

    deleteProduct = (id) => {
        axios
            .post(
                baseUrl + "/delete-product",
                {
                    id: id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        token: this.state.token,
                    },
                }
            )
            .then((res) => {
                swal({
                    text: res.data.title,
                    icon: "success",
                    type: "success",
                });

                this.setState({ page: 1 }, () => {
                    this.pageChange(null, 1);
                });
            })
            .catch((err) => {
                swal({
                    text: err.response.data.errorMessage,
                    icon: "error",
                    type: "error",
                });
            });
    };

    pageChange = (e, page) => {
        this.setState({ page: page }, () => {
            this.getBeneficiaries();
        });
    };

    logOut = () => {
        localStorage.setItem("token", null);
        this.props.history.push("/");
    };

    onChange = (e) => {
        if (e.target.files && e.target.files[0] && e.target.files[0].name) {
            this.setState({ fileName: e.target.files[0].name }, () => { });
        }
        this.setState({ [e.target.name]: e.target.value }, () => { });

        if (e.target.name == "search") {
            this.setState({ page: 1 }, () => {
                this.getBeneficiaries();
                console.log(e.target.name);
            });
        }
    };

    addProduct = () => {
        const fileInput = document.querySelector("#fileInput");
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
                        file: null,
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

    updateProduct = () => {
        const fileInput = document.querySelector("#fileInput");
        const file = new FormData();
        file.append("id", this.state.id);
        file.append("file", fileInput.files[0]);
        file.append("name", this.state.name);

        file.append("sl", this.state.sl);
        file.append("f_nm", this.state.f_nm);
        file.append("ben_id", this.state.ben_id);
        file.append("ben_nid", this.state.ben_nid);

        file.append("m_nm", this.state.m_nm);

        file.append("age", this.state.age);

        file.append("dis", this.state.dis);
        file.append("sub_dis", this.state.sub_dis);
        file.append("uni", this.state.uni);
        file.append("vill", this.state.vill);
        file.append("relgn", this.state.relgn);

        file.append("job", this.state.job);
        file.append("gen", this.state.gen);
        file.append("mob", this.state.mob);

        file.append("pgm", this.state.pgm);
        file.append("pass", this.state.pass);
        file.append("bank", this.state.bank);
        file.append("branch", this.state.branch);

        file.append("r_out", this.state.r_out);
        file.append("mob_1", this.state.mob_1);
        file.append("mob_own", this.state.mob_own);
        file.append("ben_sts", this.state.ben_sts);

        file.append("nid_sts", this.state.nid_sts);
        file.append("a_sts", this.state.a_sts);

        file.append("u_nm", this.state.u_nm);
        file.append("dob", this.state.dob);
        file.append("accre", this.state.accre);
        file.append("f_allow", this.state.f_allow);

        axios
            .post(baseUrl + "/update-product", file, {
                headers: {
                    "content-type": "multipart/form-data",
                    token: this.state.token,
                },
            })
            .then((res) => {
                swal({
                    text: res.data.title,
                    icon: "success",
                    type: "success",
                });

                this.handleProductEditClose();
                this.setState(
                    {
                        name: "",
                        bank: "",

                        u_nm: "",
                        dob: "",
                        accre: "",
                        f_allow: "",

                        a_sts: "",
                        nid_sts: "",
                        ben_sts: "",
                        mob_own: "",
                        mob_1: "",
                        r_out: "",
                        branch: "",
                        gen: "",
                        pass: "",
                        mob: "",
                        pgm: "",
                        age: "",
                        ben_id: "",
                        job: "",
                        m_nm: "",
                        ben_nid: "",
                        sl: "",
                        f_nm: "",
                        dis: "",
                        sub_dis: "",
                        vill: "",
                        uni: "",
                        relgn: "",
                        file: null,
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
                this.handleProductEditClose();
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

    handleProductEditOpen = (data) => {
        this.setState({
            openProductEditModal: true,
            id: data._id,
            name: data.name,
            sl: data.sl,
            f_nm: data.f_nm,
            age: data.age,

            ben_id: data.ben_id,
            ben_nid: data.ben_nid,
            m_nm: data.m_nm,
            dis: data.dis,
            uni: data.uni,
            sub_dis: data.sub_dis,
            vill: data.vill,
            relgn: data.relgn,
            job: data.job,
            gen: data.gen,
            mob: data.mob,
            pgm: data.pgm,
            pass: data.pass,
            bank: data.bank,
            branch: data.branch,
            r_out: data.r_out,
            mob_1: data.mob_1,
            mob_own: data.mob_own,
            ben_sts: data.ben_sts,
            nid_sts: data.nid_sts,
            a_sts: data.a_sts,

            u_nm: data.u_nm,
            dob: data.dob,
            accre: data.accre,
            f_allow: data.f_allow,

            fileName: data.image,
        });
    };

    handleProductEditClose = () => {
        this.setState({ openProductEditModal: false });
    };

    render() {
        const open = Boolean(this.state.anchorEl);

        return (
            <div>
                <div>
                    {/* 
                    <ol>
                        {this.state.userinfo.map(user => (
                            <ul key={user}>{user}</ul>
                        ))}
                    </ol> */}

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

                {/* Edit Product */}
                <Dialog
                    open={this.state.openProductEditModal}
                    onClose={this.handleProductClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">Edit Beneficiary</DialogTitle>

                    <DialogContent>
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
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="sl"
                            value={this.state.sl}
                            onChange={this.onChange}
                            placeholder="Serail"
                            required
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="ben_nid"
                            value={this.state.ben_nid}
                            onChange={this.onChange}
                            placeholder="Beneficiary ben_nid"
                            required
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="f_nm"
                            value={this.state.f_nm}
                            onChange={this.onChange}
                            placeholder="BeneFiciary Father"
                        />
                        <br />
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="m_nm"
                            value={this.state.m_nm}
                            onChange={this.onChange}
                            placeholder="BeneFiciary mother"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="ben_id"
                            value={this.state.ben_id}
                            onChange={this.onChange}
                            placeholder="BeneFiciary id"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="age"
                            value={this.state.age}
                            onChange={this.onChange}
                            placeholder="BeneFiciary age"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="dis"
                            value={this.state.dis}
                            onChange={this.onChange}
                            placeholder="BeneFiciary district"
                        />
                        <br />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="sub_dis"
                            value={this.state.sub_dis}
                            onChange={this.onChange}
                            placeholder="BeneFiciary thana"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="uni"
                            value={this.state.uni}
                            onChange={this.onChange}
                            placeholder="BeneFiciary union"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="vill"
                            value={this.state.vill}
                            onChange={this.onChange}
                            placeholder="BeneFiciary village"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="relgn"
                            value={this.state.relgn}
                            onChange={this.onChange}
                            placeholder="BeneFiciary relgn"
                        />
                        <br />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="job"
                            value={this.state.job}
                            onChange={this.onChange}
                            placeholder="BeneFiciary job"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="gen"
                            value={this.state.gen}
                            onChange={this.onChange}
                            placeholder="BeneFiciary gen"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="mob"
                            value={this.state.mob}
                            onChange={this.onChange}
                            placeholder="BeneFiciary mobile"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="pgm"
                            value={this.state.pgm}
                            onChange={this.onChange}
                            placeholder="BeneFiciary pgm"
                        />
                        <br />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="pass"
                            value={this.state.pass}
                            onChange={this.onChange}
                            placeholder="BeneFiciary passbook"
                        />



                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="bank"
                            value={this.state.bank}
                            onChange={this.onChange}
                            placeholder="BeneFiciary bank"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="branch"
                            value={this.state.branch}
                            onChange={this.onChange}
                            placeholder="BeneFiciary branch name"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="r_out"
                            value={this.state.r_out}
                            onChange={this.onChange}
                            placeholder="BeneFiciary rout"
                        />
                        <br />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="mob_1"
                            value={this.state.mob_1}
                            onChange={this.onChange}
                            placeholder="2nd mobile no"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="mob_own"
                            value={this.state.mob_own}
                            onChange={this.onChange}
                            placeholder="owner of the mobile"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="ben_sts"
                            value={this.state.ben_sts}
                            onChange={this.onChange}
                            placeholder="beneficiary sts"
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="nid_sts"
                            value={this.state.nid_sts}
                            onChange={this.onChange}
                            placeholder="nid sts"
                        />
                        <br />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="a_sts"
                            value={this.state.a_sts}
                            onChange={this.onChange}
                            placeholder="Approval Status "
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="date"
                            label="date of birth"
                            autoComplete="off"
                            name="dob"
                            value={this.state.dob}
                            onChange={this.onChange}
                            placeholder="date of birth  "
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="date"
                            autoComplete="off"
                            label="account created"
                            name="accre"
                            value={this.state.accre}
                            onChange={this.onChange}
                            placeholder="account created "
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="date"
                            autoComplete="off"
                            label="first allow"
                            name="f_allow"
                            value={this.state.f_allow}
                            onChange={this.onChange}
                            placeholder=" f_allow   "
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <br />
                        &nbsp;
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleProductEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                this.state.name == "" ||
                                this.state.desc == "" ||
                                this.state.discount == "" ||
                                this.state.price == ""
                            }
                            onClick={(e) => this.updateProduct()}
                            color="primary"
                            autoFocus>
                            Edit Beneficiary
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Product */}
                <Dialog
                    open={this.state.openProductModal}
                    onClose={this.handleProductClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    maxWidth="xl">
                    <DialogContent style={{ padding: "90px" }}>
                        <DialogTitle id="alert-dialog-title">Add Beneficiary</DialogTitle>
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
                            placeholder="Beneficiary Username  "
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
                        {/* <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="age"
                            value={this.state.age}
                            onChange={this.onChange}
                            placeholder="BeneFiciary Age"
                        /> */}
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
                            name="pgm"
                            value={this.state.pgm}
                            onChange={this.onChange}
                            placeholder="Beneficiary Program"
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
                                border: "none", padding: "8px", color: "grey",
                                background: "white"
                            }}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        &nbsp;
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;


                        <select
                            id="standard-basic"
                            name="a_sts"
                            value={this.state.a_sts}
                            onChange={this.onChange}
                            style={{
                                border: "none", padding: "8px", color: "grey",
                                background: "white"
                            }}
                        >
                            <option value="" disabled>Approval Status</option>
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
                                border: "none", padding: "8px", color: "grey",
                                background: "white"
                            }}
                        >
                            <option value="" disabled>Beneficiary Age</option>
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
                            name="age"
                            value={this.state.relgn}
                            onChange={this.onChange}
                            style={{
                                border: "none", padding: "8px", color: "grey",
                                background: "white"
                            }}
                        >
                            <option value="" disabled>Beneficiary Religion</option>
                            <option value="Islam">Islam</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Other">Other</option>

                        </select>
                        {/* <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="ben_nid"
                            value={this.state.ben_nid}
                            onChange={this.onChange}
                            placeholder="Beneficiary NID"
                            required
                        /> */}
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        {/* <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="a_sts"
                            value={this.state.a_sts}
                            onChange={this.onChange}
                            placeholder="Approval Status "
                        /> */}
                        <br />
                        <br />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        <TextField
                            id="standard-basic"
                            type="date"
                            label="Date of Birth"
                            autoComplete="off"
                            name="dob"



                            value={moment(this.state.dob).format('DD/MM/YYYY')}
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
                            id="date-picker-dialog" type="date"
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
                        <br />
                        &nbsp;
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleProductClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={(e) => this.addProduct()} color="primary" autoFocus>
                            Add Beneficiary
                        </Button>
                    </DialogActions>
                </Dialog>

                <br />

                <TableContainer>
                    <TextField
                        id="standard-basic"
                        type="search"
                        autoComplete="off"
                        name="search"
                        value={this.state.search}
                        onChange={this.onChange}
                        placeholder="Search by Beneficiary"
                        required
                    />

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
                                    {" "}
                                    <b> Test Score </b>{" "}
                                </TableCell>
                                <TableCell align="center">
                                    {" "}
                                    <b> Action </b>
                                </TableCell>
                                <TableCell align="center">
                                    <b> View BeneFiciary </b>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {this.state?.beneficiaries?.reverse().map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell align="center">
                                        {new Date(row.updatedAt).toLocaleString("en-US", {
                                            hour: "numeric",
                                            minute: "numeric",
                                            hour12: true,
                                        })}
                                        &nbsp;                                        &nbsp;
                                        &nbsp;
                                        &nbsp;

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
                                            onClick={(e) => this.handleProductEditOpen(row)}>
                                            Edit
                                        </Button>
                                        <Button
                                            className="button_style"
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={(e) => this.deleteProduct(row._id)}>
                                            Delete
                                        </Button>
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
            </div>
        );
    }
}
