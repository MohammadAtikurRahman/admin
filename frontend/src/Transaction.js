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
  const navigate = useNavigate();
  const uniqueTrxids = new Set();

  useEffect(() => {
    if(userProfile?.transaction) {
      const cashInCount = userProfile.transaction.reduce((acc, t) => {
        if(t.type === "in" && t.date && !uniqueTrxids.has(t.trxid)) {
          uniqueTrxids.add(t.trxid);
          return acc + 1;
        }
        return acc;
      }, 0);

      const cashOutCount = userProfile.transaction.reduce((acc, t) => {
        if(t.type === "out" && t.date && !uniqueTrxids.has(t.trxid)) {
          uniqueTrxids.add(t.trxid);
          return acc + 1;
        }
        return acc;
      }, 0);

      setTotalTransactionCount(uniqueTrxids.size);
      setTotalCashInCount(cashInCount);
      setTotalCashOutCount(cashOutCount);
    }
  }, [userProfile]);

  function logOut() {
    localStorage.setItem("token", null);
    navigate("/");
  }

  const classes = useStyles();

  const totalCashIn = userProfile?.transaction.reduce((acc, t) => {
    if (t.type === "in" && t.date && uniqueTrxids.has(t.trxid)) {
      return acc + t.amount;
    }
    return acc;
  }, 0);

  const totalCashOut = userProfile?.transaction.reduce((acc, t) => {
    if (t.type === "out" && t.date && uniqueTrxids.has(t.trxid)) {
      return acc + t.amount;
    }
    return acc;
  }, 0);

  const totalMinutes = userProfile?.transaction.reduce((acc, t) => {
    if (!isNaN(Number(t.duration)) && t.date && uniqueTrxids.has(t.trxid)) {
      return acc + Number(t.duration);
    }
    return acc;
  }, 0);

  return (
    <div className="container text-center p-5 ">
      <div>
        <h3>Beneficiary Name: {userProfile?.name}</h3>
        <h3>Beneficiary Id: {userProfile?.beneficiaryId}</h3>
        <h3>Beneficiary mobile: {userProfile?.mob}</h3>

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

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="transaction table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Cash In</TableCell>
              <TableCell align="center">Cash Out</TableCell>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Usages</TableCell>
              <TableCell align="center">Trxid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userProfile.transaction
              .filter((t) => t.date && uniqueTrxids.has(t.trxid))
              .sort((a, b) => new Date(b.date) - new Date(a.date))
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
                </TableRow>
              ))}
            <TableRow>
              <TableCell
                align="center"
                style={{ color: "green", fontWeight: "bold" }}
              >
                Total Cash In: {totalCashIn}
                <br/>
                Total Cash In Transactions: {totalCashInCount}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "red", fontWeight: "bold" }}
              >
                Total Cash Out: {totalCashOut}
                <br/>
                Total Cash Out Transactions: {totalCashOutCount}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              >
                Total Transactions: {totalTransactionCount}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              >
                Total minute: {totalMinutes}
              </TableCell>
              <TableCell
                align="center"
                style={{ color: "purple", fontWeight: "bold" }}
              ></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
