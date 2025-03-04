import "./App.scss";
import "./assets/css/common.scss";
import {
  Navigate,
  Route,
  RouterProvider,
  createRoutesFromElements,
} from "react-router";
import { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { SnackbarProvider, MaterialDesignContent } from "notistack";
import { styled } from "@mui/material";
import Layout from "@components/layout/layout";
import Login from "@components/login/login";

const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    borderRadius: "4px",
    color: "#121212",
    background:
      "linear-gradient(0deg, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0.70) 100%), #65B54E",
    boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.08)",
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "#970C0C",
  },
}));
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/*# <Route path="/spinner" exact element={ <SimpleBackdrop/>}/> */}
        <Route
          path="/"
          element={
            !localStorage.getItem("accessToken") ? (
              <Navigate to={"/login"} />
            ) : (
              <Suspense fallback={<div id="loader"></div>}>
                <Layout />
              </Suspense>
            )
          }
        />
        <Route
          path="/login"
          element={
            localStorage.getItem("accessToken") ? (
              <Navigate to={"/"} />
            ) : (
              <Suspense fallback={<div id="loader"></div>}>
                <Login />
              </Suspense>
            )
          }
        />{" "}
        <Route
          path="/:section"
          // exact
          element={
            !localStorage.getItem("accessToken") ? (
              <Navigate to={"/login"} />
            ) : (
              <Layout />
            )
          }
        />
        {/* <Route
          path="/reset-password/:uidb64/:token"
          // exact
          element={
            <Suspense fallback={<div id="loader"></div>}>
              <ResetPassword />
            </Suspense>
          }
        /> */}
      </>
    )
  );
  return (
    <>
      <SnackbarProvider
        autoHideDuration={3000}
        maxSnack={3}
        Components={{
          success: StyledMaterialDesignContent,
          error: StyledMaterialDesignContent,
        }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="App">
          <RouterProvider router={router} />
        </div>
      </SnackbarProvider>
    </>
  );
}

export default App;
