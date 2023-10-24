import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import FullLogo from "../../../assets/images/logo/uni_logo.png";
import { BASE_URL } from "../../../config";

import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Form,
  FormGroup,
  Label,
  Input,
  CustomInput,
  Button,
} from "reactstrap";
import "@styles/base/pages/page-auth.scss";

const LoginV1 = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  console.log("Email:", email);
  console.log("Password:", password);
  const handleSubmit = async () => {
    //e.preventDefault();

    // Check if email and password are empty
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    const data = {
      email,
      password,
    };
    console.log("Sending request with data:", data);
    try {
      const response = await fetch(`${BASE_URL}adminlogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json(); // Parse JSON response
        console.log("User Details:", responseData);
        localStorage.setItem(
          "StudentInfo",
          JSON.stringify(responseData.original.user)
        );

        setTimeout(() => {
          if (localStorage.getItem("StudentInfo")) {
            history.push("/adminhome");
            window.location.reload();
          }
        }, 5000);
        // Now you can access user details from responseData

        console.log("Login successful");
      } else {
        console.error("Login failed");
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }

    // Continue with your form submission logic here

    // Reset the error state if there was an error previously
  };

  return (
    <>
      <div className="auth-wrapper auth-v1 px-2">
        <div className="auth-inner py-2">
          <Card className="mb-0">
            <CardBody>
              <Link
                className="brand-logo"
                to="/"
                onClick={(e) => e.preventDefault()}
              >
                <h2 className="brand-text text-primary ml-1">STMU</h2>
              </Link>
              <CardTitle tag="h4" className="mb-1">
                Welcome to Admin Panel
              </CardTitle>

              <Form className="auth-login-form mt-2">
                <FormGroup>
                  <Label className="form-label" for="login-email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="login-email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                </FormGroup>

                <FormGroup>
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>
                    {/* <Link to="/pages/forgot-password-v1">
                      <small>Forgot Password?</small>
                    </Link> */}
                  </div>
                  <InputPasswordToggle
                    className="input-group-merge"
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <CustomInput
                    type="checkbox"
                    className="custom-control-Primary"
                    id="remember-me"
                    label="Remember Me"
                  />
                </FormGroup>
                <Button.Ripple onClick={handleSubmit} color="primary">
                  Sign in
                </Button.Ripple>
              </Form>
              {error && <div className="text-danger mt-2">{error}</div>}
              <div className="divider my-2">
                <div className="divider-text"></div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LoginV1;
