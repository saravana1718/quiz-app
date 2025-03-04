import React from "react";
import Logo from "@src/assets/icons/logo.png";
import Home from "@src/assets/icons/header/home.png";
import StudyZone from "@src/assets/icons/header/studyzone.png";
import Tests from "@src/assets/icons/header/tests.png";
import Analytics from "@src/assets/icons/header/analytics.png";
import Aichat from "@src/assets/icons/header/aichat.png";
import User from "@src/assets/icons/header/user.png";
import { Link, useLocation } from "react-router";
const Header: React.FC = () => {
  const pathName = useLocation().pathname;
  const navData = [
    {
      name: "Home",
      img: Home,

      slug: "/",
    },
    {
      name: "Study Zone",
      img: StudyZone,

      slug: "/study-zone",
    },
    {
      name: "Tests",
      img: Tests,

      slug: "/domain-scanner",
    },
    {
      name: "Analytics",
      img: Analytics,

      slug: "/reports",
    },
    {
      name: "AI Chat-bot",
      img: Aichat,

      slug: "/results",
    },
  ];
  return (
    <header>
      <div className="header-wrapper d-flex  justify-between">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <ul className="sidebar-menu-wrapper d-flex align-center">
          {navData.map((item, idx) => (
            <Link to={item.slug} key={idx}>
              <li
                className={`nav-item d-flex align-center ${
                  item.slug === pathName ? "active" : ""
                }`}
                key={item.slug || item.name}
              >
                <div className="img  d-flex align-center justify-center">
                  <img
                    alt={item.name}
                    className="menu-ico"
                    src={item.img}
                    width={16}
                    height={16}
                  />
                </div>

                <span>{item.name}</span>
              </li>
            </Link>
          ))}
        </ul>
        <div className="user-wrapper d-flex align-center">
          <p>Hi, Nikhil</p>
          <img src={User} alt="User" />
        </div>
      </div>
    </header>
  );
};

export default Header;
