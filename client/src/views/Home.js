import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText,
  CardLink,
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
  }, []);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Shifa Tameer-e-Millat University</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>Join Shifa and Enjoy</CardText>
        </CardBody>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Want to integrate JWT? 🔒</CardTitle>
        </CardHeader>
        <CardBody>
          <CardText>
            We carefully crafted JWT flow so you can implement JWT with ease and
            with minimum efforts.
          </CardText>
          <CardText>
            Please read our{" "}
            <CardLink
              href="https://pixinvent.com/demo/vuexy-react-admin-dashboard-template/documentation/development/auth"
              target="_blank"
            >
              JWT Documentation
            </CardLink>{" "}
            to get more out of JWT authentication.
          </CardText>
        </CardBody>
      </Card> */}
    </div>
  );
};

export default Home;
