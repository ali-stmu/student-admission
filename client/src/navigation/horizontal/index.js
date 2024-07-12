import { Mail, Home, Package, cros, Check, XSquare } from "react-feather";

export default [
  {
    id: "home",
    title: "Home",
    icon: <Home size={20} />,
    navLink: "/adminhome",
  },
  {
    id: "applfeereceived",
    title: "Fee Received",
    icon: <Mail size={20} />,
    navLink: "/applfeereceived",
  },
  {
    id: "appfeepending",
    title: "Fee Pending",
    icon: <Package size={20} />,

    navLink: "/appfeepending",
  },
  {
    id: "appfeeverified",
    title: "Fee Verified",
    icon: <Check size={20} />,

    navLink: "/appfeeverified",
  },
  {
    id: "appfeerejected",
    title: "Fee Rejected",
    icon: <XSquare size={20} />,

    navLink: "/appfeerejected",
  },
  {
    id: "appverified",
    title: "Application Verified",
    icon: <Check size={20} />,

    navLink: "/appverified",
  },
  {
    id: "apprejected",
    title: "Application Rejected",
    icon: <XSquare size={20} />,

    navLink: "/apprejected",
  },
  {
    id: "chpeapplicants",
    title: "CHPE Applicants",
    icon: <XSquare size={20} />,

    navLink: "/chpeapplicants",
  },
  {
    id: "bioethicsapplicants",
    title: "Bio Ethics Applicants",
    icon: <XSquare size={20} />,

    navLink: "/bioethicsapplicants",
  },
];
