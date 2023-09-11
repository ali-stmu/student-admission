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
  const { control, handleSubmit, register, errors } = useForm();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const onSubmit = (data) => {
    // Handle form submission here
    stepper.next();
  };

  const previous = () => {
    stepper.previous();
  };

  useEffect(() => {
    // Update the current year state when the component mounts
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label className="test-name-label" for="testName">
          Test Name
        </Label>
        <Controller
          name="testName"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isClearable
              className="react-select"
              classNamePrefix="select"
              options={[]} // Your dropdown options should be here
            />
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
              placeholder="Enter Obtained Marks"
              innerRef={register({
                required: true,
                pattern: /^\d+$/,
                validate: (value) =>
                  parseInt(value) <= parseInt(data.totalMarks),
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
          readOnly // Set the readOnly attribute to make it readonly
          value={currentYear} // Set the value to the current year
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
          Next
        </Button.Ripple>
      </div>
    </Form>
  );
};

export default TestScore;
