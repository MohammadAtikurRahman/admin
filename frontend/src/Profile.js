import React, { useEffect, useState } from "react";
import {
    Button,
  
} from "@material-ui/core";
import { Link } from "@material-ui/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
export default function Profile() {
    const [persons, setPerson] = useState([]);
    const location = useLocation();
    const userProfile = location.state;
    console.log(userProfile);
    const navigate = useNavigate();

    function logOut() {
        localStorage.setItem("token", null);
        navigate("/");
    }

    return (
        <div className="container text-center p-5 ">
            <div>
                <h3>Beneficiary Name {userProfile?.name}</h3>

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
                        <span className="input-group-text">Approverd status</span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}>{userProfile?.a_sts} </label>
                    </div>
                </div>
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Beneficiary Nid
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.ben_nid}</label>

                    </div>
                </div>
                <div className="col">
                    <div className="input-group">
                        <span className="input-group-text">Beneficiary Id</span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.beneficiaryId}</label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.name}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">Father Name</span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.f_nm}</label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text"> Mother Name</span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.m_nm}</label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.age}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">District name </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.dis}</label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Sub-district or Thana{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.sub_dis}</label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.uni}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text"> village</span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.vill}</label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text"> date of birth </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}>


                            {/* {new Date(userProfile?.dob).toLocaleString("en-GB", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                })} */}
                            &nbsp; &nbsp; &nbsp; &nbsp;
                            {new Date(userProfile?.dob).toLocaleString("en-GB", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                            })}





                        </label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.relgn}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Occupation Name{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.job}</label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text"> Gender </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.gen}</label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.mob}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Ward No{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.sl}</label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Passbook Number{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.pass}</label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.bank}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            Branch name of bank{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.branch}</label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            First account created{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}>



                            &nbsp; &nbsp; &nbsp; &nbsp;
                            {new Date(userProfile?.accre).toLocaleString("en-GB", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                            })}


                        </label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.r_out}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            first allowance{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> 
                        
                        
                        &nbsp; &nbsp; &nbsp; &nbsp;
                            {new Date(userProfile?.f_allow).toLocaleString("en-GB", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                            })}
                        
                        </label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Secondary mobile number{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.mob_1}</label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.mob_own}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            Beneficiary status{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.ben_sts}</label>

                    </div>
                </div>

                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                            National ID status{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.nid_sts}</label>

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
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.a_sts}</label>

                    </div>
                </div>
                <div className="col-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            {" "}
                             Beneficiary's Husband/Wife names{" "}
                        </span>
                        <label style={{ paddingTop: "10px", paddingLeft: "10px" }}> {userProfile?.u_nm}</label>

                    </div>
                </div>
            </div>
        </div>
    );
}
