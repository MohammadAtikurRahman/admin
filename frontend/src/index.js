import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Test from "./Test";
import Profile from "./Profile";
import Enumerator from "./Enumerator";
import "./Login.css";

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/enumerator" element={<Enumerator />} />
            <Route path="/test" element={<Test />} />
            <Route path="/profile/:id" element={<Profile />} />
            
            {/* <Route element={NotFound}/> */}
        </Routes>
    </BrowserRouter>,
    document.getElementById("root")
);
