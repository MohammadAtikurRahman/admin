
import React, { Component } from 'react';
import {
    Button, TextField, Dialog, DialogActions, LinearProgress,
    DialogTitle, DialogContent, TableBody, Table,
    TableContainer, TableHead, TableRow, TableCell
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import swal from 'sweetalert';

import { Link as MaterialLink } from "@material-ui/core";
import { Link } from "react-router-dom";

const axios = require('axios');

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            token: '',
            openProductModal: false,
            openProductEditModal: false,
            id: '',
            name: '',
            desc: '',
            price: '',
            discount: '',
            file: '',
            fileName: '',
            page: 1,
            search: '',
            products: [],
            persons: [],
            upersons: [],
            pages: 0,
            loading: false
        };
    }

    componentDidMount = () => {
        let token = localStorage.getItem('token');
        if (!token) {
            this.props.history.push('/login');
        } else {
            this.setState({ token: token }, () => {
                this.getProduct();
            });
        }

        axios.get(`http://172.104.191.159:2000/api`)
            .then(res => {
                const persons = res.data;
                this.setState({ persons });
                // const userDetails = this.state.persons.payload

                // var enumerator_name = userDetails.user;

                // var enumerator_id = userDetails.id;
                // console.log(enumerator_name);
                // console.log(enumerator_id);



                // const propertyNames = Object.keys(userDetails);

                // console.log(propertyNames);


            })
        axios.get(`http://172.104.191.159:2000/user-details`)
            .then(res => {
                const upersons = res.data;
                this.setState({ upersons });
                // const userDetails = this.state.persons.payload

                // var enumerator_name = userDetails.user;

                // var enumerator_id = userDetails.id;
                // console.log(enumerator_name);
                // console.log(enumerator_id);



                // const propertyNames = Object.keys(userDetails);

                // console.log(propertyNames);


            })



    }



    getProduct = () => {

        this.setState({ loading: true });

        let data = '?';
        data = `${data}page=${this.state.page}`;
        if (this.state.search) {
            data = `${data}&search=${this.state.search}`;
        }
        axios.get(`http://172.104.191.159:2000/get-product${data}`, {
            headers: {
                'token': this.state.token
            }
        }).then((res) => {
            this.setState({ loading: false, products: res.data.products, pages: res.data.pages });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.setState({ loading: false, products: [], pages: 0 }, () => { });
        });
    }


    deleteProduct = (id) => {
        axios.post('http://172.104.191.159:2000/delete-product', {
            id: id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'token': this.state.token
            }
        }).then((res) => {

            swal({
                text: res.data.title,
                icon: "success",
                type: "success"
            });

            this.setState({ page: 1 }, () => {
                this.pageChange(null, 1);
            });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
        });
    }

    pageChange = (e, page) => {
        this.setState({ page: page }, () => {
            this.getProduct();
        });
    }

    logOut = () => {
        localStorage.setItem('token', null);
        this.props.history.push('/');
    }

    onChange = (e) => {
        if (e.target.files && e.target.files[0] && e.target.files[0].name) {
            this.setState({ fileName: e.target.files[0].name }, () => { });
        }
        this.setState({ [e.target.name]: e.target.value }, () => { });
        if (e.target.name == 'search') {
            this.setState({ page: 1 }, () => {
                this.getProduct();
            });
        }
    };

    addProduct = () => {
        const fileInput = document.querySelector("#fileInput");
        const file = new FormData();
        file.append('file', fileInput.files[0]);
        file.append('name', this.state.name);
        file.append('desc', this.state.desc);
        file.append('discount', this.state.discount);
        file.append('price', this.state.price);

        axios.post('http://172.104.191.159:2000/add-product', file, {
            headers: {
                'content-type': 'multipart/form-data',
                'token': this.state.token
            }
        }).then((res) => {

            swal({
                text: res.data.title,
                icon: "success",
                type: "success"
            });

            this.handleProductClose();
            this.setState({ name: '', desc: '', discount: '', price: '', file: null, page: 1 }, () => {
                this.getProduct();
            });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleProductClose();
        });

    }

    updateProduct = () => {
        const fileInput = document.querySelector("#fileInput");
        const file = new FormData();
        file.append('id', this.state.id);
        file.append('file', fileInput.files[0]);
        file.append('name', this.state.name);
        file.append('desc', this.state.desc);
        file.append('discount', this.state.discount);
        file.append('price', this.state.price);

        axios.post('http://172.104.191.159:2000/update-product', file, {
            headers: {
                'content-type': 'multipart/form-data',
                'token': this.state.token
            }
        }).then((res) => {

            swal({
                text: res.data.title,
                icon: "success",
                type: "success"
            });

            this.handleProductEditClose();
            this.setState({ name: '', desc: '', discount: '', price: '', file: null }, () => {
                this.getProduct();
            });
        }).catch((err) => {
            swal({
                text: err.response.data.errorMessage,
                icon: "error",
                type: "error"
            });
            this.handleProductEditClose();
        });

    }

    handleProductOpen = () => {
        this.setState({
            openProductModal: true,
            id: '',
            name: '',
            desc: '',
            price: '',
            discount: '',
            fileName: ''
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
            fileName: data.image
        });
    };

    handleProductEditClose = () => {
        this.setState({ openProductEditModal: false });
    };

    render() {
        return (
            <div>
                {this.state.loading && <LinearProgress size={40} />}
                <div>


                    {this.state.upersons.payload ? <p> <b> Enumerator as a login  </b> {this.state.upersons.payload.user} </p> : ""}

                    {/* <h3> {this.enumerator_name}</h3> */}


                    <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"

                    >
                        <MaterialLink style={{ textDecoration: 'none', color: 'white' }} href="/dashboard">
                            List Of BeneFiciary
                        </MaterialLink>
                    </Button>

                    <Button
                        className="button_style"
                        variant="contained"
                        color="secondary"
                        size="small"

                    >
                        <MaterialLink style={{ textDecoration: 'none', color: 'white' }} href="/enumerator">
                            List Of Enumerator
                        </MaterialLink>
                    </Button>

                    <Button
                        className="button_style"
                        variant="contained"
                        color=""
                        size="small"

                    >
                        <MaterialLink style={{ textDecoration: 'none', color: 'black' }} href="/test">
                            List Of Test
                        </MaterialLink>
                    </Button>

                    <Button
                        className="button_style"
                        variant="contained"
                        size="small"
                        onClick={this.logOut}
                    >

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
                    aria-describedby="alert-dialog-description"
                >
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
                        /><br />
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="desc"
                            value={this.state.desc}
                            onChange={this.onChange}
                            placeholder="Beneficiary Father"
                            required
                        /><br />
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="price"
                            value={this.state.price}
                            onChange={this.onChange}
                            placeholder="Beneficiary Nid"
                            required
                        /><br />
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="discount"
                            value={this.state.discount}
                            onChange={this.onChange}
                            placeholder="Beneficiary Id"
                            required
                        /><br /><br />
                        <Button
                            variant="contained"
                            component="label"
                        > Upload
                            <input
                                id="standard-basic"
                                type="file"
                                accept="image/*"
                                name="file"
                                value={this.state.file}
                                onChange={this.onChange}
                                id_="fileInput"
                                placeholder="File"
                                hidden
                            />
                        </Button>&nbsp;
                        {this.state.fileName}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleProductEditClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == ''}
                            onClick={(e) => this.updateProduct()} color="primary" autoFocus>
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
                >
                    <DialogTitle id="alert-dialog-title">Add Beneficiary</DialogTitle>
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
                        /><br />
                        <TextField
                            id="standard-basic"
                            type="text"
                            autoComplete="off"
                            name="desc"
                            value={this.state.desc}
                            onChange={this.onChange}
                            placeholder="BeneFiciary Father"
                            required
                        /><br />
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="price"
                            value={this.state.price}
                            onChange={this.onChange}
                            placeholder="Beneficiary Nid"
                            required
                        /><br />
                        <TextField
                            id="standard-basic"
                            type="number"
                            autoComplete="off"
                            name="discount"
                            value={this.state.discount}
                            onChange={this.onChange}
                            placeholder="Beneficiry Id"
                            required
                        /><br /><br />
                        <Button
                            variant="contained"
                            component="label"
                        > Upload
                            <input
                                id="standard-basic"
                                type="file"
                                accept="image/*"
                                // inputProps={{
                                //   accept: "image/*"
                                // }}
                                name="file"
                                value={this.state.file}
                                onChange={this.onChange}
                                id_0="fileInput"
                                placeholder="File"
                                hidden
                                required
                            />
                        </Button>&nbsp;
                        {this.state.fileName}
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={this.handleProductClose} color="primary">
                            Cancel
                        </Button>
                        <Button
                            disabled={this.state.name == '' || this.state.desc == '' || this.state.discount == '' || this.state.price == '' || this.state.file == null}
                            onClick={(e) => this.addProduct()} color="primary" autoFocus>
                            Add Beneficiary
                        </Button>
                    </DialogActions>
                </Dialog>

                <br />

                <TableContainer>

                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>


                                <TableCell align="center">Enumerator Id</TableCell>
                                <TableCell align="center">Enumerator Name</TableCell>
                                <TableCell align="center">Enumerator Creation Time</TableCell>
                                {/* <TableCell align="center">Enumerator's BeneFiciary</TableCell> */}


                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.persons.map((row) => (
                                <TableRow key={row.name}>

                                    <TableCell align="center">{row._id}</TableCell>

                                    <TableCell align="center" component="th" scope="row">
                                        {row.username}


                                    </TableCell>

                                    <TableCell align="center">{row.created_at}</TableCell>


                                    {/* <TableCell align="center">{row.price}</TableCell> */}

                                    <Button
                                        className="button_style"
                                        variant="contained"
                                        color=""
                                        size="small"

                                    >
                                        <Link style={{ textDecoration: 'none', color: 'black' }} href="/test">
                                            BeneFiciary of enumerator
                                        </Link>
                                    </Button>


                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                    <br />
                    <Pagination count={this.state.pages} page={this.state.page} onChange={this.pageChange} color="primary" />



                    {/* 
                    <ul>
                        {
                            this.state.persons
                                .map(person =>
                                    <li key={person.id}>{person.username}</li>
                                )
                        }
                    </ul> */}






                </TableContainer>

            </div>
        );
    }
}












// import React from 'react';
// import axios from 'axios';

// import {
//     Button, TextField, Dialog, DialogActions, LinearProgress,
//     DialogTitle, DialogContent, TableBody, Table,
//     TableContainer, TableHead, TableRow, TableCell
//   } from '@material-ui/core';
//   import { Pagination } from '@material-ui/lab';

// export default class Enumerator extends React.Component {
//   state = {
//     persons: []
//   }

//   componentDidMount() {
//     axios.get(`http://172.104.191.159:2000/api`)
//       .then(res => {
//         const persons = res.data;
//         this.setState({ persons });
//       })
//   }

//   render() {
//     return (
//       <ul>
//         {
//           this.state.persons
//             .map(person =>
//               <li key={person.id}>{person.username}</li>
//             )
//         }
//       </ul>
//     )
//   }
// }