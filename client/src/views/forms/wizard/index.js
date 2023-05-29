import { Fragment } from "react";
import { Row, Col } from "reactstrap";

import WizardHorizontal from "./WizardHorizontal";

import BreadCrumbs from "@components/breadcrumbs";

const Wizard = () => {
  return (
    <Fragment>
      <BreadCrumbs
        breadCrumbTitle="Admission Form"
        breadCrumbParent="Form"
        breadCrumbActive="Admission Form"
      />
      <Row>
        <Col sm="12">
          <WizardHorizontal />
        </Col>
        {/* <Col sm='12'>
          <WizardVertical />
        </Col>
        <Col sm='12'>
          <WizardModern />
        </Col>
        <Col sm='12'>
          <WizardModernVertical />
        </Col> */}
      </Row>
    </Fragment>
  );
};
export default Wizard;
