import Header from "@components/common/header";
import Home from "@components/home/home";
import StudyZone from "@components/studyzone/studyZone";
import React from "react";
import { useLocation } from "react-router";

const Layout: React.FC = () => {
  const pathName = useLocation().pathname;

  return (
    <>
      <Header />
      <div className="d-flex w-100">
        <main>
          {pathName === "/" ? (
            <Home />
          ) : pathName === "/study-zone" ? (
            <StudyZone />
          ) : (
            <></>
          )}
        </main>
      </div>
    </>
  );
};

export default Layout;
