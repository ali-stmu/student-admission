import { Link } from "react-router-dom";
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
import InputPasswordToggle from "@components/input-password-toggle";
import FullLogo from "../../../assets/images/logo/uni_logo.png";

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

              <Form
                className="auth-login-form mt-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <FormGroup>
                  <Label className="form-label" for="login-email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    id="login-email"
                    placeholder="john@example.com"
                    autoFocus
                  />
                </FormGroup>

                <FormGroup>
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>
                    <Link to="/pages/forgot-password-v1">
                      <small>Forgot Password?</small>
                    </Link>
                  </div>
                  <InputPasswordToggle
                    className="input-group-merge"
                    id="login-password"
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
                <Button.Ripple color="primary" block>
                  Sign in
                </Button.Ripple>
              </Form>

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
