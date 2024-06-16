import React, { useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auths/authContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const SignUp = () => {
  const { t } = useTranslation();
  const { signUp } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const cpasswordRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordRef.current.value === cpasswordRef.current.value) {
      setLoading(true);
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      const name = nameRef.current.value;
      const res = await signUp({ email, name, password });
      setLoading(false);
      if (res.success) {
        navigate("/");
        showAlert({ type: "success", message: t("Signup successful") });
      } else {
        showAlert({ type: "danger", message: t("Signup Error") });
      }
    } else {
      showAlert({ type: "danger", message: t("Password and Confirm password do not match") });
    }
    emailRef.current.value = "";
    passwordRef.current.value = "";
    cpasswordRef.current.value = "";
    nameRef.current.value = "";
  };

  return (
    <div className="container">
      {loading && <Loader />}
      <div className="col-11 col-md-7 col-lg-5 mx-auto mt-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h3>{t("createaccount")}</h3>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  {t("name")}<span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-control" id="name" ref={nameRef} minLength={3} required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  {t("email")}<span style={{ color: 'red' }}>*</span>
                </label>
                <input type="email" className="form-control" id="email" ref={emailRef} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t("password")}<span style={{ color: 'red' }}>*</span>
                </label>
                <input type="password" className="form-control" id="password" ref={passwordRef} minLength={5} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {t("confirmpassword")}<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="cpassword"
                  ref={cpasswordRef}
                  minLength={5}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                {t("signUp")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
