import React, { useRef, useState, useEffect } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  CustomInput,
} from "reactstrap";
// import UniLogo from "../../../../assets/images/logo/ShifaLogo.png";
// import BankLogo from "../../../../assets/images/logo/bank_logo.png";
import { ArrowRight, ArrowLeft, X, Plus } from "react-feather";
import SignleChallan from "./signleChallan";
import { BASE_URL } from "../../../../config";
import axios from "axios";

const Challan = ({ stepper, type }) => {
  const contentRef = useRef(null);
  const [challanAttachment, setChallanAttachment] = useState(null);
  const [challanPaidDate, setChallanPaidDate] = useState("");
  const [userID, setUserId] = useState("");
  const [priorities, setPriorities] = useState(["Loading..."]);
  const [prioritiesButtons, setPrioritiesButtons] = useState([]);

  useEffect(() => {
    const rolesFromStorage = localStorage.getItem("StudentInfo");
    const studentInfo = JSON.parse(rolesFromStorage);
    console.log(studentInfo.user_id);
    setUserId(studentInfo.user_id);
  }, []);

  const getStoredPriorities = () => {
    const storedPriorities = localStorage.getItem("priorities");
    return storedPriorities ? JSON.parse(storedPriorities) : [];
  };
  const generatePdfffff = async (program) => {
    try {
      console.log(userID);
      const response = await axios.get(`${BASE_URL}generate-pdf`, {
        responseType: "blob", // Important to handle binary data (PDF)
        params: { userID, program }, // Include user_id as a query parameter
      });

      // Create a blob URL for the PDF and initiate a download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Voucher.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };
  const loadChallan = () => {
    // Get priorities from local storage
    const storedPriorities = getStoredPriorities();

    // Create buttons based on priorities
    const buttons = storedPriorities.map((priority, index) => (
      <div
        onClick={() => generatePdfffff(priority.label)}
        key={index}
        style={{ marginBottom: "10px" }}
      >
        <Button.Ripple color="info">
          Download Challan {priority.label}
        </Button.Ripple>
      </div>
    ));

    // Display the buttons (you can replace a div with a suitable container)
    // For example, create a new state to store the buttons and render them in the JSX
    setPrioritiesButtons(buttons);
  };

  const onSubmit = () => {
    // Access challanAttachment and challanPaidDate values here and perform your submission logic
    console.log("Challan Attachment:", challanAttachment);
    console.log("Challan Paid Date:", challanPaidDate);
  };

  const tableContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "10px",
    overflowX: "auto",
    width: "100%",
    maxWidth: "100%", // Adjust this value as needed
    minWidth: "100%", // Adjust this value as needed
    margin: "0 auto",
  };

  return (
    <div>
      <div style={{ backgroundColor: "#FFFFFF" }} ref={contentRef}>
        <div style={tableContainerStyle}></div>
      </div>
      <Button.Ripple color="primary" onClick={loadChallan}>
        Load Challan(s)
      </Button.Ripple>
      <h1>Challan Details:</h1>
      <div>{prioritiesButtons}</div>
      <Row>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="challanAttachment">Challan Attachment:</Label>
            <CustomInput
              type="file"
              id="challanAttachment"
              accept=".pdf, .jpg, .jpeg, .png"
              onChange={(e) => setChallanAttachment(e.target.files[0])}
            />
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="challanPaidDate">Challan Paid Date:</Label>
            <Input
              type="date"
              id="challanPaidDate"
              value={challanPaidDate}
              onChange={(e) => setChallanPaidDate(e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>
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
          <span className="align-middle d-sm-inline-block d-none">
            Final Submit
          </span>
          <ArrowRight size={14} className="align-middle ml-sm-25 ml-0" />
        </Button.Ripple>
      </div>
    </div>
  );
};
export default Challan;
