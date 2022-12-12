import React from "react";
import "./styles.css"
import logo from "./img/logo.png"

export default function SignUpPage() {

    return (
        <div>
            <nav className="navBarContainer">
                <h1 className="navBarTitle">Sign Up</h1>
            </nav>
            <section className="heroSection">
                <div className="leftHero">
                    <img className="leftHeroImage" src={logo} alt="" />
                    <p className="leftHeroText">
                        A software curated for agile development. Join Today!
                    </p>
                    <ul className="leftHeroFeaturesList">
                        <li><span>✓</span> Create a project specific board.</li>
                        <li><span>✓</span> Create &amp; store tasks on a project board.</li>
                        <li><span>✓</span> Join an exisiting project board through a code.</li>
                        <li><span>✓</span> Self assign a task &amp;  comment on tasks.</li>
                        <li><span>✓</span> And so much more!</li>
                    </ul>
                </div>
                <form className="rightHero" action="">
                    <label className="label" htmlFor="email">Email:</label>
                    <input className="textbox" type="text" id="email" name="email" /><br /><br />
                    <label className="label" htmlFor="fullName">Full Name:</label>
                    <input className="textbox" type="text" id="fullName" name="fullName" /><br /><br />
                    <label className="label" htmlFor="password">Password:</label>
                    <input className="textbox" type="password" id="password" name="password" /><br /><br />
                    <label className="label" htmlFor="confirmPassword">Confirm Password:</label>
                    <input className="textbox" type="password" id="confirmPassword" name="confirmPassword" /><br /><br />
                    <input type="submit" defaultValue="Create" className="createButton" />
                </form>
            </section>
      </div>
    );
}