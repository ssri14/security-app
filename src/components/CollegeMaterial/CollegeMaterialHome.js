import React, { useContext, useEffect, useRef, useState } from "react";
import CollegeMaterialContext from "../../context/collegeMaterials/collegeMaterialContext";
import AlertContext from "../../context/alert/alertContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CollegeMaterialHome = () => {
  const { t } = useTranslation();
  const { getCollegeMaterial, setSearchResults, setPrintSearchResults } = useContext(CollegeMaterialContext);
  const { showAlert } = useContext(AlertContext);
  return (
    <>
      <div className="container my-4">
        <div className="row justify-content-center text-center gap-4">
          <Link className="col-11 col-md-5 shadow p-5" to="/addNewCollegeMaterial">
            <button className="btn btn-primary mx-1">{t("addNewCollegeMaterial")}</button>
          </Link>
          <Link className="col-11 col-md-5 shadow p-5" to="/searchCollegeMaterial">
            <button className="btn btn-primary mx-1" onClick={async () => {
              await getCollegeMaterial();
            }}>{t("searchCollegeMaterial")}</button>
          </Link>
          <Link className="col-11 col-md-5 shadow p-5" to="/collegeMaterial">
            <button className="btn btn-primary mx-1" onClick={async () => {
              await getCollegeMaterial();
              await setSearchResults([]);
            }}>{t("collegeMaterialsList")}</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default CollegeMaterialHome;
