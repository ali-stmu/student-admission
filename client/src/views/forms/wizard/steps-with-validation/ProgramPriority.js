import React, { useState } from "react";
import Select from "react-select";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useForm } from "react-hook-form";

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
const priorityOptions = [
  { label: "Computer Science", value: "cs" },
  { label: "Mathematics", value: "math" },
  { label: "Engineering", value: "eng" },
  { label: "Biology", value: "bio" },
  { label: "Psychology", value: "psy" },
  { label: "English", value: "engli" },
];

const ProgramPriority = ({ stepper, type }) => {
  const [priority1, setPriority1] = useState(null);
  const [priority2, setPriority2] = useState(null);
  const [priority3, setPriority3] = useState(null);

  const handleChangePriority1 = (selectedOption) => {
    setPriority1(selectedOption);
  };

  const handleChangePriority2 = (selectedOption) => {
    setPriority2(selectedOption);
  };

  const handleChangePriority3 = (selectedOption) => {
    setPriority3(selectedOption);
  };

  return (
    <div>
      <div>
        <h3>Select your priorities:</h3>
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={null}
          options={priorityOptions}
          value={priority1}
          onChange={handleChangePriority1}
          isClearable={true}
        />
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={null}
          options={priorityOptions}
          value={priority2}
          onChange={handleChangePriority2}
          isClearable={true}
        />
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={null}
          options={priorityOptions}
          value={priority3}
          onChange={handleChangePriority3}
          isClearable={true}
        />
      </div>
      <div>
        <h3>Selected priorities:</h3>
        <table className="table table-bordered table-responsive-lg">
          <thead>
            <tr>
              <th>Priority 1</th>
              <th>Priority 2</th>
              <th>Priority 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{priority1 ? priority1.label : ""}</td>
              <td>{priority2 ? priority2.label : ""}</td>
              <td>{priority3 ? priority3.label : ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
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
        <Button.Ripple type="submit" color="primary" className="btn-next">
          <span className="align-middle d-sm-inline-block d-none">Next</span>
          <ArrowRight
            size={14}
            className="align-middle ml-sm-25 ml-0"
          ></ArrowRight>
        </Button.Ripple>
      </div>
    </div>
  );
};

export default ProgramPriority;
