import { Fragment, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import {
  Row,
  Col,
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
import { BASE_URL } from "../../src/config";

const Register = () => {
  const history = useHistory();
  const [skin, setSkin] = useSkin();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [nationality, setNationality] = useState("");
  const [cnic, setCnic] = useState("");
  const [cnicError, setCnicError] = useState(""); // Add a new state for CNIC validation error
  const [passportNumber, setPassportNumber] = useState("");
  const [isRadioChecked, setIsRadioChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleNationalityChange = (event) => {
    setNationality(event.target.value);
    setIsRadioChecked(true); // Set the state to true when a radio button is checked
  };
  function handleEmailChange(event) {
    const emailValue = event.target.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    console.log(emailValue);

    if (!emailRegex.test(emailValue)) {
      setEmailError("Email address not valid");
      setIsButtonDisabled(true);
      //event.target.setCustomValidity('Please enter a valid email address.')
    } else {
      setEmailError("");
      event.target.setCustomValidity("");
      setIsButtonDisabled(false);
    }
    setEmail(emailValue);
  }
  const handleCnicChange = (event) => {
    const cnicValue = event.target.value.trim();
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/; // Add the CNIC regex pattern

    if (!cnicRegex.test(cnicValue)) {
      setCnicError(
        "Invalid CNIC format. Please use the format: 12345-6789012-3"
      );
      setIsButtonDisabled(true);
    } else {
      setCnicError("");
      setIsButtonDisabled(false);
    }
    setCnic(cnicValue);
  };
  const handleSubmit = async (event) => {
    setIsLoading(true);
    setIsButtonDisabled(true);

    event.preventDefault();
    try {
      const requestBody = {
        email,
        password,
      };

      if (nationality === "pakistani") {
        requestBody.cnic = cnic; // Include CNIC if Pakistani/Dual National
      } else if (nationality === "foreign") {
        requestBody.cnic = passportNumber; // Include Passport Number if Foreign
      }

      const response = await fetch(`${BASE_URL}register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(
          "Registration successful. Password sent to your email."
        );
        setIsLoading(false);
        setIsButtonDisabled(false);
        history.push("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        throw new Error("Network response was not ok.");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const illustration =
      skin === "dark" ? "register-v2-dark.svg" : "register.jpg",
    source = require(`@src/assets/images/pages/${illustration}`).default;

  const RememberMe = () => {
    return (
      <Fragment>
        I agree to
        <a className="ml-25" href="/" onClick={(e) => e.preventDefault()}>
          privacy policy & terms
        </a>
      </Fragment>
    );
  };
  return (
    <div className="auth-wrapper auth-v2">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <svg viewBox="0 0 139 95" version="1.1" height="28">
            <defs>
              <linearGradient
                x1="100%"
                y1="10.5120544%"
                x2="50%"
                y2="89.4879456%"
                id="linearGradient-1"
              >
                <stop stopColor="#000000" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="64.0437835%"
                y1="46.3276743%"
                x2="37.373316%"
                y2="100%"
                id="linearGradient-2"
              >
                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Artboard" transform="translate(-400.000000, -178.000000)">
                <g id="Group" transform="translate(400.000000, 178.000000)">
                  <path
                    d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                    id="Path"
                    className="text-primary"
                    style={{ fill: "currentColor" }}
                  ></path>
                  <path
                    d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                    id="Path"
                    fill="url(#linearGradient-1)"
                    opacity="0.2"
                  ></path>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.049999997"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                  ></polygon>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.099999994"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                  ></polygon>
                  <polygon
                    id="Path-3"
                    fill="url(#linearGradient-2)"
                    opacity="0.099999994"
                    points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>
          <h2 className="brand-text text-primary ml-1">STMU</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login V2" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="font-weight-bold mb-1">
              Welcome to Shifa Tameer-e-Millat University
            </CardTitle>
            <CardText className="mb-2">
              <strong>Password will be sent on email you will provide</strong>
            </CardText>

            <Form className="auth-register-form mt-2">
              {/*
              <FormGroup>
                <Label className='form-label' for='register-username'>
                  Username
                </Label>
                <Input type='text' id='register-username' value={username}
          onChange={(event) => setUsername(event.target.value)} placeholder='johndoe' autoFocus />
              </FormGroup>
              */}
              <FormGroup>
                <Label className="form-label" for="register-email">
                  Email
                </Label>
                <Input
                  type="email"
                  id="register-email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    handleEmailChange(event);
                  }}
                  placeholder="john@example.com"
                />
                {emailError && <div style={{ color: "red" }}>{emailError}</div>}
              </FormGroup>
              <FormGroup>
                <Label className="form-label">
                  Nationality<sup>*</sup>
                </Label>
                <div>
                  <CustomInput
                    type="radio"
                    id="nationality-pakistani"
                    name="nationality"
                    value="pakistani"
                    label="Pakistani/Dual National"
                    checked={nationality === "pakistani"}
                    onChange={handleNationalityChange}
                  />
                  <CustomInput
                    type="radio"
                    id="nationality-foreign"
                    name="nationality"
                    value="foreign"
                    label="Foreign"
                    checked={nationality === "foreign"}
                    onChange={handleNationalityChange}
                  />
                </div>
              </FormGroup>
              {nationality === "pakistani" && (
                <FormGroup>
                  <Label className="form-label" for="cnic">
                    CNIC
                  </Label>
                  <Input
                    type="text"
                    id="cnic"
                    value={cnic}
                    onChange={handleCnicChange}
                    placeholder="12345-6789012-3"
                    maxLength={15} // Set maximum length to 15 characters
                  />
                  {cnicError && <div style={{ color: "red" }}>{cnicError}</div>}
                </FormGroup>
              )}

              {nationality === "foreign" && (
                <FormGroup>
                  <Label className="form-label" for="passport-number">
                    Passport Number
                  </Label>
                  <Input
                    type="text"
                    id="passport-number"
                    value={passportNumber}
                    onChange={(event) => setPassportNumber(event.target.value)}
                    placeholder="A1234567"
                  />
                </FormGroup>
              )}
              {/*
              <FormGroup>
                <Label className='form-label' for='register-password'>
                  Password
                </Label>
                <InputPasswordToggle className='input-group-merge'   value={password}
          onChange={(event) => setPassword(event.target.value)}id='register-password' />
              </FormGroup>
  */}
              {/* <FormGroup>
                <CustomInput
                  type='checkbox'
                  className='custom-control-Primary'
                  id='remember-me'
                  label={<RememberMe />}
                />
              </FormGroup>
*/}
              <Button.Ripple
                color="primary"
                block
                onClick={handleSubmit}
                disabled={isButtonDisabled || !isRadioChecked}
              >
                {isLoading ? "Loading..." : "Sign up"}
              </Button.Ripple>
            </Form>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            {successMessage && (
              <div style={{ color: "green" }}>{successMessage}</div>
            )}
            <p className="text-center mt-2">
              <span className="mr-25">Already have an account?</span>
              <Link to="login">
                <span>Sign in instead</span>
              </Link>
            </p>
            {/* <div className="divider my-2">
              <div className="divider-text">or</div>
            </div> */}
            {/* <div className="auth-footer-btn d-flex justify-content-center">
              <Button.Ripple color="facebook">
                <Facebook size={14} />
              </Button.Ripple>
              <Button.Ripple color="twitter">
                <Twitter size={14} />
              </Button.Ripple>
              <Button.Ripple color="google">
                <Mail size={14} />
              </Button.Ripple>
              <Button.Ripple className="mr-0" color="github">
                <GitHub size={14} />
              </Button.Ripple>
            </div> */}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
