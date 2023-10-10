import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button, Row, Col, Table } from "reactstrap";
import UniLogo from "../../../../assets/images/logo/ShifaLogo.png";
import BankLogoSCM from "../../../../assets/images/logo/HBL-logo.jpg";
import BankLogoSCD from "../../../../assets/images/logo/Al_Baraka_logo.png";

import { ArrowRight, ArrowLeft, X, Plus } from "react-feather";
const signleChallan = ({ copyStatus }) => {
  const collegeName = "Shifa Tameer-e-Millat University";
  const voucherID = "123456";
  const date = "2023-08-23";
  const dueDate = "2023-09-01";
  const AccountTitle = "SHIFA TAMEER-MILLAT UNIVERSITY";
  const bankAccountNumber = "50007902906303";
  const programName = "Computer Science";
  const studentName = "John Doe";
  const rollNo = "CS12345";
  const pyear = "2023";
  const session = "Fall";
  const totalAmount = "1000";
  const contentRef = useRef(null);
  const tableStyle = {
    backgroundColor: "#FFFFFF", // White background color
    minWidth: "300px", // Minimum width for the entire table
    maxWidth: "800px", // Maximum width for the entire table
    width: "100%", // Set the table width to 100% for responsiveness
  };
  return (
    <>
      <Table bordered style={tableStyle}>
        <tbody>
          <tr>
            <td>
              <div
                style={{
                  width: "500px",
                  border: "solid 2px black",
                  padding: "0px",
                  textAlign: "center",
                }}
                id="Div6"
              >
                <table width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <img
                          src={UniLogo}
                          alt="Bank Logo"
                          style={{ width: "75px", height: "75px" }}
                        />
                      </td>
                      <td align="center">
                        <span
                          style={{ fontSize: "11pxt", fontFamily: "Arial" }}
                        >
                          <b>
                            Specialized Fee
                            <br />
                            Challan Form
                            <br />
                            {collegeName}
                          </b>
                          <br />
                          <b>(Deposit Slip {copyStatus} Copy)</b>
                        </span>
                        <br />
                      </td>
                      <td>
                        <img
                          src={BankLogoSCD}
                          alt="Bank Logo"
                          style={{ width: "100px", height: "50px" }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" align="center">
                        <span
                          style={{ fontSize: "11pxt", fontFamily: "Arial" }}
                        ></span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  width="100%"
                  className="mystyle"
                  style={{
                    fontFamily: "Arial",
                    fontSize: "15px",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        align="left"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Ch./Receipt/Slip No:</b>
                      </td>
                      <td
                        colSpan="3"
                        align="left"
                        style={{
                          fontSize: "15px",
                          //fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {voucherID}
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Issue Date:</b>
                      </td>
                      <td
                        align="right"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {date}
                      </td>
                      <td
                        align="right"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Due Date:</b>
                      </td>
                      <td
                        align="right"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {dueDate}
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Credit to:</b>
                      </td>
                      <td
                        colSpan="3"
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {AccountTitle}
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        width="30%"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Collection Account#:</b>
                      </td>
                      <td
                        colSpan="3"
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <u>{bankAccountNumber}</u>
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Program:</b>
                      </td>
                      <td
                        colSpan="3"
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {programName}
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Student Name:</b>
                      </td>
                      <td
                        colSpan="3"
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {studentName}
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "11px" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Roll No:</b>
                      </td>
                      <td
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {rollNo}
                      </td>
                      <td
                        align="right"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Program Year:</b>
                      </td>
                      <td
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {pyear}
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Semester:</b>
                      </td>
                      <td
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        Fall
                      </td>
                      <td
                        align="right"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Session:</b>
                      </td>
                      <td
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {session}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" align="center">
                        <hr style={{ border: "1px solid black" }} />
                      </td>
                    </tr>
                    <tr>
                      <td
                        align="left"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Installment</b>
                      </td>
                      <td
                        colSpan="3"
                        align="center"
                        style={{
                          fontSize: "15px",
                          fontWeight: "bold",
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        1
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Particulars</b>
                      </td>
                      <td
                        width="25%"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Amount (PKR)</b>
                      </td>
                      <td
                        width="25%"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Total (PKR)</b>
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        Admission Fee
                      </td>
                      <td
                        align="center"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {totalAmount}
                      </td>
                      <td
                        align="center"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        {totalAmount}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" align="center">
                        <hr style={{ border: "1px solid black" }} />
                      </td>
                    </tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Total:</b>
                      </td>
                      <td
                        align="center"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>{totalAmount}</b>
                      </td>
                      <td
                        align="center"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>{totalAmount}</b>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td
                        colSpan="2"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        <b>Remarks:</b>
                      </td>
                      <td
                        colSpan="2"
                        align="center"
                        style={{
                          border: "1px solid black",
                          padding: "5px",
                        }}
                      >
                        None
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" align="center">
                        <hr style={{ border: "1px solid black" }} />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" align="center">
                        <span style={{ fontSize: "15px", fontFamily: "Arial" }}>
                          <b>
                            Please deposit this challan to any branch of the
                            bank within the due date.
                          </b>
                          <br />
                          <b>
                            After the due date, an additional fine will be
                            charged as per the university policy.
                          </b>
                          <br />
                          <b>Keep the deposit slip safe as proof of payment.</b>
                          <br />
                          <b>
                            This is a computer-generated document and does not
                            require any signature.
                          </b>
                        </span>
                      </td>
                    </tr>
                    <br></br>
                    <tr align="left" style={{ fontSize: "15px" }}>
                      <td>
                        <b>Bank's Teller</b>
                      </td>
                      <td></td>
                      <td></td>

                      <td>
                        <b>Bank's Officer</b>
                      </td>
                    </tr>
                    <br></br>
                    <tr>
                      <td colSpan="4" align="center">
                        <hr style={{ border: "1px solid black" }} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  );
};

export default signleChallan;
