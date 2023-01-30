import React, { useEffect, useState } from "react";
import {
    Button,

} from "@material-ui/core";
import { Link } from "@material-ui/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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

    return (
        <div className="container text-center p-5 ">
            <div>
                <h3>Beneficiary Name {userProfile?.transaction?.type}</h3>

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
            <div>
                {userProfile?.transaction.map(t => (
                    <div key={t._id}>
                        <p>Transaction ID: {t._id}</p>
                        <p>Amount: {t.amount}</p>
                        <p>Date: {t.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
