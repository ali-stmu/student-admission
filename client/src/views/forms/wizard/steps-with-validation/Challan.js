import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  CustomInput,
  Row,
  Col,
  Table,
} from "reactstrap";
import { ArrowLeft, ArrowRight } from "react-feather";
import { useForm } from "react-hook-form";

// ... (import statements)

const Challan = () => {
  const contentRef = useRef(null);

  const generatePDF = () => {
    const input = contentRef.current;
    if (input) {
      const pdf = new jsPDF("l", "mm", "a4"); // Landscape mode

      // Set white background before rendering canvas
      const canvasOptions = {
        backgroundColor: "#FFFFFF", // White background color
      };

      html2canvas(input, canvasOptions).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("challan.pdf");
      });
    }
  };

  const tableStyle = {
    backgroundColor: "#FFFFFF", // White background color
  };

  const thStyle = {
    backgroundColor: "#FFFFFF", // White background color for table headers
    color: "#000000", // Black text color for table headers
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div ref={contentRef}>
        <Form>
          <Row>
            <Col md={4}>
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
            </Col>
            <Col md={4}>
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
            </Col>
            <Col md={4}>
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
            </Col>
          </Row>
        </Form>
      </div>
      <Button onClick={generatePDF}>Download Challan</Button>
    </div>
  );
};

export default Challan;
