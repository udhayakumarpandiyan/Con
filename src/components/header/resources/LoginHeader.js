import React from 'react';
import { NavLink } from "react-router-dom";

export default function LoginHeader() {
    return <nav className="navbar navbar-expand-lg navbar-light bg-light p-0">
        <NavLink className="navbar-brand logo-without-login" to="/home"></NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse padLeft-1" id="navbarTogglerDemo01">
            {/* <a className="navbar-brand" href="#">Logo</a> */}
            <ul className="navbar-nav ml-auto mt-2">
                <li className="nav-item">
                    {/* <a className="nav-lin" href="#">Home <span className="sr-only">(current)</span></a> */}
                    <NavLink className="nav-link" to="/home">Home<span className="sr-only">(current)</span></NavLink>
                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="#">How it works</a> */}
                    <NavLink className="nav-link" to="/how-it-works">How it works</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/plans-pricing">Plans and Pricing</NavLink>
                    {/* <a className="nav-link" href="#">Plans and Pricing</a> */}
                </li>
                <li className="nav-item">
                    {/* <a className="nav-link" href="#">Login</a> */}
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                    <button className="btn btn-outline-success my-2" type="submit">Contact us to buy</button>
                </li>
            </ul>
        </div>
    </nav>
}