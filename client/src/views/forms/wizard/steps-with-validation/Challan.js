import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Button,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
  CustomInput,
} from "reactstrap";
import UniLogo from "../../../../assets/images/logo/ShifaLogo.png";
import BankLogo from "../../../../assets/images/logo/bank_logo.png";
import { ArrowRight, ArrowLeft, X, Plus } from "react-feather";
import SignleChallan from "./signleChallan";
import { BASE_URL } from "../../../../config";
import axios from "axios";

const Challan = ({ stepper, type }) => {
  const contentRef = useRef(null);
  const [challanAttachment, setChallanAttachment] = useState(null);
  const [challanPaidDate, setChallanPaidDate] = useState("");

  const generatePDF = () => {
    const input = contentRef.current;
    if (input) {
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape mode

      // Determine the dimensions based on the device's screen size
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const canvasWidth =
        screenWidth > screenHeight ? screenWidth : screenHeight;
      const canvasHeight = canvasWidth * 0.75; // Assuming aspect ratio of 4:3

      // Set white background before rendering canvas
      const canvasOptions = {
        backgroundColor: "#FFFFFF", // White background color
      };

      html2canvas(input, {
        ...canvasOptions,
        width: canvasWidth,
        height: canvasHeight,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("challan.pdf");
      });
    }
  };
  const generatePdfffff = async () => {
    try {
      const response = await axios.get(`${BASE_URL}generate-pdf`, {
        responseType: "blob", // Important to handle binary data (PDF)
      });

      // Create a blob URL for the PDF and initiate a download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "example.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
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
        <div style={tableContainerStyle}>
          <SignleChallan copyStatus="Dept." />
          <SignleChallan copyStatus="Bank" />
          <SignleChallan copyStatus="Student" />
        </div>
      </div>
      <Button onClick={generatePDF}>Download Challan</Button>
      <h1>Challan Details:</h1>
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
        <button onClick={generatePdfffff}>test</button>
      </div>
    </div>
  );
};
export default Challan;
