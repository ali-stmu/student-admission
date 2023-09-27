import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  CustomInput,
  FormFeedback, // Add this import
} from "reactstrap";
import { ArrowRight, ArrowLeft } from "react-feather";
import SignleChallan from "./signleChallan";
import { BASE_URL } from "../../../../config";
import axios from "axios";

const Challan = ({ stepper, type }) => {
  const contentRef = useRef(null);
  const [challanAttachment, setChallanAttachment] = useState(null);
  const [challanPaidDate, setChallanPaidDate] = useState("");
  const [userID, setUserId] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [challanAttachmentError, setChallanAttachmentError] = useState(false);
  const [challanPaidDateError, setChallanPaidDateError] = useState(false);
  const [bankNameError, setBankNameError] = useState(false);
  const [branchCodeError, setBranchCodeError] = useState(false);
  const [transactionIDError, setTransactionIDError] = useState(false);
  const [modeOfPaymentError, setModeOfPaymentError] = useState(false);
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

  const generatePdf = async (program) => {
    try {
      console.log(userID);
      const response = await axios.get(`${BASE_URL}generate-pdf`, {
        responseType: "blob",
        params: { userID, program },
      });

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
    const storedPriorities = getStoredPriorities();
    const buttons = storedPriorities.map((priority, index) => (
      <div
        onClick={() => generatePdf(priority.label)}
        key={index}
        style={{ marginBottom: "10px" }}
      >
        <Button.Ripple color="info">
          Download Challan {priority.label}
        </Button.Ripple>
      </div>
    ));
    setPrioritiesButtons(buttons);
  };

  const validateForm = () => {
    let isValid = true;

    if (!challanAttachment) {
      setChallanAttachmentError(true);
      isValid = false;
    } else {
      setChallanAttachmentError(false);
    }

    if (!challanPaidDate) {
      setChallanPaidDateError(true);
      isValid = false;
    } else {
      setChallanPaidDateError(false);
    }

    if (!bankName) {
      setBankNameError(true);
      isValid = false;
    } else {
      setBankNameError(false);
    }

    if (!branchCode) {
      setBranchCodeError(true);
      isValid = false;
    } else {
      setBranchCodeError(false);
    }

    if (!transactionID) {
      setTransactionIDError(true);
      isValid = false;
    } else {
      setTransactionIDError(false);
    }

    if (!modeOfPayment) {
      setModeOfPaymentError(true);
      isValid = false;
    } else {
      setModeOfPaymentError(false);
    }

    return isValid;
  };

  const onSubmit = () => {
    if (validateForm()) {
      // Create a FormData object
      const formData = new FormData();

      // Append all the form data values to the FormData object
      formData.append("challanAttachment", challanAttachment);
      formData.append("challanPaidDate", challanPaidDate);
      formData.append("userID", userID);
      formData.append("bankName", bankName);
      formData.append("branchCode", branchCode);
      formData.append("transactionID", transactionID);
      formData.append("modeOfPayment", modeOfPayment);
      // Send the FormData to the API using Axios
      axios
        .post(`${BASE_URL}savevoucher`, formData)
        .then((response) => {
          // Handle success
          console.log("Voucher saved successfully", response);
        })
        .catch((error) => {
          // Handle error
          console.error("Error saving voucher:", error);
        });
    } else {
      // Display an error message or handle the error as needed
    }
  };

  const tableContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "10px",
    overflowX: "auto",
    width: "100%",
    maxWidth: "100%",
    minWidth: "100%",
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
              required
              invalid={challanAttachmentError}
            />
            <FormFeedback>Please provide a Challan Attachment.</FormFeedback>
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
              required
              invalid={challanPaidDateError}
            />
            <FormFeedback>Please provide a Challan Paid Date.</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="bankName">Bank Name:</Label>
            <Input
              type="text"
              id="bankName"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
              invalid={bankNameError}
            />
            <FormFeedback>Please provide a Bank Name.</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="branchCode">Branch Code:</Label>
            <Input
              type="text"
              id="branchCode"
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              required
              invalid={branchCodeError}
            />
            <FormFeedback>Please provide a Branch Code.</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="transactionID">Transaction ID:</Label>
            <Input
              type="text"
              id="transactionID"
              value={transactionID}
              onChange={(e) => setTransactionID(e.target.value)}
              required
              invalid={transactionIDError}
            />
            <FormFeedback>Please provide a Transaction ID.</FormFeedback>
          </FormGroup>
        </Col>
        <Col md="6" sm="12">
          <FormGroup>
            <Label for="modeOfPayment">Mode of Payment:</Label>
            <Input
              type="text"
              id="modeOfPayment"
              value={modeOfPayment}
              onChange={(e) => setModeOfPayment(e.target.value)}
              required
              invalid={modeOfPaymentError}
            />
            <FormFeedback>Please provide a Mode of Payment.</FormFeedback>
          </FormGroup>
        </Col>
      </Row>
      <div className="d-flex justify-content-between">
        <Button.Ripple
          color="primary"
          className="btn-prev"
          onClick={() => stepper.previous()}
        >
          <ArrowLeft size={14} className="align-middle mr-sm-25 mr-0" />
          <span className="align-middle d-sm-inline-block d-none">
            Previous
          </span>
        </Button.Ripple>
        <Button.Ripple
          type="button" // Use type="button" to prevent default form submission
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
