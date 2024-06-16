import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AlertContext from "../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import AuthContext from "../context/auths/authContext";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { backup, restore } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const [flg, setFlg] = useState(0);
  useEffect(() => {
  }, [location]);
  const { i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    if (lng == "en") setFlg(0);
    else setFlg(1);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("slNo");
    navigate("/");
    showAlert({ type: "success", message: t("Loggedout successful") });
  };
  const handleBackup = async (e) => {
    e.preventDefault();
    const res = await backup();
    if (res.success) {
      showAlert({ type: "success", message: t("backup successful") });
    } else {
      showAlert({ type: "danger", message: t("backup unsuccessful") });
    }
  };
  const handleRestore = async (e) => {
    e.preventDefault();
    const res = await restore();
    if (res.success) {
      showAlert({ type: "success", message: t("restore successful") });
    } else {
      showAlert({ type: "danger", message: t("restore unsuccessful") });
    }
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to={`${localStorage.getItem("token") ? "/home" : "/"}`}>
            {t("security-app")}
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {localStorage.getItem("token") && (
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === "/home" ? "active" : ""}`}
                    aria-current="page"
                    to="/home"
                  >
                    {t("home")}
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                  aria-current="page"
                  to="/about"
                >
                  {t("about")}
                </Link>
              </li>

              <li className="nav-item dropdown">
                {localStorage.getItem("token") && (
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {t("navigate")}
                  </a>)}
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="visitorhome">
                      {t("visitor")}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="contractorhome">
                      {t("contractor's info")}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="collegeMaterialhome">
                      {t("college Material")}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="dailyWorkerhome">
                      {t("daily Worker")}
                    </Link>
                  </li>
                </ul>
              </li>
              {localStorage.getItem("token") && (
                <li className="nav-item">
                  <button className="btn btn-primary mx-1" onClick={(e) => handleBackup(e)}>
                    {t("backup")}
                  </button>
                </li>
              )}
              {localStorage.getItem("token") && (
                <li className="nav-item">
                  <button className="btn btn-primary mx-1" onClick={(e) => handleRestore(e)}>
                    {t("restore")}
                  </button>
                </li>
              )}
              {flg == 1 && (
                <li className="nav-item">
                  <button className="btn btn-primary mx-1" onClick={() => changeLanguage("en")}>
                    English
                  </button>
                </li>
              )}
              {flg == 0 && (
                <li className="nav-item">
                  <button className="btn btn-primary mx-1" onClick={() => changeLanguage("hi")}>
                    हिंदी
                  </button>
                </li>
              )}
            </ul>
            {!localStorage.getItem("token") ? (
              <form className="d-flex">
                <Link
                  className={`${location.pathname === "/" ? "d-none" : ""} btn btn-primary mx-1`}
                  aria-current="page"
                  to="/"
                >
                  {t("logIn")}
                </Link>
                <Link
                  className={`${location.pathname === "/signup" ? "d-none" : ""} btn btn-primary mx-1`}
                  aria-current="page"
                  to="/signup"
                >
                  {t("signUp")}
                </Link>
              </form>
            ) : (
              <button onClick={handleLogOut} className="btn btn-primary mx-1">
                {t("logOut")}
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
