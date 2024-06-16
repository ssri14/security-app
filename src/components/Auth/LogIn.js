import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auths/authContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const LogIn = () => {
  const { t } = useTranslation();
  const { logIn } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const res = await logIn({ email, password });
    setLoading(false);
    if (res.success) {
      localStorage.setItem("token", res.authtoken);
      localStorage.setItem("id", res.id);
      navigate("/home");
      showAlert({ type: "success", message: t("Login successful") });
    } else {
      showAlert({ type: "danger", message: t("Login error") });
    }
    emailRef.current.value = "";
    passwordRef.current.value = "";
  };

  return (
    <div className="container">
      {loading && <Loader />}
      <div className="col-11 col-md-7 col-lg-5 mx-auto mt-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h3>{t("logIn")}</h3>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  {t("email")}<span style={{ color: 'red' }}>*</span>
                </label>
                <input type="email" className="form-control" id="email" ref={emailRef} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t("password")}<span style={{ color: 'red' }}>*</span>
                </label>
                <input type="password" className="form-control" id="password" ref={passwordRef} required />
              </div>
              <button type="submit" className="btn btn-primary">
                {t("logIn")}
              </button>
            </form>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LogIn;
