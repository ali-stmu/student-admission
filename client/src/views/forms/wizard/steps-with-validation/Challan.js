import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Row, Col, Table } from "reactstrap";
import UniLogo from "../../../../assets/images/logo/ShifaLogo.png";
import BankLogo from "../../../../assets/images/logo/bank_logo.png";
import { ArrowRight, ArrowLeft, X, Plus } from "react-feather";
import SignleChallan from "./signleChallan";

const Challan = ({ stepper, type }) => {
  const contentRef = useRef(null);

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
  const onSubmit = () => {};

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
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div ref={contentRef}>
        <div style={tableContainerStyle}>
          <SignleChallan copyStatus="Dept." />
          <SignleChallan copyStatus="Bank" />
          <SignleChallan copyStatus="Student" />
        </div>
      </div>
      <Button onClick={generatePDF}>Download Challan</Button>
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
