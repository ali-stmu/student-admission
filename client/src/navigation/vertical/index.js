import { Mail, Home, Package, Edit3 } from "react-feather";

export default [
  // {
  //   id: "home",
  //   title: "Home",
  //   icon: <Home size={20} />,
  //   navLink: "/home",
  // },

  {
    id: "wizard",
    title: "Admission Form",
    icon: <Package size={20} />,

    navLink: "/forms/wizard",
  },
  {
    id: "myApllications",
    title: "My Application",
    icon: <Mail size={20} />,

    navLink: "/myapplications",
  },
  {
    id: "secondPage",
    title: "CHPE Certifications",
    icon: <Mail size={20} />,
    navLink: "/second-page",
  },
];
