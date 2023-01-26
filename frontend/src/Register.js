import React, { Component } from 'react';
import swal from 'sweetalert';

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
    return (
      <div style={{ marginTop: '200px' }}>
        <div>
          <h2>Register</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={this.state.username}
            onChange={this.onChange}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basic"
            type="password"
            autoComplete="off"
            name="password"
            value={this.state.password}
            onChange={this.onChange}
            placeholder="Password"
            required
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
          />
          <br /><br />
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
            disabled={this.state.username == '' && this.state.password == '' }
            onClick={this.register}
          >
            Register
          </Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Link href="/">
            Login
          </Link>
        </div>
      </div>
    );
  }
}