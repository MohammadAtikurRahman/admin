import React, { Component } from 'react';
import Swal from 'sweetalert2';


import { Button, TextField, Link } from '@material-ui/core';
const axios = require('axios');
const baseUrl = process.env.REACT_APP_URL;

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirm_password: ''
    };
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  register = (event) => {


    if (this.state.password !== this.state.confirm_password) {
      Swal.fire({
        text: "Passwords do not match",
        icon: "error",
        type: "error",
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    event.preventDefault();
    if (isNaN(this.state.username)) {
      axios.post(baseUrl + '/register', {
        username: this.state.username,
        password: this.state.password,
      }).then((res) => {

        Swal.fire({
          text: res.data.title,
          icon: "success",
          type: "success",
          showConfirmButton: false,
          timer: 2000
        });
        this.props.history.push('/');
      }).catch((err) => {
        Swal.fire({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
    else {
      Swal.fire({
        icon: "error",
        type: "error",
        text: "wrong entry or textfeild empty",
        showConfirmButton: false,
        timer: 2000
      });
    }

  }
  render() {

    const inputStyle = { WebkitBoxShadow: "0 0 0 1000px white inset" };

    return (
      <div style={{ marginTop: '100px' }}>
        <div>
          <h2
            style={{ color: "#334D9F" }}

          >Register</h2>
        </div>
        <br />


        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="Username"
            required
            variant="outlined"

            size="small"
            inputProps={{ style: inputStyle }}
            // helperText={this.state.username.length === 0 ? "This field is required" : ""}
            // error={this.state.username.length === 0}
          />
          <br /><br />

          {/* helperText={this.state.helperText}
  error={this.state.error}
  onFocus={() => this.setState({ helperText: "This field is required", error: true })}
  onBlur={() => this.setState({ helperText: "", error: false })} */}
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
            variant="outlined"

            size="small"
            inputProps={{ style: inputStyle }}
            
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="confirm_password"
            value={this.state.confirm_password}
            onChange={this.onChange}
            placeholder="Confirm Password"
            required
            variant="outlined"

            size="small"
            inputProps={{ style: inputStyle }}
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="normal"
            disabled={this.state.username == '' && this.state.password == ''}
            onClick={this.register}
            style={{ backgroundColor: "#334D9F", color: "white" }}

          >
            Register
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link

            style={{ color: "#334D9F" }}

            href="/">
            Login
          </Link>
        </div>
      </div>
    );
  }
}