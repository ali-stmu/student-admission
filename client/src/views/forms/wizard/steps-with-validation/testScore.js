import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../../../config";
import {
  Label,
  FormGroup,
  Row,
  Col,
  Button,
  Form,
  Input,
  CustomInput,
} from "reactstrap";
const TestScore = ({ stepper, type }) => {
  const onSubmit = () => {
    console.log("Next click");
    stepper.next();
  };
  const previous = () => {
    console.log("Previous click");
    stepper.previous();
  };
  return (
    <>
      <div>TestScore</div>
      <div className="d-flex justify-content-between">
        <Button.Ripple color="primary" className="btn-prev" onClick={previous}>
          <ArrowLeft
            size={14}
            className="align-middle mr-sm-25 mr-0"
          ></ArrowLeft>
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button.Ripple>
        <Button.Ripple
          type="submit"
          color="primary"
          className="btn-next"
          onClick={onSubmit}
        >
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ml-sm-25 ml-0"
          ></ArrowRight>
        </Button.Ripple>
      </div>
    </>
  );
};

export default TestScore;
