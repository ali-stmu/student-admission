import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
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
  const { control, handleSubmit, register, errors, watch } = useForm();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [TempUserid, setTempUserid] = useState(null);

  const skipToNextStep = () => {
    stepper.next();
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("test_name", data.testName?.value || ""); // Use the value property
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

  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    const studentInfo = JSON.parse(rolesFromStorage);
    setTempUserid(studentInfo.user_id);
    setCurrentYear(new Date().getFullYear());
  }, []);

  // Define options for the testName dropdown
  const testNameOptions = [
    { value: "Option1", label: "Option 1" },
    { value: "Option2", label: "Option 2" },
    // Add more options as needed
  ];
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label className="test-name-label" for="testName">
          Test Name
        </Label>
        <Controller
          name="testName"
          id="testName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <CreatableSelect
                {...field}
                isClearable
                className="react-select"
                classNamePrefix="select"
                options={testNameOptions}
                onChange={(value) => {
                  console.log(value); // Add this line to check the selected value
                }}
              />
            </>
          )}
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
        <CustomInput
          type="file"
          name="attachment"
          id="attachment"
          accept=".pdf, .jpg, .jpeg, .png"
          innerRef={register({ required: true })}
        />
        {errors.attachment && (
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
