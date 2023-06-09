import React, { Fragment, useState, useEffect } from "react";
import { selectThemeColors } from "@utils";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../../../../config";

import { ArrowRight, ArrowLeft, X, Plus } from "react-feather";

import {
  Label,
  FormGroup,
  Row,
  Col,
  Button,
  Form,
  Input,
  CustomInput,
  Select,
} from "reactstrap";

function AcademicRecords({ stepper, type }) {
  const { register, errors, handleSubmit, trigger } = useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showValidationMessage, setShowValidationMessage] = useState(false); // State to control the display of the validation message
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [user_id, setUserId] = useState();
  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    // Parse the JSON data
    const studentInfo = JSON.parse(rolesFromStorage);
    const TempUserid = studentInfo.user_id;
    setUserId(TempUserid);
  }, []);

  const [records, setRecords] = useState([
    {
      resultStatus: "",
      qualification: "1",
      boardUniversity: "",
      passingYear: "",
      totalMarksCGPA: "",
      obtainedMarksCGPA: "",
      percentage: "",
      degree: null,
    },
    {
      resultStatus: "",
      qualification: "2",
      boardUniversity: "",
      passingYear: "",
      totalMarksCGPA: "",
      obtainedMarksCGPA: "",
      percentage: "",
      degree: null,
    },
  ]);

  const fetchDegreeOptions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}degree`);
      const data = response.data;
      const options = data.map((degree) => ({
        value: degree.degree_id,
        label: degree.degree_name,
      }));
      setDegreeOptions(options);
    } catch (error) {
      console.error("Error fetching degree options:", error);
    }
  };
  const sendDataToAPI = () => {
    fetch(`${BASE_URL}educationAndDegreeController`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, records }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the API
        console.log(data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  const onSubmit = () => {
    trigger();
    if (isFormValid) {
      sendDataToAPI();
      stepper.next();
    } else {
      setShowValidationMessage(true); // Show the validation message when the button is clicked
    }
  };

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
        degree: null,
      },
    ]);
  };

  const deleteRecord = () => {
    const updatedRecords = [...records];
    updatedRecords.pop(); // Remove the last record from the array
    setRecords(updatedRecords);
  };
  const calculatePercentage = (total, obtained) => {
    return ((obtained / total) * 100).toFixed(2);
  };
  const handleRecordChange = (e, index) => {
    const { name, value, files } = e.target;
    let updatedValue = value;

    // Check if the changed field is "obtainedMarksCGPA"
    if (name === "obtainedMarksCGPA") {
      const totalMarks = records[index].totalMarksCGPA;
      // If obtained marks are greater than total marks, set it to the total marks
      if (parseFloat(value) > parseFloat(totalMarks)) {
        updatedValue = totalMarks;
      }
    }
    // Check if the changed field is "passingYear"
    if (name === "passingYear") {
      const currentYear = new Date().getFullYear();
      // If passing year is greater than current year, set it to the current year
      if (parseInt(value) > currentYear) {
        updatedValue = currentYear.toString();
      }
    }
    if (name === "degree") {
      const file = e.target.files[0]; // Assuming only one file is uploaded

      // Convert the file to a blob
      const reader = new FileReader();
      reader.onload = async () => {
        const blob = new Blob([reader.result], { type: file.type });

        const updatedRecords = [...records];
        updatedRecords[index] = {
          ...updatedRecords[index],
          degree: blob, // Set the degree property to the blob
        };
        setRecords(updatedRecords);
      };

      if (file) {
        reader.readAsArrayBuffer(file);
      }
    }

    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      [name]: updatedValue,
      percentage: calculatePercentage(
        updatedRecords[index].totalMarksCGPA,
        updatedValue
      ), // Calculate and assign the percentage
    };
    const isFormValid = records.every((record) => {
      return (
        record.resultStatus &&
        record.qualification &&
        record.boardUniversity &&
        record.passingYear &&
        record.totalMarksCGPA &&
        record.obtainedMarksCGPA
      );
    });
    setIsFormValid(isFormValid);

    setRecords(updatedRecords);
  };

  console.log(records);
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
                  <option value="awaited">Awiated</option>
                  <option value="declared">Declared</option>
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
                  onClick={fetchDegreeOptions}
                >
                  <option value=""></option>
                  {degreeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup tag={Col} md="4">
                <Label for="boardUniversity" className="form-label">
                  Board/University
                </Label>
                <Input
                  type="text"
                  name="boardUniversity"
                  id="boardUniversity"
                  value={record.boardUniversity}
                  onChange={(e) => handleRecordChange(e, index)}
                ></Input>
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
                  onKeyDown={(e) => {
                    if (
                      !/\d/.test(e.key) &&
                      e.key !== "Backspace" &&
                      e.key !== "Tab"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={4}
                />
              </FormGroup>

              <FormGroup tag={Col} md="4">
                <Label className="form-label">Total Marks/CGPA</Label>
                <Input
                  type="text"
                  name="totalMarksCGPA"
                  value={record.totalMarksCGPA}
                  onChange={(e) => handleRecordChange(e, index)}
                  onKeyPress={(e) => {
                    const keyCode = e.keyCode || e.which;
                    const keyValue = String.fromCharCode(keyCode);
                    // Allow only numbers, backspace, and dot
                    if (!/[\d.]/.test(keyValue) && keyCode !== 8) {
                      e.preventDefault();
                    }
                  }}
                />
              </FormGroup>

              <FormGroup tag={Col} md="4">
                <Label className="form-label">Obtained Marks/CGPA</Label>
                <Input
                  type="text"
                  name="obtainedMarksCGPA"
                  value={record.obtainedMarksCGPA}
                  onChange={(e) => handleRecordChange(e, index)}
                  onKeyPress={(e) => {
                    const keyCode = e.keyCode || e.which;
                    const keyValue = String.fromCharCode(keyCode);
                    // Allow only numbers, backspace, and dot
                    if (!/[\d.]/.test(keyValue) && keyCode !== 8) {
                      e.preventDefault();
                    }
                  }}
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
          id="btn-next"
          className="btn-next"
          onClick={onSubmit}
        >
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight size={14} className="align-middle ml-sm-25 ml-0" />
        </Button.Ripple>
      </div>
      {showValidationMessage && !isFormValid && (
        <h4 style={{ color: "red" }}>
          Please fill all fields to go on next step.
        </h4>
      )}
      <br></br>
      <br></br>
      <div className="d-flex justify-content-between">
        <Button.Ripple color="info" onClick={addRecord}>
          <Plus size={14} />
          <span className="align-middle ml-25">Add More Records</span>
        </Button.Ripple>
        <Button.Ripple
          color="danger"
          className="text-nowrap px-1"
          onClick={deleteRecord} // Call deleteRecord function to delete from the bottom
          outline
          disabled={records.length <= 2} // Disable the delete button if only two records remain
        >
          <X size={14} className="mr-50" />
          <span>Delete</span>
        </Button.Ripple>
      </div>
    </Fragment>
  );
}

export default AcademicRecords;
