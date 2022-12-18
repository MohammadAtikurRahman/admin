import React, { useEffect, useState } from "react";
import axios from "axios";

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

import { Link } from "@material-ui/core";
import { useParams } from "react-router-dom";

export default function Profile() {
    const [persons, setPerson] = useState([]);
    const [userProfile, setUserProfile] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        axios
            .get("/enumerator/" + id)
            .then((response) => setUserProfile(response.data));
    }, []);

    function logOut() {
        localStorage.setItem("token", null);
        this.props.history.push("/");
    }

    return (
        <div className="container text-center p-5 ">
            <div>
                <h3>Beneficiary Name {userProfile.name}</h3>

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
                    color=""
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

            <div className="row  p-3">
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-text">Serial Number</span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="123454"></input>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            ID of the Beneficiary
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="123454"></input>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-text">National Id</span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="19283744454"></input>
                    </div>
                </div>
            </div>
            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Name</span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Md. Anowar Hossain"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Mother Name</span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Nazmun Nahar"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text"> Date of birth</span>
                        <input
                            type="date"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Nazmun Nahar"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Age</span>
                        <input
                            type="Number"
                            aria-label="First name"
                            className="form-control"
                            placeholder="30"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">District name </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Dhaka"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Sub-district or Thana{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="mirpur-11"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Union name</span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="avenue-5"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Ward number</span>
                        <input
                            type="number"
                            aria-label="First name"
                            className="form-control"
                            placeholder="7"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text"> Village Name </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="noepara"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Religion</span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Islam"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Occupation Name{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="business"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text"> Gender </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Male"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Primary Phone number
                        </span>
                        <input
                            type="Number"
                            aria-label="First name"
                            className="form-control"
                            placeholder="01772392237"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Name Of Program{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="cse fest"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Passbook Number{" "}
                        </span>
                        <input
                            type="numbrt"
                            aria-label="First name"
                            className="form-control"
                            placeholder="56611"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Bank Name</span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="AB Bank"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Branch name of bank{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Dhaka"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            First account created{" "}
                        </span>
                        <input
                            type="date"
                            aria-label="First name"
                            className="form-control"
                            placeholder="mirpur-11"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Bank routing number
                        </span>
                        <input
                            type="Number"
                            aria-label="First name"
                            className="form-control"
                            placeholder="335356"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            first allowance{" "}
                        </span>
                        <input
                            type="date"
                            aria-label="First name"
                            className="form-control"
                            placeholder="123"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Secondary mobile number{" "}
                        </span>
                        <input
                            type="number"
                            aria-label="First name"
                            className="form-control"
                            placeholder="01812858585"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Ownership of that mobile{" "}
                        </span>
                        <input
                            type="Number"
                            aria-label="First name"
                            className="form-control"
                            placeholder="335356"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Beneficiary status{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="active"></input>
                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            National ID status{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="active"></input>
                    </div>
                </div>
            </div>

            <div>
                <br></br>
            </div>

            <div className="row  p-3">
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Approval status{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="Accepted"></input>
                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Beneficiary username{" "}
                        </span>
                        <input
                            type="text"
                            aria-label="First name"
                            className="form-control"
                            placeholder="atikur2342"></input>
                    </div>
                </div>
            </div>
        </div>
    );
}