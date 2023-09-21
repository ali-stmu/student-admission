import React, { useState, useEffect } from "react";
import { selectThemeColors } from "@utils";
import axios from "axios";
import Select from "react-select";
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
      testYear: "",
      attachment: null,
    },
  ]);

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
      const firstTestData = testScoreData[0]; // Assuming there's only one object in the array
      setValue("testName-0", {
        value: firstTestData.test_name,
        label: firstTestData.test_name,
      });
      setValue("totalMarks-0", firstTestData.test_score_total);
      setValue("obtainedMarks-0", firstTestData.test_score);
      setValue("testYear-0", firstTestData.test_date);
      setAttachmentUrl(firstTestData.attachment_url); // Assuming the attachment URL is a property in your testScoreData object
    }
  }, [testScoreData, setValue]);
  const onSubmit = async (data) => {
    try {
      // Create an array to store the records
      const recordsArray = [];

      // Iterate through the records and add them to the array
      records.forEach((record, index) => {
        recordsArray.push({
          test_name: data[`testName-${index}`],
          test_score: data[`obtainedMarks-${index}`],
          test_score_total: data[`totalMarks-${index}`],
          test_date: data[`testYear-${index}`],
          attachment_url: data[`attachment-${index}`], // Adjust the field name accordingly
        });
      });

      // Include TempUserid as user_id in the form data
      const formData = new FormData();
      formData.append("user_id", TempUserid);
      formData.append("records", JSON.stringify(recordsArray));

      // Make an API request to send the formData to the server
      const response = await axios.post(
        `${BASE_URL}save-test-scores`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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

  const addRecord = () => {
    setRecords([
      ...records,
      {
        testName: "",
        totalMarks: 0,
        obtainedMarks: 0,
        testYear: "",
        attachment: null,
      },
    ]);
  };

  return (
    <div>
      {records.map((record, index) => (
        <Form key={index} onSubmit={handleSubmit(onSubmit)}>
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
              defaultValue=""
              options={testNameOptions}
              value={testNameOptions.find(
                (option) => option.value === record.testName
              )}
              onChange={(value) => {
                setValue(`testName-${index}`, value);
                setname(value);
              }}
            />
          </FormGroup>
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
                  <span className="text-danger">Total Marks is required.</span>
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
                  innerRef={register({ required: true })}
                />
                {errors[`obtainedMarks-${index}`] && (
                  <span className="text-danger">
                    Obtained Marks is required.
                  </span>
                )}
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for={`testYear-${index}`}>Test Year</Label>
            <Input
              type="number"
              name={`testYear-${index}`}
              id={`testYear-${index}`}
              placeholder="Test Year"
              innerRef={register({ required: true })}
            />
            {errors[`testYear-${index}`] && (
              <span className="text-danger">Test Year is required.</span>
            )}
          </FormGroup>
          {/* Add the attachment field here */}
          {/* ... */}
          <div className="d-flex justify-content-between">
            <Button.Ripple
              color="primary"
              className="btn-prev"
              onClick={previous}
            >
              Previous
            </Button.Ripple>
            <Button.Ripple color="primary" onClick={addRecord}>
              Add More Records
            </Button.Ripple>
            <Button.Ripple type="submit" color="primary">
              Save & Next
            </Button.Ripple>
            <Button.Ripple
              color="secondary"
              className="btn-skip"
              onClick={skipToNextStep}
            >
              Skip
            </Button.Ripple>
          </div>
        </Form>
      ))}
    </div>
  );
};

export default TestScore;
