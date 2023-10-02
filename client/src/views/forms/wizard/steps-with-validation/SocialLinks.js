import React, { Fragment, useState, useEffect } from "react";
import { selectThemeColors, isObjEmpty } from "@utils";
import { useForm } from "react-hook-form";
import axios from "axios";
import Select from "react-select";
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
} from "reactstrap";

function AcademicRecords({ stepper, type }) {
  const { register, errors, handleSubmit, trigger } = useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [showValidationMessage, setShowValidationMessage] = useState(false); // State to control the display of the validation message
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [user_id, setUserId] = useState();
  const [degreeFiles, setDegreeFiles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [boardUniversityOptions, setBoardUniversityOptions] = useState([]);
  const [uploadedDegrees, setUploadedDegrees] = useState([]);
  const [isOtherBoardUniversity, setIsOtherBoardUniversity] = useState([]);
  const [otherBoardUniversity, setOtherBoardUniversity] = useState([""]);

  const [records, setRecords] = useState([
    {
      resultStatus: "",
      qualification: "1",
      boardUniversity: "",
      passingYear: "",
      totalMarksCGPA: "",
      obtainedMarksCGPA: "",
      percentage: "",
      schoolName: "",
      schoolCountry: "",
      schoolCity: "",
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
      schoolName: "",
      schoolCountry: "",
      schoolCity: "",
      degree: null,
    },
  ]);
  const [obtainedGreaterThanTotalError, setObtainedGreaterThanTotalError] =
    useState(new Array(records.length).fill(false));
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
    // Call the fetchDegreeOptions function when the component mounts
    fetchDegreeOptions();
  }, []);
  const calculatePercentage = (total, obtained) => {
    return ((obtained / total) * 100).toFixed(2);
  };
  const fetchBoardUniversityOptions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}boards`);
      const data = response.data;
      // Add an "Other" option to the list of board/university options
      const options = [
        ...data.map((board) => ({
          value: board.board_name,
          label: board.board_name,
        })),
        {
          value: "Other",
          label: "Other",
        },
      ];
      setBoardUniversityOptions(options);
    } catch (error) {
      console.error("Error fetching board/university options:", error);
    }
  };

  useEffect(() => {
    fetchBoardUniversityOptions();

    fetch(`${BASE_URL}countries`) // Replace BASE_URL with your Laravel API URL
      .then((response) => response.json())
      .then((data) => {
        // Assuming your Laravel API returns the countries in the expected format
        const countryOptions = data.countries.map((country) => ({
          label: country.name,
          value: country.name,
          code: country.code,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => console.error(error));
  }, []);
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

        const updatedRecords = responseData.map((item) => {
          const totalMarks = item.total_marks ? parseInt(item.total_marks) : 0;
          const obtainedMarks = item.obtained_marks
            ? parseInt(item.obtained_marks)
            : 0;
          const percentage = calculatePercentage(totalMarks, obtainedMarks);

          return {
            resultStatus: item.result_status,
            qualification: item.degree_id,
            boardUniversity: item.institution_name,
            passingYear: item.passing_year.toString(),
            totalMarksCGPA: item.total_marks ? item.total_marks.toString() : "",
            obtainedMarksCGPA: item.obtained_marks
              ? item.obtained_marks.toString()
              : "",
            percentage: percentage,
            schoolName: item.school_name,
            schoolCountry: item.school_country,
            schoolCity: item.school_city,
            degree: item.document_file_path,
          };
        });
        if (updatedRecords.length > 0) {
          setIsFormValid(true);
          setRecords(updatedRecords);
        }
        fetchDegreeOptions();
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  }, []);

  const handleCountryChange = (selectedOption, index) => {
    setSelectedCountry(selectedOption);
    const updatedRecords = [...records];
    updatedRecords[index] = {
      ...updatedRecords[index],
      schoolCountry: selectedOption.value, // Assuming `value` holds the country value
    };
    setRecords(updatedRecords);
  };
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
        formData.append(`schoolName[${index}]`, record.schoolName);
        formData.append(`schoolCountry[${index}]`, record.schoolCountry);
        formData.append(`schoolCity[${index}]`, record.schoolCity);

        formData.append(`degree[${index}]`, degreeFiles[index]);
      });
      formData.append("user_id", user_id);

      console.log(formData);

      axios
        .post(`${BASE_URL}educationAndDegreeController`, formData)
        .then((response) => {
          // Handle the API response here
          console.log(response.data);
          stepper.next();
        })
        .catch((error) => {
          // Handle any errors that occurred during the request
          console.error(error);
        });
    } else {
      setShowValidationMessage(true);
    }
  };

  // const addRecord = () => {
  //   setRecords([
  //     ...records,
  //     {
  //       resultStatus: "",
  //       qualification: "",
  //       boardUniversity: "",
  //       passingYear: "",
  //       totalMarksCGPA: "",
  //       obtainedMarksCGPA: "",
  //       percentage: "",
  //       schoolName: "",
  //       schoolCountry: "",
  //       schoolCity: "",
  //       degree: null,
  //     },
  //   ]);
  //   setDegreeFiles([...degreeFiles, null]);
  // };
  // const deleteRecord = () => {
  //   const updatedRecords = [...records];
  //   updatedRecords.pop(); // Remove the last record from the array
  //   setRecords(updatedRecords);

  //   // Make an API call to delete the record
  //   const deletedRecord = records[records.length - 1]; // Assuming you want to delete the last record
  //   if (deletedRecord) {
  //     const { qualification } = deletedRecord;

  //     // Create an object with the parameters to send to the API
  //     const params = {
  //       user_id,
  //       qualification,
  //     };

  //     axios
  //       .post(`${BASE_URL}deleteRecordEndpoint`, { params })
  //       .then((response) => {
  //         // Handle the API response here
  //         console.log("Record deleted successfully.");
  //       })
  //       .catch((error) => {
  //         // Handle any errors that occurred during the request
  //         console.error("Error deleting record:", error);
  //       });
  //   }
  // };

  const handleRecordChange = (e, index) => {
    const { name, value, files } = e.target;
    let updatedValue = value;

    // Check if the changed field is "obtainedMarksCGPA"

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
      if (file) {
        updatedUploadedDegrees[index] = "Uploaded";
      } else {
        updatedUploadedDegrees[index] = null;
      }
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
    if (name === "obtainedMarksCGPA") {
      const totalMarks = parseFloat(updatedRecords[index].totalMarksCGPA);
      const obtainedMarks = parseFloat(updatedValue);

      if (obtainedMarks > totalMarks) {
        // Set error state to true
        const updatedErrorState = [...obtainedGreaterThanTotalError];
        updatedErrorState[index] = true;
        setObtainedGreaterThanTotalError(updatedErrorState);
      } else {
        // Set error state to false
        const updatedErrorState = [...obtainedGreaterThanTotalError];
        updatedErrorState[index] = false;
        setObtainedGreaterThanTotalError(updatedErrorState);
      }
    }
    const isFormValid = records.every((record) => {
      return (
        record.resultStatus &&
        record.qualification &&
        record.boardUniversity &&
        record.passingYear &&
        record.totalMarksCGPA &&
        record.obtainedMarksCGPA &&
        record.schoolName &&
        //record.schoolCountry &&
        record.schoolCity
      );
    });
    setIsFormValid(isFormValid);
    console.log(isFormValid);
    setRecords(updatedRecords);
  };
  const handleBoardUniversityChange = (selectedOption, index) => {
    console.log("selectedOption:", selectedOption);
    console.log("otherBoardUniversity:", otherBoardUniversity);

    const updatedRecords = [...records];
    if (selectedOption.value === "Other") {
      console.log("other chal raha");
      updatedRecords[index] = {
        ...updatedRecords[index],
        boardUniversity: otherBoardUniversity[index], // Assign the value of the "Other" textbox
      };
      setIsOtherBoardUniversity((prev) => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });
    } else {
      updatedRecords[index] = {
        ...updatedRecords[index],
        boardUniversity: selectedOption.value, // Assign the selected option value
      };
      setIsOtherBoardUniversity((prev) => {
        const updated = [...prev];
        updated[index] = false;
        return updated;
      });
    }
    console.log("updatedRecords:", updatedRecords);
    setRecords(updatedRecords);
  };

  console.log(otherBoardUniversity);
  console.log(records);

  return (
    <Fragment>
      {records.map((record, index) => (
        <div key={index}>
          <h5 className="mb-0">Enter Academic Information</h5>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label for="qualification" className="form-label">
                  Qualification<sup>*</sup>
                </Label>
                <Input
                  type="select"
                  name="qualification"
                  id="qualification"
                  value={
                    index === 0 ? "1" : index === 1 ? "2" : record.qualification
                  }
                  onChange={(e) => handleRecordChange(e, index)}
                  onClick={fetchDegreeOptions}
                  disabled={index < 2} // Disable for the first two records
                >
                  {degreeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Input>
              </FormGroup>

              <FormGroup tag={Col} md="4">
                <Label for={`boardUniversity-${index}`} className="form-label">
                  Board/University<sup>*</sup>
                  <br></br>
                  {record.boardUniversity}
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  options={boardUniversityOptions}
                  value={
                    isOtherBoardUniversity[index]
                      ? { label: "Other", value: "Other" }
                      : boardUniversityOptions.find(
                          (option) => option.value === record.boardUniversity
                        )
                  }
                  onChange={(selectedOption) =>
                    handleBoardUniversityChange(selectedOption, index)
                  }
                />
                {isOtherBoardUniversity[index] && (
                  <Input
                    type="text"
                    name={`otherBoardUniversity-${index}`}
                    id={`otherBoardUniversity-${index}`}
                    placeholder="Other Board/University"
                    value={otherBoardUniversity[index]}
                    onChange={(e) => {
                      const updated = [...otherBoardUniversity];
                      updated[index] = e.target.value;
                      setOtherBoardUniversity(updated);

                      // Trigger handleBoardUniversityChange when "Other" text box changes
                      handleBoardUniversityChange(
                        { label: "Other", value: "Other" },
                        index
                      );
                    }}
                  />
                )}
              </FormGroup>

              <FormGroup tag={Col} md="4">
                <Label className="form-label">
                  Passing Year<sup>*</sup>
                </Label>
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
            </Row>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">
                  Institute Name<sup>*</sup>
                </Label>
                <Input
                  type="text"
                  name="schoolName"
                  id="schoolName"
                  value={record.schoolName}
                  onChange={(e) => handleRecordChange(e, index)}
                ></Input>
              </FormGroup>
              <FormGroup tag={Col} md="4">
                <Label className="form-label" for={`landmark-${type}`}>
                  Institute Country<sup>*</sup>
                </Label>
                <Select
                  theme={selectThemeColors}
                  className="react-select"
                  classNamePrefix="select"
                  options={countries}
                  value={selectedCountry}
                  onChange={(selectedOption) =>
                    handleCountryChange(selectedOption, index)
                  }
                  isSearchable={true}
                />
              </FormGroup>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">
                  Institute City<sup>*</sup>
                </Label>
                <Input
                  type="text"
                  name="schoolCity"
                  id="schoolCity"
                  value={record.schoolCity}
                  onChange={(e) => handleRecordChange(e, index)}
                ></Input>
              </FormGroup>
            </Row>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">
                  Total Marks<sup>*</sup>
                </Label>
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
                <Label className="form-label">
                  Obtained Marks<sup>*</sup>
                </Label>
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
                {obtainedGreaterThanTotalError[index] && (
                  <div style={{ color: "red" }}>
                    Obtained Marks cannot be greater than Total Marks
                  </div>
                )}
              </FormGroup>
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
            </Row>
            <Row>
              <FormGroup tag={Col} md="4">
                <Label className="form-label">
                  Result Status<sup>*</sup>
                </Label>
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
                <Label for="degree" className="form-label">
                  Upload Degree<sup>*</sup>
                </Label>
                <CustomInput
                  type="file"
                  name="degree"
                  id={`degree-${index}`}
                  onChange={(e) => handleRecordChange(e, index)}
                />
                {uploadedDegrees[index] ||
                  (record.degree && (
                    <div
                      style={{
                        color: "green",
                      }}
                    >
                      <strong>Uploaded Degree:</strong>
                      {uploadedDegrees[index] === "Uploaded" ? (
                        <span>{uploadedDegrees[index]}</span>
                      ) : (
                        <img
                          src={uploadedDegrees[index]}
                          alt="Already Uploaded"
                          width="50"
                          height="80"
                        />
                      )}
                    </div>
                  ))}
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
          disabled={obtainedGreaterThanTotalError.includes(true)}
        >
          <span className="align-middle d-sm-inline-block d-none">
            Save & Next
          </span>
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
        {/* <Button.Ripple color="info" onClick={addRecord}>
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
        </Button.Ripple> */}
      </div>
    </Fragment>
  );
}

export default AcademicRecords;
