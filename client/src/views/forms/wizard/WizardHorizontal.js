import { useRef, useState } from "react";
import Wizard from "@components/wizard";
import { ArrowRight } from "react-feather";
import Address from "./steps-with-validation/Address";
import SocialLinks from "./steps-with-validation/SocialLinks";
import PersonalInfo from "./steps-with-validation/PersonalInfo";
import AccountDetails from "./steps-with-validation/AccountDetails";
import ProgramPriority from "./steps-with-validation/ProgramPriority";
import Challan from "./steps-with-validation/Challan";
import TestScore from "./steps-with-validation/testScore";

const WizardHorizontal = () => {
  const [stepper, setStepper] = useState(null);
  const ref = useRef(null);

  const steps = [
    // {
    //   id: "account-details",
    //   title: "Account Details",
    //   subtitle: "Enter Your Account Details.",
    //   content: <AccountDetails stepper={stepper} type="wizard-horizontal" />,
    // },
    {
      id: "personal-info",
      title: "Personal Info",
      subtitle: "Add Personal Info",
      content: <PersonalInfo stepper={stepper} type="wizard-horizontal" />,
    },
    {
      id: "step-address",
      title: "Address",
      subtitle: "Add Address",
      content: <Address stepper={stepper} type="wizard-horizontal" />,
    },
    {
      id: "social-links",
      title: "Academic Information",
      subtitle: "Add Academic Information",
      content: <SocialLinks stepper={stepper} type="wizard-horizontal" />,
    },
    {
      id: "test-scores",
      title: "Test Scores",
      subtitle: "Add Test Scores",
      content: <TestScore stepper={stepper} type="wizard-horizontal" />,
    },
    {
      id: "program-priority",
      title: "Program Priority",
      subtitle: "Select Program Priority",
      content: <ProgramPriority stepper={stepper} type="wizard-horizontal" />,
    },
    {
      id: "challan",
      title: "Challan",
      subtitle: "Chllan Generation",
      content: <Challan stepper={stepper} type="wizard-horizontal" />,
    },
  ];

  return (
    <div className="horizontal-wizard">
      <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
    </div>
  );
};

export default WizardHorizontal;
