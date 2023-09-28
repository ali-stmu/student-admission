import React, { useState, useEffect } from "react";
import { selectThemeColors } from "@utils";
import axios from "axios";
import Select from "react-select";
import { useForm } from "react-hook-form";
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
} from "reactstrap";

const TestScore = ({ stepper, type }) => {
  const { control, handleSubmit, register, errors, watch, setValue } =
    useForm();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [TempUserid, setTempUserid] = useState(null);
  const [name, setname] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  const [testScoreData, setTestScoreData] = useState([]);
  const [records, setRecords] = useState([
    {
      testName: "",
      totalMarks: 0,
      obtainedMarks: 0,
      biototalMarks: 0,
      bioobtainedMarks: 0,
      chemtotalMarks: 0,
      chemobtainedMarks: 0,
      phytotalMarks: 0,
      phyobtainedMarks: 0,
      testYear: "",
      testCity: "",
      testRegno: "",
      attachment: null,
    },
  ]);
  const [attachmentUrls, setAttachmentUrls] = useState({});
  const [selectedTestNames, setSelectedTestNames] = useState(
    Array(records.length).fill(null)
  );
  const testNameOptions = [
    { value: "mdcat", label: "MDCAT" },
    { value: "sat2", label: "SAT-II" },
    { value: "mcat", label: "MCAT" },
    { value: "ucat", label: "UCAT" },
    // Add more options as needed
  ];

  const skipToNextStepWithApiCall = async () => {
    try {
      // Make an API call to update the 'skip_test' column
      const response = await axios.post(`${BASE_URL}skip/${TempUserid}`);

      if (response.status === 200) {
        stepper.next(); // Move to the next step on a successful API response
      } else {
        console.error("API call failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const previous = () => {
    stepper.previous();
  };
  const skipToNextStep = () => {
    skipToNextStepWithApiCall();
  };

  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    const studentInfo = JSON.parse(rolesFromStorage);
    setTempUserid(studentInfo.user_id);
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make an API call to fetch test score data for the current user
        const response = await axios.get(`${BASE_URL}scores/${TempUserid}`);

        if (response.status === 200) {
          const testData = response.data; // Assuming the API response is an array of test score data
          setTestScoreData(testData);
        } else {
          console.error(
            "API call failed:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, [TempUserid]);

  useEffect(() => {
    if (testScoreData && testScoreData.length > 0) {
      // Assuming there's only one object in the array
      const firstTestData = testScoreData[0];
      setValue(`testName-0`, {
        value: firstTestData.test_name,
        label: firstTestData.test_name,
      });
      setValue(`totalMarks-0`, firstTestData.test_score_total);
      setValue(`obtainedMarks-0`, firstTestData.test_score);
      setValue(`testYear-0`, firstTestData.test_date);

      // Set the attachment URL for the first record
      setAttachmentUrls({
        ...attachmentUrls,
        [0]: firstTestData.attachment_url,
      });

      // Set attachment URLs for subsequent records if available
      for (let i = 1; i < testScoreData.length; i++) {
        const testData = testScoreData[i];
        setAttachmentUrls((prevUrls) => ({
          ...prevUrls,
          [i]: testData.attachment_url,
        }));
      }
    }
  }, [testScoreData, setValue]);
  useEffect(() => {
    if (testScoreData && testScoreData.length > 0) {
      const updatedRecords = [...records];

      testScoreData.forEach((testData, index) => {
        updatedRecords[index] = {
          ...updatedRecords[index],
          attachment: testData.attachment_url,
        };
      });

      setRecords(updatedRecords);
    }
  }, [testScoreData]);

  const onSubmit = async (data) => {
    try {
      // Create a new FormData object
      const formData = new FormData();

      // Append user_id to the form data
      formData.append("user_id", TempUserid);

      // Iterate through the records and add them to the FormData object
      records.forEach((record, index) => {
        formData.append(`records[${index}][test_name]`, name.value);
        formData.append(
          `records[${index}][test_date]`,
          data[`testYear-${index}`]
        );
        formData.append(
          `records[${index}][test_city]`,
          data[`testCity-${index}`]
        );
        formData.append(
          `records[${index}][test_reg_no]`,
          data[`testRegNo-${index}`]
        );

        // Check the test name and set total score and subject scores accordingly
        if (selectedTestNames[index] === "mdcat") {
          formData.append(
            `records[${index}][test_score_total]`,
            data[`totalMarks-${index}`]
          );
          formData.append(
            `records[${index}][test_score_obtained]`,
            data[`obtainedMarks-${index}`]
          );
        } else {
          formData.append(
            `records[${index}][test_score_bio]`,
            data[`biototalMarks-${index}`]
          );
          formData.append(
            `records[${index}][test_score_chem]`,
            data[`chemtotalMarks-${index}`]
          );
          formData.append(
            `records[${index}][test_score_phy_total]`,
            data[`phytotalMarks-${index}`]
          );
          formData.append(
            `records[${index}][test_score_phy_obtained]`,
            data[`phyobtainedMarks-${index}`]
          );
          formData.append(
            `records[${index}][test_score_chem_obtained]`,
            data[`chemobtainedMarks-${index}`]
          );
          formData.append(
            `records[${index}][test_score_bio_obtained]`,
            data[`bioobtainedMarks-${index}`]
          );
        }

        // Append the file if it exists
        const fileInput = data[`attachment-${index}`];
        if (fileInput && fileInput[0]) {
          formData.append(`records[${index}][attachment]`, fileInput[0]);
        }
      });

      console.log(formData);

      // Make an API request to send the FormData to the server
      const response = await axios.post(
        `${BASE_URL}savetestinfo`, // Replace with your actual API endpoint
        formData, // Send the FormData object
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart form data
          },
        }
      );

      if (response.status === 200) {
        stepper.next(); // Move to the next step on a successful API response
      } else {
        console.error("API call failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const deleteRecord = (indexToDelete) => {
    // Create a copy of the records array without the record to delete
    const updatedRecords = records.filter(
      (record, index) => index !== indexToDelete
    );

    // Update the records state with the updated array
    setRecords(updatedRecords);
  };
  const addRecord = () => {
    setRecords([
      ...records,
      {
        testName: "",
        totalMarks: 0,
        obtainedMarks: 0,
        biototalMarks: 0,
        bioobtainedMarks: 0,
        chemtotalMarks: 0,
        chemobtainedMarks: 0,
        phytotalMarks: 0,
        phyobtainedMarks: 0,
        testYear: "",
        attachment: null,
      },
    ]);
  };
  const validateObtainedMarks = (value, index) => {
    const totalMarks = watch(`totalMarks-${index}`);
    return parseFloat(value) <= parseFloat(totalMarks);
  };

  const validateBioObtainedMarks = (value, index) => {
    const bioTotalMarks = watch(`biototalMarks-${index}`);
    return parseFloat(value) <= parseFloat(bioTotalMarks);
  };

  const validateChemObtainedMarks = (value, index) => {
    const chemTotalMarks = watch(`chemtotalMarks-${index}`);
    return parseFloat(value) <= parseFloat(chemTotalMarks);
  };

  const validatePhyObtainedMarks = (value, index) => {
    const phyTotalMarks = watch(`phytotalMarks-${index}`);
    return parseFloat(value) <= parseFloat(phyTotalMarks);
  };

  return (
    <div>
      {records.map((record, index) => (
        <Form key={index} onSubmit={handleSubmit(onSubmit)}>
          <h5 className="mb-0">Please Provide Test Information</h5>
          <FormGroup>
            <Label className="test-name-label" for={`testName-${index}`}>
              Test Name
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select"
              classNamePrefix="select"
              name={`testName-${index}`}
              id={`testName-${index}`}
              defaultValue={testNameOptions.find(
                (option) => option.value === record.testName
              )}
              options={testNameOptions}
              onChange={(value) => {
                setValue(`testName-${index}`, value);
                setname(value);
                setSelectedTestNames((prevNames) => {
                  const newNames = [...prevNames];
                  newNames[index] = value.value;
                  return newNames;
                });
              }}
            />
          </FormGroup>
          {/* Show a message based on the selected test name */}
          {selectedTestNames[index] === "mdcat" ||
          selectedTestNames[index] === null ? (
            <Row>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for={`totalMarks-${index}`}>Total Marks</Label>
                  <Input
                    type="number"
                    name={`totalMarks-${index}`}
                    id={`totalMarks-${index}`}
                    placeholder="Total Marks"
                    innerRef={register({ required: true })}
                  />
                  {errors[`totalMarks-${index}`] && (
                    <span className="text-danger">
                      Total Marks is required.
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col md="6" sm="12">
                <FormGroup>
                  <Label for={`obtainedMarks-${index}`}>Obtained Marks</Label>
                  <Input
                    type="number"
                    name={`obtainedMarks-${index}`}
                    id={`obtainedMarks-${index}`}
                    placeholder="Obtained Marks"
                    innerRef={register({
                      required: true,
                      validate: (value) => validateObtainedMarks(value, index),
                    })}
                  />
                  {errors[`obtainedMarks-${index}`] &&
                    errors[`obtainedMarks-${index}`].type === "required" && (
                      <span className="text-danger">
                        Obtained Marks is required.
                      </span>
                    )}
                  {errors[`obtainedMarks-${index}`] &&
                    errors[`obtainedMarks-${index}`].type === "validate" && (
                      <span className="text-danger">
                        Obtained Marks cannot be greater than Total Marks.
                      </span>
                    )}
                </FormGroup>
              </Col>
            </Row>
          ) : (
            <>
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for={`biototalMarks-${index}`}>
                      Biology Total Marks
                    </Label>
                    <Input
                      type="number"
                      name={`biototalMarks-${index}`}
                      id={`biototalMarks-${index}`}
                      placeholder="Biology Total Marks"
                      innerRef={register({ required: true })}
                    />
                    {errors[`biototalMarks-${index}`] && (
                      <span className="text-danger">
                        Biology Total Marks is required.
                      </span>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for={`bioobtainedMarks-${index}`}>
                      Biology Obtained Marks
                    </Label>
                    <Input
                      type="number"
                      name={`bioobtainedMarks-${index}`}
                      id={`bioobtainedMarks-${index}`}
                      placeholder="Biology Obtained Marks"
                      innerRef={register({
                        required: true,
                        validate: (value) =>
                          validateBioObtainedMarks(value, index),
                      })}
                    />
                    {errors[`bioobtainedMarks-${index}`] &&
                      errors[`bioobtainedMarks-${index}`].type ===
                        "required" && (
                        <span className="text-danger">
                          Biology Obtained Marks is required.
                        </span>
                      )}
                    {errors[`bioobtainedMarks-${index}`] &&
                      errors[`bioobtainedMarks-${index}`].type ===
                        "validate" && (
                        <span className="text-danger">
                          Biology Obtained Marks cannot be greater than Biology
                          Total Marks.
                        </span>
                      )}
                  </FormGroup>
                </Col>
              </Row>{" "}
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for={`chemtotalMarks-${index}`}>
                      Chemistry Total Marks
                    </Label>
                    <Input
                      type="number"
                      name={`chemtotalMarks-${index}`}
                      id={`chemtotalMarks-${index}`}
                      placeholder="Chemistry Total Marks"
                      innerRef={register({ required: true })}
                    />
                    {errors[`chemtotalMarks-${index}`] && (
                      <span className="text-danger">
                        Chemistry Total Marks is required.
                      </span>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for={`chemobtainedMarks-${index}`}>
                      Chemistry Obtained Marks
                    </Label>
                    <Input
                      type="number"
                      name={`chemobtainedMarks-${index}`}
                      id={`chemobtainedMarks-${index}`}
                      placeholder="Chemistry Obtained Marks"
                      innerRef={register({
                        required: true,
                        validate: (value) =>
                          validateChemObtainedMarks(value, index),
                      })}
                    />
                    {errors[`chemobtainedMarks-${index}`] &&
                      errors[`chemobtainedMarks-${index}`].type ===
                        "required" && (
                        <span className="text-danger">
                          Chemistry Obtained Marks is required.
                        </span>
                      )}
                    {errors[`chemobtainedMarks-${index}`] &&
                      errors[`chemobtainedMarks-${index}`].type ===
                        "validate" && (
                        <span className="text-danger">
                          Chemistry Obtained Marks cannot be greater than
                          Chemistry Total Marks.
                        </span>
                      )}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for={`phytotalMarks-${index}`}>
                      Physics Total Marks
                    </Label>
                    <Input
                      type="number"
                      name={`phytotalMarks-${index}`}
                      id={`phytotalMarks-${index}`}
                      placeholder="Physics Total Marks"
                      innerRef={register({ required: true })}
                    />
                    {errors[`phytotalMarks-${index}`] && (
                      <span className="text-danger">
                        Physics Total Marks is required.
                      </span>
                    )}
                  </FormGroup>
                </Col>
                <Col md="6" sm="12">
                  <FormGroup>
                    <Label for={`phyobtainedMarks-${index}`}>
                      Physics Obtained Marks
                    </Label>
                    <Input
                      type="number"
                      name={`phyobtainedMarks-${index}`}
                      id={`phyobtainedMarks-${index}`}
                      placeholder="Physics Obtained Marks"
                      innerRef={register({
                        required: true,
                        validate: (value) =>
                          validatePhyObtainedMarks(value, index),
                      })}
                    />
                    {errors[`phyobtainedMarks-${index}`] &&
                      errors[`phyobtainedMarks-${index}`].type ===
                        "required" && (
                        <span className="text-danger">
                          Physics Obtained Marks is required.
                        </span>
                      )}
                    {errors[`phyobtainedMarks-${index}`] &&
                      errors[`phyobtainedMarks-${index}`].type ===
                        "validate" && (
                        <span className="text-danger">
                          Physics Obtained Marks cannot be greater than Physics
                          Total Marks.
                        </span>
                      )}
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}

          <FormGroup>
            <Label for={`testYear-${index}`}>Test Year</Label>
            <Input
              type="number"
              name={`testYear-${index}`}
              id={`testYear-${index}`}
              placeholder="Test Year"
              innerRef={register({ required: true })}
              //disabled={selectedTestNames[index] === "mdcat"}
            />
            {errors[`testYear-${index}`] && (
              <span className="text-danger">Test Year is required.</span>
            )}
          </FormGroup>
          <Row>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for={`testCity-${index}`}>Test City</Label>
                <Input
                  type="text"
                  name={`testCity-${index}`}
                  id={`testCity-${index}`}
                  placeholder="Test City"
                  innerRef={register({ required: true })}
                  //disabled={selectedTestNames[index] === "mdcat"}
                />
                {errors[`testCity-${index}`] && (
                  <span className="text-danger">Test City is required.</span>
                )}
              </FormGroup>
            </Col>
            <Col md="6" sm="12">
              <FormGroup>
                <Label for={`testRegNo-${index}`}>Test Reg No</Label>
                <Input
                  type="text"
                  name={`testRegNo-${index}`}
                  id={`testRegNo-${index}`}
                  placeholder="Test Reg No"
                  innerRef={register({ required: true })}
                  //disabled={selectedTestNames[index] === "mdcat"}
                />
                {errors[`testRegNo-${index}`] && (
                  <span className="text-danger">Test Reg No is required.</span>
                )}
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for={`attachment-${index}`}>Attachment (PDF/Image)</Label>
            {record.attachment ? (
              <div>
                <b style={{ color: "green" }}>Already Uploaded</b> <br />
                <CustomInput
                  type="file"
                  name={`attachment-${index}`}
                  id={`attachment-${index}`}
                  accept=".pdf, .jpg, .jpeg, .png"
                  innerRef={register()}
                />
              </div>
            ) : (
              <CustomInput
                type="file"
                name={`attachment-${index}`}
                id={`attachment-${index}`}
                accept=".pdf, .jpg, .jpeg, .png"
                innerRef={register({ required: true })}
              />
            )}
            {/* Only show the error message if attachment is required and not already uploaded */}
            {errors[`attachment-${index}`] && !record.attachment && (
              <span className="text-danger">Please select a valid file.</span>
            )}
          </FormGroup>

          <div className="d-flex justify-content-between">
            <Button.Ripple
              color="primary"
              className="btn-prev"
              onClick={previous}
            >
              <ArrowLeft
                size={14}
                className="align-middle mr-sm-25 mr-0"
              ></ArrowLeft>
              Previous
            </Button.Ripple>
            {/* <Button.Ripple color="info" onClick={addRecord}>
              <Plus size={14} />
              <span className="align-middle ml-25">Add More Records</span>
            </Button.Ripple> */}
            <Button.Ripple
              color="secondary"
              className="btn-skip"
              onClick={skipToNextStep}
            >
              Skip
            </Button.Ripple>
            <Button.Ripple type="submit" color="primary">
              Save & Next
              <ArrowRight size={14} className="align-middle ml-sm-25 ml-0" />
            </Button.Ripple>

            {/* <Button.Ripple
              color="danger"
              className="text-nowrap px-1"
              onClick={() => deleteRecord(index)}
              outline
              disabled={records.length <= 1} // Disable the delete button if only two records remain
            >
              <X size={14} className="mr-50" />
              <span>Delete</span>
            </Button.Ripple> */}
          </div>
          <br></br>
        </Form>
      ))}
    </div>
  );
};

export default TestScore;
