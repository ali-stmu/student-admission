import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ArrowLeft, ArrowRight } from "react-feather";
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

const ProgramPriority = ({ stepper, type }) => {
  const [priority1, setPriority1] = useState(null);
  const [priority2, setPriority2] = useState(null);
  const [priority3, setPriority3] = useState(null);
  const [priority4, setPriority4] = useState(null);

  const [user_id, setUserId] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [programOptions, setProgramOptions] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true); // Initially, everything is disabled

  const fetchPriorities = (user_id) => {
    fetch(`${BASE_URL}autofilPriority?user_id=${user_id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setApiResponse(data);
        console.log(data);
        if (data && data.priority_names && Array.isArray(data.priority_names)) {
          // Assume the API response contains an array of selected priorities
          const priorities = data.priority_names || [];
          // Autofill the priorities if they exist
          if (priorities.length >= 1) {
            setPriority1(
              programOptions.find((option) => option.value === priorities[0])
            );
          } else {
            setPriority1("");
          }

          if (priorities.length >= 2) {
            setPriority2(
              programOptions.find((option) => option.value === priorities[1])
            );
          } else {
            setPriority2("");
          }

          if (priorities.length >= 3) {
            setPriority3(
              programOptions.find((option) => option.value === priorities[2])
            );
          } else {
            setPriority3("");
          }

          if (priorities.length >= 4) {
            setPriority4(
              programOptions.find((option) => option.value === priorities[3])
            );
          } else {
            setPriority4("");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching priorities:", error);
      });
  };
  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    const studentInfo = JSON.parse(rolesFromStorage);
    setUserId(studentInfo.user_id);
    fetchPriorities(studentInfo.user_id);

    fetch(`${BASE_URL}getPriority?user_id=${studentInfo.user_id}`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setApiResponse(data);
        console.log(data);
        if (data && data.Programs && Array.isArray(data.Programs)) {
          const options = data.Programs.map((program) => ({
            label: program.program_name,
            value: program.program_name,
          }));
          setProgramOptions(options);
        }
      })
      .catch((error) => {
        setProgramOptions([]); // or setProgramOptions({})
        console.error("Error fetching data:", error);
        // Set programOptions to an empty array or object here
      });
  }, [isDisabled]);

  const handleSubmit = () => {
    // Prepare the data to send to the API
    const priorities = [priority1, priority2, priority3, priority4].filter(
      (priority) => priority !== null
    );
    console.log(priorities);

    const dataToSend = {
      user_id: user_id,
      priorities:
        priorities && priorities.length > 0
          ? priorities.map((priority) => priority.value)
          : [],
    };

    console.log(dataToSend);

    // Make an HTTP POST request to save the priorities
    fetch(`${BASE_URL}savePriorities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Handle the response from the API as needed
        console.log("Response from API:", responseData);
        localStorage.setItem("priorities", JSON.stringify(priorities));
        stepper.next();
      })
      .catch((error) => {
        console.error("Error sending data to API:", error);
      });
  };

  const handleChangePriority1 = (selectedOption) => {
    setPriority1(selectedOption);
  };

  const handleChangePriority2 = (selectedOption) => {
    setPriority2(selectedOption);
  };

  const handleChangePriority3 = (selectedOption) => {
    setPriority3(selectedOption);
  };
  const handleChangePriority4 = (selectedOption) => {
    setPriority4(selectedOption);
  };
  return (
    <div>
      <div>
        <h3>Select your priorities:</h3>
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={null}
          options={programOptions}
          value={priority1}
          onChange={handleChangePriority1}
          isClearable={true}
          isDisabled={isDisabled}
        />
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={null}
          options={programOptions}
          value={priority2}
          onChange={handleChangePriority2}
          isClearable={true}
          isDisabled={isDisabled}
        />
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={null}
          options={programOptions}
          value={priority3}
          onChange={handleChangePriority3}
          isClearable={true}
          isDisabled={isDisabled}
        />
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={null}
          options={programOptions}
          value={priority4}
          onChange={handleChangePriority4}
          isClearable={true}
          isDisabled={isDisabled}
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
              <th>Priority 4</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{priority1 ? priority1.label : ""}</td>
              <td>{priority2 ? priority2.label : ""}</td>
              <td>{priority3 ? priority3.label : ""}</td>
              <td>{priority4 ? priority4.label : ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between">
        <Button.Ripple
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
          //disabled={isDisabled}
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
          color="danger"
          onClick={() => setIsDisabled(!isDisabled)}
        >
          {isDisabled ? "Click Here To show Priority" : "Clicked..."}
        </Button.Ripple>
        <Button.Ripple
          type="submit"
          color="primary"
          className="btn-next"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          <span className="align-middle d-sm-inline-block d-none">
            Save & Next
          </span>
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
