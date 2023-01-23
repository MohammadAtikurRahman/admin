import { useState } from "react";
import swal from "sweetalert";
import { Button, TextField, Link } from "@material-ui/core";
import { useNavigate } from "react-router-dom";


const axios = require("axios");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

const baseUrl = process.env.REACT_APP_URL;

export default function Login(props) {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();

    const onChange = (event) => {
        event.persist();
        setUser((user) => {
            return {
                ...user,
                [event.target.name]: event.target.value,
            };
        });
    };
    const login = () => {
        axios
            .post( baseUrl + '/login', {
                username: user.username,
                password: user.password,
            })

            .then((res) => {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user_id", res.data.id);
                if (res.status === 200) navigate("/dashboard");
                swal({
                    text: "Successfully login",
                    icon: "success",
                    type: "success",
                    timer: 1000
                  });
            })
            .catch((err) => {
                swal({
                    text: "Wrong Username or Password",
                    icon: "error",
                    type: "error",
                });
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.errorMessage
                ) {
                    swal({
                        text: err.response.data.errorMessage,
                        icon: "error",
                        type: "error",
                    });
                }
            });
    };

    return (
        <div style={{ marginTop: "200px" }}>
            <div>
                <h2>Login</h2>
            </div>

            <div>
                <TextField
                    id="standard-basic"
                    type="text"
                    autoComplete="off"
                    name="username"
                    value={user.username}
                    onChange={onChange}
                    placeholder="User Name"
                    required
                />
                <br />
                <br />
                <TextField
                    id="standard-basic"
                    type="password"
                    autoComplete="off"
                    name="password"
                    value={user.password}
                    onChange={onChange}
                    placeholder="Password"
                    required
                />
                <br />
                <br />
                <Button
                    className="button_style"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={user.username == "" && user.password == ""}
                    onClick={login}>
                    Login
                </Button>{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Link href="/register">Register</Link>
            </div>
        </div>
    );
}

