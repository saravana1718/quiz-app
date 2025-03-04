import React, { useState, ChangeEvent, FormEvent } from "react";
import "@src/assets/css/login.scss";
// import Google from "@src/assets/icons/google.svg";
// import Apple from "@src/assets/icons/apple.svg";
import Logo from "@src/assets/icons/logo.png";
import { enqueueSnackbar } from "notistack";
import { baseUrl, xformPost } from "@utils/coreApiServices";
interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.username) {
      setError("Please enter username.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const payload = {
      username: formData.username,
      password: formData.password,
      grant_type: "password",
    };

    try {
      const res = await xformPost(
        `${baseUrl}token/`,
        payload,
        { "Content-Type": "application/x-www-form-urlencoded" },
        true
      );
      if (res?.status === 200 || res?.status === 201) {
        enqueueSnackbar("Successfully logged in", { variant: "success" });
        localStorage.setItem("accessToken", res.data.access_token);
        localStorage.setItem(
          "userData",
          JSON.stringify({ username: formData.username })
        );
        setTimeout(() => window.location.reload(), 400);
      } else {
        enqueueSnackbar({
          message: res?.data.message || "Operation failed.",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar({
        message: "An error occurred. Please try again.",
        variant: "error",
      });

      setFormData({
        username: "",
        password: "",
        rememberMe: false,
      });
      setError("");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container d-flex align-center flex-column">
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <p className="sub-header">Please sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group d-flex flex-column">
            <label htmlFor="username">User name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your User name"
              required
            />
          </div>
          <div className="input-group d-flex flex-column">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="remember-forgot d-flex align-center justify-between">
            <label>
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>

            <p className="forgot">Forgot password?</p>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="sign-in-button">
            Sign In
          </button>
          {/* <div className="continue-with">
            <div></div> <p>Or continue with</p> <div></div>
          </div>
          <div className="google-apple d-flex align-center justify-between">
            <button className="d-flex align-center justify-center">
              {" "}
              <img src={Google} /> Google{" "}
            </button>
            <button className="d-flex align-center justify-center">
              <img src={Apple} /> Apple{" "}
            </button>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
