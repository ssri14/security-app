import React, { useContext, useEffect } from "react";
import ContractorContext from "../../context/contractors/contractorContext";
import { useTranslation } from "react-i18next";

const ParticularContractor = () => {
  const { t } = useTranslation();
  var z = 0;
  const { particularContractors, getContractorBySlNo, setParticularContractors } = useContext(ContractorContext);
  const { slNo, name, mobileNumber, driverName, dlNo, cn, vn, amount, product, from, pastvisit } =
    particularContractors;
  useEffect(() => {
    setParticularContractors(getContractorBySlNo(localStorage.getItem("slNo")));
  }, []);
  return (
    <div className="container my-3">
      <p>
        <b>{t("ID")}:</b> {slNo}
      </p>
      <p>
        <b>{t("contractorName")}:</b> {name}
      </p>
      <p>
        <b>{t("mobileNumber")}:</b> {mobileNumber}
      </p>
      <p>
        <b>{t("driverName")}:</b> {driverName}
      </p>
      <p>
        <b>{t("dlNumber")}:</b> {dlNo}
      </p>
      <p>
        <b>{t("challanNumber")}:</b> {cn}
      </p>
      <p>
        <b>{t("vehicleNumber")}:</b> {vn}
      </p>
      <p>
        <b>{t("amount")}:</b> {amount}
      </p>
      <p>
        <b>{t("product")}:</b> {product}
      </p>
      <p>
        <b>{t("from")}:</b> {from}
      </p>
      <h2>{t("pastVisit")}</h2>
      <div className="table-responsive-xl">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">{t("sl.No.")}</th>
              <th scope="col">{t("intime")}</th>
              <th scope="col">{t("outtime")}</th>
              <th scope="col">{t("challanNumber")}</th>
              <th scope="col">{t("vehicleNumber")}</th>
              <th scope="col">{t("product")}</th>
              <th scope="col">{t("amount")}</th>
              <th scope="col">{t("from")}</th>
            </tr>
          </thead>
          <tbody>
            {pastvisit &&
              pastvisit.map((pastvisit) => {
                return (
                  <tr>
                    <th scope="row">{(z = z + 1)}.</th>
                    <td>{pastvisit.pasttin.slice(0, 24)}</td>
                    <td>{pastvisit.pasttout.slice(0, 24)}</td>
                    <td>{pastvisit.pastcn}</td>
                    <td>{pastvisit.pastvn}</td>
                    <td>{pastvisit.pastproduct}</td>
                    <td>{pastvisit.pastamount}</td>
                    <td>{pastvisit.pastfrom}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticularContractor;
