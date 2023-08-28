import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import { Link } from "@material-ui/core";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function Transaction() {
  const [totalTransactionCount, setTotalTransactionCount] = useState(0);
  const [totalCashInCount, setTotalCashInCount] = useState(0);
  const [totalCashOutCount, setTotalCashOutCount] = useState(0);
  const location = useLocation();
  const userProfile = location.state;
  console.log("transaction details", userProfile);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile?.transaction) {
      setTotalTransactionCount(userProfile.transaction.length);

      const cashInCount = userProfile.transaction.reduce((acc, t) => {
        if (t.type === "in" && t.date) {
          return acc + 1;
        }
        return acc;
      }, 0);

      const cashOutCount = userProfile.transaction.reduce((acc, t) => {
        if (t.type === "out" && t.date) {
          return acc + 1;
        }
        return acc;
      }, 0);

      setTotalCashInCount(cashInCount);
      setTotalCashOutCount(cashOutCount);
    }
  }, [userProfile]);

  function logOut() {
    localStorage.setItem("token", null);
    navigate("/");
  }

  function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const classes = useStyles();
  const trxidSet = new Set();

  const totalCashIn = userProfile?.transaction.reduce((acc, t) => {
    if (!trxidSet.has(t.trxid) && t.type === "in" && t.date) {
      trxidSet.add(t.trxid);
      return acc + t.amount;
    }
    return acc;
  }, 0);

  const totalCashOut = userProfile?.transaction.reduce((acc, t) => {
    if (!trxidSet.has(t.trxid) && t.type === "out" && t.date) {
      trxidSet.add(t.trxid);
      return acc + t.amount;
    }
    return acc;
  }, 0);

  const totalMinutes = userProfile?.transaction.reduce((acc, t, index, arr) => {
    if (
      !isNaN(Number(t.duration)) &&
      t.date &&
      arr.findIndex((el) => el.trxid === t.trxid) === index
    ) {
      return acc + Number(t.duration);
    }
    return acc;
  }, 0);

  const totalMinutesBkash = userProfile?.transaction.reduce(
    (acc, t, index, arr) => {
      if (
        !isNaN(Number(t.duration_bkash)) &&
        t.date &&
        arr.findIndex((el) => el.trxid === t.trxid) === index
      ) {
        return acc + Number(t.duration_bkash);
      }
      return acc;
    },
    0
  );

  const totalMinutesNagad = userProfile?.transaction.reduce(
    (acc, t, index, arr) => {
      if (
        !isNaN(Number(t.duration_nagad)) &&
        t.date &&
        arr.findIndex((el) => el.trxid === t.trxid) === index
      ) {
        return acc + Number(t.duration_nagad);
      }
      return acc;
    },
    0
  );

  return (
    <div className="container text-center p-2 ">
      <br></br>
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
          >
            {" "}
            <h6>
              {" "}
              <b> Beneficiary Name: {userProfile?.name} </b>{" "}
            </h6>{" "}
          </Button>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
          >
            <h6>
              {" "}
              <b> Beneficiary Id: {userProfile?.beneficiaryId} </b>{" "}
            </h6>
          </Button>

          <Button
            className="button_style"
            variant="contained"
            color="primary"
            size="small"
          >
            <h6>
              {" "}
              <b> Beneficiary mobile: {userProfile?.mob}</b>
            </h6>
          </Button>
        </div>

        <br></br>

        <Button
          className="button_style"
          variant="contained"
          color="primary"
          size="small"
        >
          <Link
            style={{ textDecoration: "none", color: "white" }}
            href="/dashboard"
          >
            List Of BeneFiciary
          </Link>
        </Button>

        <Button
          className="button_style"
          variant="contained"
          color="secondary"
          size="small"
        >
          <Link
            style={{ textDecoration: "none", color: "white" }}
            href="/enumerator"
          >
            List Of Enumerator
          </Link>
        </Button>

        <Button
          className="button_style"
          variant="contained"
          color="inherit"
          size="small"
        >
          <Link style={{ textDecoration: "none", color: "black" }} href="/test">
            List Of Test
          </Link>
        </Button>

        <Button
          className="button_style"
          variant="contained"
          size="small"
          onClick={logOut}
        >
          Log Out
        </Button>
      </div>

      <TableContainer
        component={Paper}
        style={{ width: "100%", marginBottom: "20px" }}
      >
        <Table
          className={classes.table}
          aria-label="transaction table"
          style={{ minWidth: "650px" }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Cash In</TableCell>
              <TableCell align="center">Cash Out</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Thrift Usages</TableCell>
              <TableCell align="center">Trxid</TableCell>
              <TableCell align="center">Payment Type</TableCell>
              <TableCell align="center">Bkash Usages</TableCell>
              <TableCell align="center">Nagad Usages</TableCell>

              <TableCell align="center">M-Banking</TableCell>
              <TableCell align="center">SMS</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {userProfile.transaction
              .filter((t, index, arr) => {
                // Filter only the first occurrence of each trxid
                return arr.findIndex((el) => el.trxid === t.trxid) === index;
              })
              .filter((t) => t.date)
              .sort((a, b) => {
                const [dayA, monthA, yearA] = a.date.split("/");
                const [dayB, monthB, yearB] = b.date.split("/");
                const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
                const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
                return dateB - dateA;
              })
              .map((t) => (
                <TableRow key={t._id}>
                  <TableCell
                    align="center"
                    style={{ color: "green", fontWeight: "bold" }}
                  >
                    {t.type === "in" ? t.amount : ""}
                  </TableCell>

                  <TableCell
                    align="center"
                    style={{ color: "red", fontWeight: "bold" }}
                  >
                    {t.type === "out" ? t.amount : ""}
                  </TableCell>

                  <TableCell align="center">{t.date}</TableCell>
                  <TableCell align="center">{t.duration} Minutes</TableCell>
                  <TableCell align="center">{t.trxid}</TableCell>

                  <TableCell align="center">{t.sub_type}</TableCell>

                  <TableCell align="center">{t.duration_bkash}</TableCell>
                  <TableCell align="center">{t.duration_nagad}</TableCell>

                  <TableCell align="center">
                    {capitalizeFirstLetter(t.sender)}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => Swal(t.raw_sms)}
                    >
                      Show SMS
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            <TableRow>
              <TableCell
                align="center"
                style={{ color: "green", fontWeight: "bold" }}
              >
                Total Cash In: {totalCashIn}
                <br />
                {/* Total Cash In Transactions: {totalCashInCount} */}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "red", fontWeight: "bold" }}
              >
                Total Cash Out: {totalCashOut}
                <br />
                {/* Total Cash Out Transactions: {totalCashOutCount} */}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              >
                {/* Total Transactions: {totalTransactionCount} */}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              >
                Total Thrift Minute: {totalMinutes}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              ></TableCell>
              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              ></TableCell>

              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              >
                Total Bkash Minute: {totalMinutesBkash}
              </TableCell>

              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              >
                Total Nagad Minute: {totalMinutesNagad}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
