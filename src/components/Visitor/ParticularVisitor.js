import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import VisitorContext from "../../context/visitors/visitorContext";
import { useTranslation } from "react-i18next";
import AlertContext from "../../context/alert/alertContext";

const ParticularVisitor = () => {
  const { t } = useTranslation();
  var z = 0;
  const { particularVisitors, getVisitorBySlNo, setParticularVisitors, editVisitor } = useContext(VisitorContext);
  const { slNo, name, email, address, mobileNumber, purpose, vn, vt, pastvisit, tin, tout } = particularVisitors;
  const { showAlert } = useContext(AlertContext)
  const ref = useRef(null);
  const idRef = useRef(null);
  const navigate = useNavigate();
  const updateVisitor = async () => {
    ref.current.click();
    idRef.current.value = particularVisitors.slNo;
  };
  const handleUpdateVisitor = async (e) => {
    e.preventDefault();
    const updatedVisitor = {
      id: idRef.current.value,
    };
    const res = await editVisitor(updatedVisitor);
    if (res.success) showAlert({ type: "success", message: t("Visitor checkedout successfully") });
    else showAlert({ type: "danger", message: t("Error in editing visitor") });
    idRef.current.value = "";
    ref.current.click();
    navigate("/home")
  };
  useEffect(() => {
    setParticularVisitors(getVisitorBySlNo(localStorage.getItem("slNo")));
  }, []);
  return (
    <div className="container my-3">
      <button
        ref={ref}
        type="button"
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                {t("checkoutVisitor")}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdateVisitor}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    {t("ID")}<span style={{ color: 'red' }}>*</span>:
                  </label>
                  <input type="text" className="form-control" id="title" ref={idRef} required readOnly />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  {t("cancle")}
                </button>
                <button type="submit" className="btn btn-primary">
                  {t("checkout")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <p>
        <b>{t("ID")}:</b> {slNo}
      </p>
      <p>
        <b>{t("name")}:</b> {name}
      </p>
      <p>
        <b>{t("mobileNumber")}:</b> {mobileNumber}
      </p>
      <p>
        <b>{t("email")}:</b> {email}
      </p>
      <p>
        <b>{t("address")}:</b> {address}
      </p>
      <p>
        <b>{t("purpose")}:</b> {purpose}
      </p>
      <p>
        <b>{t("vehicleNumber")}:</b> {vn}
      </p>
      <p>
        <b>{t("vehicleType")}:</b> {vt}
      </p>
      <p>
        <b>{t("intime")}:</b> {tin}
      </p>
      {tout == "-1" && <button
        className="btn btn-primary mx-1"
        onClick={() => {
          updateVisitor();
        }}
      >
        {t("checkoutVisitor")}
      </button>}
      <h2>{t("pastVisit")}</h2>
      <div className="table-responsive-xl">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">{t("sl.No.")}</th>
              <th scope="col">{t("intime")}</th>
              <th scope="col">{t("outtime")}</th>
              <th scope="col">{t("vehicleNumber")}</th>
              <th scope="col">{t("vehicleType")}</th>
              <th scope="col">{t("purpose")}</th>
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
                    <td>{pastvisit.pastvn}</td>
                    <td>{pastvisit.pastvt}</td>
                    <td>{pastvisit.pastpurpose}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticularVisitor;
