import React, { Fragment, useState, useEffect } from "react";
import { selectThemeColors } from "@utils";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeft } from "react-feather";

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

function AcademicRecords({ stepper, type }) {
  const { register, errors, handleSubmit, trigger } = useForm();

  const onSubmit = () => {
    trigger();
    if (isObjEmpty(errors)) {
      stepper.next();
    }
  };
  const [records, setRecords] = useState([
    {
      resultStatus: "",
      qualification: "matric",
      boardUniversity: "",
      passingYear: "",
      totalMarksCGPA: "",
      obtainedMarksCGPA: "",
      percentage: "",
    },
    {
      resultStatus: "",
      qualification: "inter",
      boardUniversity: "",
      passingYear: "",
      totalMarksCGPA: "",
      obtainedMarksCGPA: "",
      percentage: "",
    },
  ]);

  const addRecord = () => {
    setRecords([
      ...records,
      {
        resultStatus: "",
        qualification: "",
        boardUniversity: "",
        passingYear: "",
        totalMarksCGPA: "",
        obtainedMarksCGPA: "",
        percentage: "",
      },
    ]);
  };

  const handleRecordChange = (e, index) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Check if the changed field is "obtainedMarksCGPA"
    if (name === "obtainedMarksCGPA") {
      const totalMarks = records[index].totalMarksCGPA;
      // If obtained marks are greater than total marks, set it to the total marks
      if (parseFloat(value) > parseFloat(totalMarks)) {
        updatedValue = totalMarks;
      }
    }

    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      [name]: updatedValue,
    };
    setRecords(updatedRecords);
    console.log(records);
  };

  const calculatePercentage = (total, obtained) => {
    return ((obtained / total) * 100).toFixed(2);
  };

  return (
    <Fragment>
      {records.map((record, index) => (
        <div key={index}>
          <h5 className="mb-0">Enter Academic Information</h5>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">Result Status</Label>
                <Input
                  type="select"
                  name="resultStatus"
                  id="resultStatus"
                  value={record.resultStatus}
                  onChange={(e) => handleRecordChange(e, index)}
                >
                  <option value=""></option>
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </Input>
              </FormGroup>
              <FormGroup tag={Col} md="4">
                <Label for="qualification" className="form-label">
                  Qualification
                </Label>
                <Input
                  type="select"
                  name="qualification"
                  id="qualification"
                  value={record.qualification}
                  onChange={(e) => handleRecordChange(e, index)}
                >
                  <option value=""></option>
                  <option value="matric">Matric/0-Levels</option>
                  <option value="inter">Intermediate/A-Levels</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </Input>
              </FormGroup>

              <FormGroup tag={Col} md="4">
                <Label for="boardUniversity" className="form-label">
                  Board/University
                </Label>
                <Input
                  type="select"
                  name="boardUniversity"
                  id="boardUniversity"
                  value={record.boardUniversity}
                  onChange={(e) => handleRecordChange(e, index)}
                >
                  <option value=""></option>
                  <option value="ABC University">ABC University</option>
                  <option value="XYZ Board">XYZ Board</option>
                </Input>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">Passing Year</Label>
                <Input
                  type="text"
                  name="passingYear"
                  value={record.passingYear}
                  onChange={(e) => handleRecordChange(e, index)}
                />
              </FormGroup>

              <FormGroup tag={Col} md="4">
                <Label className="form-label">Total Marks/CGPA</Label>
                <Input
                  type="text"
                  name="totalMarksCGPA"
                  value={record.totalMarksCGPA}
                  onChange={(e) => handleRecordChange(e, index)}
                />
              </FormGroup>

              <FormGroup tag={Col} md="4">
                <Label className="form-label">Obtained Marks/CGPA</Label>
                <Input
                  type="text"
                  name="obtainedMarksCGPA"
                  value={record.obtainedMarksCGPA}
                  onChange={(e) => handleRecordChange(e, index)}
                />
              </FormGroup>
            </Row>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">Percentage</Label>
                <Input
                  type="text"
                  name="percentage"
                  value={calculatePercentage(
                    record.totalMarksCGPA,
                    record.obtainedMarksCGPA
                  )}
                  onInput={(e) => handleRecordChange(e, index)}
                  readOnly
                />
              </FormGroup>
              <FormGroup tag={Col} md="4">
                <Label for="degree" className="form-label">
                  Upload Degree
                </Label>
                <CustomInput
                  type="file"
                  name="degree"
                  id="degree"
                  onChange={(e) => handleRecordChange(e, index)}
                />
              </FormGroup>
            </Row>
          </Form>
        </div>
      ))}
      <div className="d-flex justify-content-between">
        <Button.Ripple
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
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
          //disabled={!isFormValid}
          id="btn-next"
          className="btn-next"
          onClick={() => stepper.next()}
        >
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ml-sm-25 ml-0"
          ></ArrowRight>
        </Button.Ripple>
      </div>

      <br></br>
      <br></br>
      <Button color="info" onClick={addRecord}>
        Add More Records
      </Button>
    </Fragment>
  );
}

export default AcademicRecords;
