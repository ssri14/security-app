import React, { useContext, useEffect } from "react";
import CollegeMaterialContext from "../../context/collegeMaterials/collegeMaterialContext";
import { useTranslation } from "react-i18next";

const ParticularCollegeMaterial = () => {
  const { t } = useTranslation();
  var z = 0;
  const { particularCollegeMaterials, getCollegeMaterialBySlNo, setParticularCollegeMaterials } =
    useContext(CollegeMaterialContext);
  const { slNo, particularOfPerson, mobileNumber, materials, to, from, tout, remarks } = particularCollegeMaterials;
  useEffect(() => {
    setParticularCollegeMaterials(getCollegeMaterialBySlNo(localStorage.getItem("slNo")));
  }, []);
  return (
    <div className="container my-3">
      <p>
        <b>{t("ID")}:</b> {slNo}
      </p>
      <p>
        <b>{t("descriptionOfParticularOfPerson")}:</b> {particularOfPerson}
      </p>
      <p>
        <b>{t("mobileNumber")}:</b> {mobileNumber}
      </p>
      <p>
        <b>{t("from")}:</b> {from}
      </p>
      <p>
        <b>{t("to")}:</b> {to}
      </p>
      <p>
        <b>{t("outtime")}:</b> {tout}
      </p>
      <p>
        <b>{t("remarks")}:</b> {remarks}
      </p>
      <div className="table-responsive-xl">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">{t("sl.No.")}</th>
              <th scope="col">{t("description")}</th>
              <th scope="col">{t("quantity")}</th>
            </tr>
          </thead>
          <tbody>
            {materials &&
              materials.map((materials) => {
                return (
                  <tr>
                    <th scope="row">{(z = z + 1)}.</th>
                    <td>{materials.description}</td>
                    <td>{materials.quantity}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticularCollegeMaterial;
