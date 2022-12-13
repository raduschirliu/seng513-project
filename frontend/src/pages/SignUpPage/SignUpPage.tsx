import React from "react";
import { useForm, SubmitHandler } from 'react-hook-form';
import useAuth from '../../state/auth/useAuth';
import "./styles.css"
import logo from "./img/logo.png"

type SignUpFormData = {
    username: string;
    fullName: string;
    password: string;
};

export default function SignUpPage() {
    const {register, handleSubmit, reset} = useForm<SignUpFormData>();
    const {signUp} = useAuth();

    const onSubmit: SubmitHandler<SignUpFormData> = (data) => {
        console.log("Signing up in progress with\n", data);
        reset();

        signUp(data.username, data.fullName, data.password)
            .then((user) => {
                console.log('Signed up successfully as: ', user);
            })
            .catch((err) => alert('Error signing up: ' + err));
    }

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

                <form onSubmit={handleSubmit(onSubmit)} className="rightHero" action="">
                    <label className="label" htmlFor="email">Username:</label>
                    <input {...register("username", {required: true})} className="textbox" type="text" /><br /><br />
                    <label className="label" htmlFor="fullName">Full Name:</label>
                    <input {...register("fullName", {required: true})} className="textbox" type="text"/><br /><br />
                    <label className="label" htmlFor="password">Password:</label>
                    <input {...register("password", {required: true})} className="textbox" type="password"/><br /><br />
                    <label className="label" htmlFor="confirmPassword">Confirm Password:</label>
                    <input className="textbox" type="password"/><br /><br />
                    <input type="submit" defaultValue="Create" className="createButton" />
                </form>
            </section>
      </div>
    );
}
