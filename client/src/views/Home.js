import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  Button,
} from "reactstrap";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();
  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    console.log(rolesFromStorage);
    if (!rolesFromStorage) {
      history.push("/login");
    }
  }, [history]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Shifa Tameer-e-Millat University</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>Join Shifa and Enjoy</CardText>
          <div>
            <Link to="/forms/wizard">
              <Button color="primary" style={{ margin: "10px" }}>
                Admission All Programs
              </Button>
            </Link>
            <Link to="/second-page">
              <Button color="secondary" style={{ margin: "10px" }}>
                Certificate of Health Profession Education (CHPE)
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
