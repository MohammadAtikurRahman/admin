import React, { Component } from "react";

import {
  Button,
  TextField,
  TableBody,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import swal from "sweetalert";
import json2csv from "json2csv";

import { Link as MaterialLink } from "@material-ui/core";
import { Link } from "react-router-dom";
import BeneficiaryDelete, { beneficiarydelete } from "./BeneficiaryDelete";
import { searchBeneficiary } from "./utils/search";
import { EditBeneficiary } from "./EditBeneficiary";
import { AddBeneficiary } from "./AddBeneficiary";

const axios = require("axios");
const baseUrl = process.env.REACT_APP_URL;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const adjustedTime = new Date(date.getTime() + 6 * 60 * 60 * 1000); // Adding 6 hours (in milliseconds)
  let formattedTime = adjustedTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  formattedTime = formattedTime
    .replace("AM", "temp")
    .replace("PM", "AM")
    .replace("temp", "PM");
  return formattedTime;
};


const flattenTransactions = (data) => {
  let uniqueTrxIds = {};
  let beneficiaries = {};

  data.forEach((entry) => {
    const beneficiaryId = entry.beneficiaryId;
    if (!beneficiaries[beneficiaryId]) {
      beneficiaries[beneficiaryId] = {
        transactionsCount: 0,
        cashInCount: 0,
        cashOutCount: 0,
        transactions: [],
      };
      uniqueTrxIds[beneficiaryId] = new Set();
    }

    entry.transaction.forEach((transaction) => {
      if (!uniqueTrxIds[beneficiaryId].has(transaction.trxId)) {
        uniqueTrxIds[beneficiaryId].add(transaction.trxId);
        beneficiaries[beneficiaryId].transactionsCount++;

        if (transaction.type === 'in') {
          beneficiaries[beneficiaryId].cashInCount++;
        } else if (transaction.type === 'out') {
          beneficiaries[beneficiaryId].cashOutCount++;
        }

        beneficiaries[beneficiaryId].transactions.push({
          "Beneficiary Id": beneficiaryId,
          "Beneficiary Mobile": transaction.beneficiaryMobile,
          "Cash Status": transaction.type === "in" ? "Cash In" : "Cash Out",
          Amount: transaction.amount,
          Date: transaction.date,
          "Loggedin Date": formatDate(entry.loggedin_time),
          "Loggedin Time": formatTime(entry.loggedin_time),
          "Total Transactions": beneficiaries[beneficiaryId].transactionsCount,
          "Total Cash In": beneficiaries[beneficiaryId].cashInCount,
          "Total Cash Out": beneficiaries[beneficiaryId].cashOutCount,
        });
      }
    });
  });

  return Object.values(beneficiaries).map(b => b.transactions).flat();
};



const getData = async () => {
  try {
    const res = await axios.get(baseUrl + "/get-tran");
    return flattenTransactions(res.data);
  } catch (error) {
    console.error(error);
  }
};

const exportData = async () => {
  let data = await getData();
  data = data.reverse(); // Reverse the order of data
  const fields = Object.keys(data[0]);
  const csv = json2csv.parse(data, { fields });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "transaction.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default class Transactiondetails extends Component {
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
        const beneficiaries = res.data.beneficiaries.map((beneficiary) => {
          let totalCashInTransactions = 0;
          let totalCashOutTransactions = 0;
          let totalTransactions = 0;
          let seenTrxids = new Set();
  
          beneficiary.transaction.forEach((transaction) => {
            if (!seenTrxids.has(transaction.trxid)) {
              seenTrxids.add(transaction.trxid);
              totalTransactions += 1;
              if (transaction.type === 'in') {
                totalCashInTransactions += 1;
              } else if (transaction.type === 'out') {
                totalCashOutTransactions += 1;
              } else {
                console.log(`Unexpected transaction type: ${transaction.type}`);
              }
              console.log(`Transaction: ${transaction.trxid}, Type: ${transaction.type}`);
            }
          });
  
          console.log(`Beneficiary: ${beneficiary.beneficiaryId}, Total Cash In: ${totalCashInTransactions}, Total Cash Out: ${totalCashOutTransactions}`);
  
          return {
            ...beneficiary,
            totalCashInTransactions,
            totalCashOutTransactions,
            totalTransactions
          };
        });
  
        this.setState({
          loading: false,
          beneficiaries,
          filteredBeneficiary: beneficiaries,
        });
      })
      .catch((err) => {
        swal({
          text: err,
          icon: "error",
          type: "error",
        });
        this.setState(
          { loading: false, beneficiaries: [], userinfo: [] },
          () => {}
        );
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
        filteredBeneficiary: searchBeneficiary(
          this.state.beneficiaries,
          needle
        ),
      });
    }
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
          <h2>TRANSACTION DETAILS</h2>
  
          <Button
            className="button_style"
            variant="contained"
            color="inherit"
            size="small"
          >
            <MaterialLink
              style={{ textDecoration: "none", color: "black" }}
              href="/test"
            >
              List Of Test
            </MaterialLink>
          </Button>
  
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
          >
            <MaterialLink
              style={{ textDecoration: "none", color: "white" }}
              href="/notest"
            >
              Disagree of test
            </MaterialLink>
          </Button>
  
          <Button
            className="button_style"
            variant="contained"
            size="small"
            style={{ backgroundColor: "green", color: "white" }}
          >
            <MaterialLink
              style={{
                textDecoration: "none",
                color: "white",
              }}
              onClick={exportData}
            >
              Transaction Details Download
            </MaterialLink>
          </Button>
  
          <Button
            className="button_style"
            variant="contained"
            color="secondary"
            size="small"
          >
            <MaterialLink
              style={{ textDecoration: "none", color: "white" }}
              href="/dashboard"
            >
              List of beneficiary
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
              href="/"
            >
              logout
            </MaterialLink>
          </Button>
        </div>
  
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
                  <b> Total Cash In</b>
                </TableCell>
                <TableCell align="center">
                  <b>Total Cash out </b>
                </TableCell>
                <TableCell align="center">
                  <b>Total Transaction</b>
                </TableCell>
                <TableCell align="center">
                  <b>Action</b>
                </TableCell>
                <TableCell align="center">
                  <b>Details</b>
                </TableCell>
              </TableRow>
            </TableHead>
  
            <TableBody>
              {this.state?.filteredBeneficiary
                ?.reverse()
                .filter((row) => row.mob_own == "bkash")
                .map((row, index) => (
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

                    <TableCell align="center">{row.totalCashInTransactions}</TableCell>
                    <TableCell align="center">{row.totalCashOutTransactions}</TableCell>
                    <TableCell align="center">{row.totalTransactions}</TableCell>
  
                    <TableCell align="center">
                      <Button
                        className="button_style"
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => this.handleProductEditOpen(row)}

                        style={{

                          width: "100px",

                        }}
                      >
                        Edit
                      </Button>
                      <BeneficiaryDelete   row={row} />
                    </TableCell>

                  
  
                    <TableCell align="center">
                      <Button
                        className="button_style"
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "white",
                            width: "170px"
                          }}
                          to={`/profile/${row._id}`}
                          state={row}
                        >
                          BeneFiciary Details
                        </Link>
                      </Button>
                      &nbsp;
                      <Button
                        className="button_style"
                        variant="contained"
                        color="inherit"
                        size="small"
                      >
                        <Link
                          style={{
                            textDecoration: "none",
                            color: "black",
                            width: "170px",

                          }}
                          to={`/transaction/${row._id}`}
                          state={row}
                        >
                          Transactions Details
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
  
        {this.state.openProductModal && (
          <AddBeneficiary
            isEditModalOpen={this.state.openProductModal}
            handleEditModalClose={this.handleProductClose}
            getBeneficiaries={this.getBeneficiaries}
          />
        )}
      </div>
    );
  }
}  