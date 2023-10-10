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
    title: "Application Fee Received",
    icon: <Mail size={20} />,
    navLink: "/applfeereceived",
  },
  {
    id: "appfeepending",
    title: "Application Fee Pending",
    icon: <Package size={20} />,

    navLink: "/appfeepending",
  },
  {
    id: "appfeeverified",
    title: "Application Fee Verified",
    icon: <Check size={20} />,

    navLink: "/appfeeverified",
  },
  {
    id: "appfeerejected",
    title: "Application Fee Rejected",
    icon: <XSquare size={20} />,

    navLink: "/appfeerejected",
  },
];
