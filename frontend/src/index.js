import React from "react";
import ReactDOM from "react-dom";
import { Switch, Redirect, Route } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Test from "./Test";
import Profile from "./Profile";
import Enumerator from "./Enumerator";
import "./Login.css";

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/enumerator" component={Enumerator} />
            <Route path="/test" component={Test} />
            <Route path="/profile/:id" component={Profile} />
            {/* <Route component={NotFound}/> */}
        </Switch>
    </BrowserRouter>,
    document.getElementById("root")
);