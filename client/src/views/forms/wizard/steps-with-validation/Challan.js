import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Row, Col, Table } from "reactstrap";

const Challan = () => {
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

  const tableContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "10px",
    overflowX: "auto",
  };

  const tableStyle = {
    backgroundColor: "#FFFFFF", // White background color
    minWidth: "300px", // Minimum width for the entire table
    maxWidth: "800px", // Maximum width for the entire table
    width: "100%", // Set the table width to 100% for responsiveness
  };

  const thStyle = {
    backgroundColor: "#FFFFFF", // White background color for table headers
    color: "#000000", // Black text color for table headers
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div ref={contentRef}>
        <div style={tableContainerStyle}>
          <Table bordered style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Table 1</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Table content here...</td>
              </tr>
            </tbody>
          </Table>
          <Table bordered style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Table 2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Table content here...</td>
              </tr>
            </tbody>
          </Table>
          <Table bordered style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Table 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Table content here...</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      <Button onClick={generatePDF}>Download Challan</Button>
    </div>
  );
};

export default Challan;
