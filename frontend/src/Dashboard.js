import React, { Component } from "react";
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
        };
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

        axios.get(`http://172.104.191.159:2000/user-details`).then((res) => {
            const persons = res.data;
            this.setState({ persons });
            const userDetails = this.state.persons.payload;

            var enumerator_name = userDetails.user;

            var enumerator_id = userDetails.id;
            // console.log(enumerator_name); urgent
            // console.log(enumerator_id);

            // const propertyNames = Object.keys(userDetails);

            // console.log(propertyNames);
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
            .get(`http://172.104.191.159:2000/beneficiary`, {
                message: "hello",
                headers: {
                    token: this.state.token,
                },
            })
            .then((res) => {
                console.log("here", res.data.beneficiaries);
                this.setState({
                    loading: false,
                    beneficiaries: res.data.beneficiaries,
                    pages: res.data?.pages,
                });
            })
            .catch((err) => {
                swal({
                    text: err,
                    icon: "error",
                    type: "error",
                });
                this.setState(
                    { loading: false, beneficiaries: [], pages: 0 },
                    () => { }
                );
            });
    };

    deleteProduct = (id) => {
        axios
            .post(
                "http://172.104.191.159:2000/delete-product",
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
            });
        }
    };

    addProduct = () => {
        const fileInput = document.querySelector("#fileInput");
        axios
            .post("http://172.104.191.159:2000/beneficiary/add", {
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
        file.append("desc", this.state.desc);
        file.append("discount", this.state.discount);
        file.append("price", this.state.price);

        axios
            .post("http://172.104.191.159:2000/update-product", file, {
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
                    { name: "", desc: "", discount: "", price: "", file: null },
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
            desc: data.desc,
            price: data.price,
            discount: data.discount,
            fileName: data.image,
        });
    };

    handleProductEditClose = () => {
        this.setState({ openProductEditModal: false });
    };

    render() {
        return (
            <div>
                <div>
                    {this.state.persons.payload ? (
                        <p>
                            Enumerator Dashboard{" "}
                            {this.state.persons.payload.user}{" "}
                        </p>
                    ) : (
                        ""
                    )}

                    {/* <h3> {this.enumerator_name}</h3> */}

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
                    <DialogTitle id="alert-dialog-title">
                        Edit Beneficiary
                    </DialogTitle>
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
                        <br />
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="desc"
                            value={this.state.desc}
                            onChange={this.onChange}
                            placeholder="Beneficiary Father"
                            required
                        />
                        <br />
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="price"
                            value={this.state.price}
                            onChange={this.onChange}
                            placeholder="Beneficiary ben_nid"
                            required
                        />
                        <br />
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="discount"
                            value={this.state.discount}
                            onChange={this.onChange}
                            placeholder="Beneficiary Id"
                            required
                        />
                        <br />
                        <br />
                        <Button variant="contained" component="label">
                            {" "}
                            Upload
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                name="file"
                                value={this.state.file}
                                onChange={this.onChange}
                                placeholder="File"
                                hidden
                            />
                        </Button>
                        &nbsp;
                        {this.state.fileName}
                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={this.handleProductEditClose}
                            color="primary">
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
                    <DialogTitle id="alert-dialog-title">
                        Add Beneficiary
                    </DialogTitle>
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
                        &nbsp;
                        &nbsp;



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
                        &nbsp;
                        &nbsp;
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
                        &nbsp;
                        &nbsp;
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
                        &nbsp;
                        &nbsp;


                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="ben_id"
                            value={this.state.ben_id}
                            onChange={this.onChange}
                            placeholder="BeneFiciary id"


                        />

                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="age"
                            value={this.state.age}
                            onChange={this.onChange}
                            placeholder="BeneFiciary age"


                        />




                        &nbsp;
                        &nbsp;

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


                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="sub_dis"
                            value={this.state.sub_dis}
                            onChange={this.onChange}
                            placeholder="BeneFiciary thana"

                        />
                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="uni"
                            value={this.state.uni}
                            onChange={this.onChange}
                            placeholder="BeneFiciary union"

                        />

                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="vill"
                            value={this.state.vill}
                            onChange={this.onChange}
                            placeholder="BeneFiciary village"

                        />
                        &nbsp;
                        &nbsp;

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

                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="job"
                            value={this.state.job}
                            onChange={this.onChange}
                            placeholder="BeneFiciary job"

                        />

                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="gen"
                            value={this.state.gen}
                            onChange={this.onChange}
                            placeholder="BeneFiciary gen"

                        />
                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="mob"
                            value={this.state.mob}
                            onChange={this.onChange}
                            placeholder="BeneFiciary mobile"

                        />

                        &nbsp;
                        &nbsp;

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




                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="pass"
                            value={this.state.pass}
                            onChange={this.onChange}
                            placeholder="BeneFiciary passbook"

                        />




                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="bank"
                            value={this.state.bank}
                            onChange={this.onChange}
                            placeholder="BeneFiciary bank"

                        />
                        &nbsp;
                        &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="branch"
                            value={this.state.branch}
                            onChange={this.onChange}
                            placeholder="BeneFiciary branch name"

                        />

                        &nbsp;
                        &nbsp;
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



                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="mob_1"
                            value={this.state.mob_1}
                            onChange={this.onChange}
                            placeholder="2nd mobile no"

                        />


                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="mob_own"
                            value={this.state.mob_own}
                            onChange={this.onChange}
                            placeholder="owner of the mobile"

                        />

                        &nbsp;
                        &nbsp;

                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="ben_sts"
                            value={this.state.ben_sts}
                            onChange={this.onChange}
                            placeholder="beneficiary sts"

                        />
                        &nbsp;
                        &nbsp;
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
                        &nbsp;
                        &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="a_sts"
                            value={this.state.a_sts}
                            onChange={this.onChange}
                            placeholder="Approval Status "

                        />
                        &nbsp;
                        &nbsp;
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="u_nm"
                            value={this.state.u_nm}
                            onChange={this.onChange}
                            placeholder="username  "

                        />


                        &nbsp;
                        &nbsp;
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


&nbsp;
                        &nbsp;
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


&nbsp;
                        &nbsp;
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
                        <Button
                            onClick={this.handleProductClose}
                            color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={
                                this.state.name == "" ||
                                this.state.f_nm == "" ||
                                this.state.ben_nid == "" ||
                                this.state.sl == "" ||
                                this.state.ben_id == "" ||
                                this.state.m_nm == "" ||
                                this.state.age == "" ||
                                this.state.dis == "" ||
                                this.state.sub_dis == "" ||
                                this.state.uni == "" ||
                                this.state.vill == "" ||
                                this.state.relgn == "" ||
                                this.state.job == "" ||
                                this.state.gen == "" ||
                                this.state.mob == ""






                            }
                            onClick={(e) => this.addProduct()}
                            color="primary"
                            autoFocus>
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
                                    Beneficiary Name
                                </TableCell>
                                <TableCell align="center">
                                    Beneficiary Father
                                </TableCell>
                                <TableCell align="center">
                                    Beneficiary ben_nid
                                </TableCell>
                                <TableCell align="center">Test Score</TableCell>
                                <TableCell align="center">Action</TableCell>
                                <TableCell align="center">
                                    View BeneFiciary{" "}
                                </TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {this.state?.beneficiaries?.map((row) => (
                                <TableRow key={row.name}>

                                    <TableCell align="center">
                                        {row.name}
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        component="th"
                                        scope="row">
                                        {row.f_nm}
                                    </TableCell>

                                    <TableCell align="center">
                                        {row.ben_nid}
                                    </TableCell>

                                    <TableCell align="center">
                                        {row.created_at}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            className="button_style"
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={(e) =>
                                                this.handleProductEditOpen(
                                                    row
                                                )
                                            }>
                                            Edit
                                        </Button>
                                        <Button
                                            className="button_style"
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                            onClick={(e) =>
                                                this.deleteProduct(row._id)
                                            }>
                                            Delete
                                        </Button>
                                    </TableCell>

                                    <TableCell align="center" >
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
