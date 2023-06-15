import React, { Fragment, useState, useEffect } from "react";
import { selectThemeColors } from "@utils";
import { useForm } from "react-hook-form";
import axios from "axios";
import { BASE_URL } from "../../../../config";
import { BASE_URL_OF_SERVER } from "../../../../configForStudentPictureServer";

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
  const [uploadedDegrees, setUploadedDegrees] = useState([]);

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
      const rolesFromStorage = localStorage.getItem("StudentInfo");
      // Parse the JSON data
      const studentInfo = JSON.parse(rolesFromStorage);
      const TempUserid = studentInfo.user_id;
      setUserId(TempUserid);
    } catch (error) {
      console.error("Error fetching degree options:", error);
    }
  };
  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    // Parse the JSON data
    const studentInfo = JSON.parse(rolesFromStorage);
    const TempUserid = studentInfo.user_id;
    const user_id_temp = new FormData();
    user_id_temp.append("user_id", TempUserid);
    user_id_temp.append("useEffect", 1);
    //console.log(user_id_temp);
    axios
      .post(`${BASE_URL}educationAndDegreeController`, user_id_temp)
      .then((response) => {
        // Handle the API response here
        const responseData = JSON.parse(response.data);
        console.log(responseData);

        const url = `${BASE_URL_OF_SERVER}/`;
        console.log(url);
        const updatedRecords = responseData.map((item) => {
          return {
            resultStatus: item.result_status,
            qualification: item.degree_id,
            boardUniversity: item.institution_name,
            passingYear: item.passing_year.toString(),
            totalMarksCGPA: item.total_marks ? item.total_marks.toString() : "",
            obtainedMarksCGPA: item.obtained_marks
              ? item.obtained_marks.toString()
              : "",
            percentage: "",
            degree:   url + item.document_file_path

            //  degree: null,
          };

        });

        setRecords(updatedRecords);
        fetchDegreeOptions();
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }, []);
  const [degreeFiles, setDegreeFiles] = useState([]);
  

  const onSubmit = () => {
    trigger();
    if (isFormValid) {
      const formData = new FormData();

      records.forEach((record, index) => {
        formData.append(`resultStatus[${index}]`, record.resultStatus);
        formData.append(`qualification[${index}]`, record.qualification);
        formData.append(`boardUniversity[${index}]`, record.boardUniversity);
        formData.append(`passingYear[${index}]`, record.passingYear);
        formData.append(`totalMarksCGPA[${index}]`, record.totalMarksCGPA);
        formData.append(
          `obtainedMarksCGPA[${index}]`,
          record.obtainedMarksCGPA
        );
        formData.append(`percentage[${index}]`, record.percentage);
        formData.append(`degree[${index}]`, degreeFiles[index]);
      });
      formData.append("user_id", user_id);

      console.log(formData);

      axios
        .post(`${BASE_URL}educationAndDegreeController`, formData)
        .then((response) => {
          // Handle the API response here
          console.log(response.data);
          //stepper.next();
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
    } else {
      setShowValidationMessage(true);
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
    setDegreeFiles([...degreeFiles, null]);
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
      const file = e.target.files[0];
      const updatedDegreeFiles = [...degreeFiles];
      updatedDegreeFiles[index] = file;
      setDegreeFiles(updatedDegreeFiles);

      // Update uploaded degrees
      const updatedUploadedDegrees = [...uploadedDegrees];
      updatedUploadedDegrees[index] = URL.createObjectURL(file);
      setUploadedDegrees(updatedUploadedDegrees);
    }

    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      [name]: updatedValue,
      percentage: calculatePercentage(
        updatedRecords[index].totalMarksCGPA,
        updatedRecords[index].obtainedMarksCGPA
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

  //console.log(records);
  return (
    <Fragment>
      {records.map((record, index) => (
        <div key={index}>
          <h5 className="mb-0">Enter Academic Information</h5>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">Result Status*</Label>
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
                  Qualification*
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
                  Board/University*
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
                <Label className="form-label">Passing Year*</Label>
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
                <Label className="form-label">Total Marks/CGPA*</Label>
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
                <Label className="form-label">Obtained Marks/CGPA*</Label>
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
                  Upload Degree*
                </Label>
                <CustomInput
                  type="file"
                  name="degree"
                  id={`degree-${index}`}
                  onChange={(e) => handleRecordChange(e, index)}
                />
                {uploadedDegrees[index] && (
                  <div>
                    <strong>Uploaded Degree:</strong>
                    <img
                      src={uploadedDegrees[index]}
                      alt="Selected"
                      width="50"
                      height="80"
                    />
                  </div>
                )}
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
