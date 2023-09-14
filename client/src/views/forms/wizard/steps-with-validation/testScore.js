import React, { useState, useEffect } from "react";
import { selectThemeColors, isObjEmpty } from "@utils";
import axios from "axios"; // Example using Axios
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
import CreatableSelect from "react-select/creatable";

const TestScore = ({ stepper, type }) => {
  const { control, handleSubmit, register, errors, watch, setValue } =
    useForm();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [TempUserid, setTempUserid] = useState(null);
  const [name, setname] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState(null);

  const [testScoreData, setTestScoreData] = useState(null);
  const skipToNextStepWithApiCall = async () => {
    try {
      // Make an API call to update the 'skip_test' column
      const response = await axios.post(`${BASE_URL}skip/${TempUserid}`);

      if (response.status === 200) {
        stepper.next(); // Move to the next step on successful API response
      } else {
        console.error("API call failed:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  const skipToNextStep = () => {
    skipToNextStepWithApiCall();
    stepper.next();
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
          const testData = response.data; // Assuming the API response is an object with the necessary data
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
  }, [TempUserid]); // Fetch data when TempUserid changes

  useEffect(() => {
    if (testScoreData && testScoreData.length > 0) {
      const firstTestData = testScoreData[0]; // Assuming there's only one object in the array
      setValue("testName", {
        value: firstTestData.test_name,
        label: firstTestData.test_name,
      });
      setValue("totalMarks", firstTestData.test_score_total);
      setValue("obtainedMarks", firstTestData.test_score);
      setValue("testYear", firstTestData.test_date);
      setAttachmentUrl(firstTestData.attachment_url); // Assuming the attachment URL is a property in your testScoreData object
    }
  }, [testScoreData, setValue]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("test_name", name?.value || ""); // Use the value property
      formData.append("test_score_total", data.totalMarks);
      formData.append("test_score", data.obtainedMarks);
      formData.append("test_date", data.testYear);
      formData.append("attachment", data.attachment[0]);
      formData.append("user_id", TempUserid);

      const response = await fetch(`${BASE_URL}savetestinfo`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        stepper.next();
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

  // Define options for the testName dropdown
  const testNameOptions = [
    { value: "mdcat", label: "MDCAT" },
    { value: "sat2", label: "SAT-II" },
    { value: "mcat", label: "MCAT" },
    { value: "ucat", label: "UCAT" },
    { value: "nums", label: "NUMS Entry Test" },
    { value: "state", label: "State Entry Test" },
    { value: "sindhmedical", label: "Sindh Medical Test" },

    // Add more options as needed
  ];
  console.log(testScoreData);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label className="test-name-label" for="testName">
          Test Name
        </Label>
        <Select
          theme={selectThemeColors}
          className="react-select"
          classNamePrefix="select"
          name="testName"
          id="testName"
          defaultValue=""
          options={testNameOptions}
          value={testNameOptions[0]}
          onChange={(value) => {
            console.log(value); // Add this line to check the selected value
            setValue("testName", value); // Set the value using react-hook-form
            setname(value);
          }}
        />
      </FormGroup>
      <Row>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="totalMarks">Total Marks</Label>
            <Input
              type="number"
              name="totalMarks"
              id="totalMarks"
              min="0"
              placeholder="Enter Total Marks"
              innerRef={register({ required: true, pattern: /^\d+$/ })}
            />
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="obtainedMarks">Obtained Marks</Label>
            <Input
              type="number"
              name="obtainedMarks"
              id="obtainedMarks"
              min="0"
              placeholder="Enter Obtained Marks"
              innerRef={register({
                required: true,
                pattern: /^\d+$/,
                validate: (value) =>
                  parseInt(value) <= parseInt(watch("totalMarks")), // Validate against totalMarks value
              })}
            />
            {errors.obtainedMarks && (
              <span className="text-danger">
                Please enter a valid number not greater than total marks.
              </span>
            )}
          </FormGroup>
        </Col>
      </Row>
      <FormGroup>
        <Label for="totalMarks">Test Year</Label>
        <Input
          type="text"
          name="testYear"
          id="testYear"
          placeholder="Test Year"
          innerRef={register({ required: true, pattern: /^\d+$/ })}
          readOnly
          value={currentYear}
        />
      </FormGroup>
      <FormGroup>
        <Label for="attachment">Attachment (PDF/Image)</Label>
        {attachmentUrl ? (
          <div>
            <b>Already Uploaded</b>
            <br />
            <CustomInput
              type="file"
              name="attachment"
              id="attachment"
              accept=".pdf, .jpg, .jpeg, .png"
              innerRef={register()}
            />
          </div>
        ) : (
          <CustomInput
            type="file"
            name="attachment"
            id="attachment"
            accept=".pdf, .jpg, .jpeg, .png"
            innerRef={register({ required: true })}
          />
        )}
        {/* Only show the error message if attachment is required and not already uploaded */}
        {errors.attachment && !attachmentUrl && (
          <span className="text-danger">Please select a valid file.</span>
        )}
      </FormGroup>

      <div className="d-flex justify-content-between">
        <Button.Ripple color="primary" className="btn-prev" onClick={previous}>
          Previous
        </Button.Ripple>
        <Button.Ripple type="submit" color="primary" className="btn-next">
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
  );
};

export default TestScore;
