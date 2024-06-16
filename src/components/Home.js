import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AlertContext from "../context/alert/alertContext";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="home">
      {localStorage.getItem("token") && (
        <div className="container my-4">
          <div className="row justify-content-center text-center gap-4">
            <div className="col-11 col-md-5 shadow p-5">
              <Link to="/visitorhome">
                <button className="btn btn-primary mx-1">{t("visitor")}</button>
              </Link>
            </div>
            <div className="col-11 col-md-5 shadow p-5">
              <Link to="/contractorhome">
                <button className="btn btn-primary mx-1">{t("contractor's info")}</button>
              </Link>
            </div>
            <div className="col-11 col-md-5 shadow p-5">
              <Link to="/collegeMaterialhome">
                <button className="btn btn-primary mx-1">{t("college Material")}</button>
              </Link>
            </div>
            <div className="col-11 col-md-5 shadow p-5">
              <Link to="/dailyWorkerhome">
                <button className="btn btn-primary mx-1">{t("daily Worker")}</button>
              </Link>
            </div>
            <div className="col-11 col-md-5 shadow p-5">
              <Link to="/qr-scanner">
                <button className="btn btn-primary mx-1">{t("Scan QR")}</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
