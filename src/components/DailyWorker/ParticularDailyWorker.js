import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import { useTranslation } from "react-i18next";
import AlertContext from "../../context/alert/alertContext";

const ParticularDailyWorker = () => {
  const { t } = useTranslation();
  var z = 0;
  const { particularDailyWorkers, getDailyWorkerBySlNo, setParticularDailyWorkers, editDailyWorker } = useContext(DailyWorkerContext);
  const { showAlert } = useContext(AlertContext);
  const {
    slNo,
    name,
    email,
    guardian,
    guardianName,
    address,
    mobileNumber,
    place,
    natureOfWork,
    duration,
    pastvisit,
    validupto,
    tout
  } = particularDailyWorkers;
  const ref = useRef(null);
  const idRef = useRef(null);
  const navigate = useNavigate();
  const updateDailyWorker = async () => {
    ref.current.click();
    idRef.current.value = particularDailyWorkers.slNo;
  };
  const handleUpdateDailyWorker = async (e) => {
    e.preventDefault();
    const updatedDailyWorker = {
      id: idRef.current.value,
    };
    const res = await editDailyWorker(updatedDailyWorker);
    if (res.success) showAlert({ type: "success", message: t("DailyWorker checkedout successfully") });
    else showAlert({ type: "danger", message: t("Error in editing dailyWorker") });
    idRef.current.value = "";
    ref.current.click();
    navigate("/home");
  };
  useEffect(() => {
    setParticularDailyWorkers(getDailyWorkerBySlNo(localStorage.getItem("slNo")));
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
                {t("checkoutDailyWorker")}
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleUpdateDailyWorker}>
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
        <b>{t("guardian")}:</b> {guardian}
      </p>
      <p>
        <b>{t("guardianName")}:</b> {guardianName}
      </p>
      <p>
        <b>{t("address")}:</b> {address}
      </p>
      <p>
        <b>{t("place")}:</b> {place}
      </p>
      <p>
        <b>{t("duration")}:</b> {duration ? duration.from + " to " + duration.to : " "}
      </p>
      <p>
        <b>{t("natureOfWork")}:</b> {natureOfWork}
      </p>
      <p>
        <b>{t("validupto")}:</b> {validupto}
      </p>
      {tout == "-1" && <button
        className="btn btn-primary mx-1"
        onClick={() => {
          updateDailyWorker();
        }}
      >
        {t("checkoutDailWorker")}
      </button>}
      {/* show history of each dailyWorker and canges in backend*/}
      <h2>{t("pastVisit")}</h2>
      {/* <div className="overflow-scroll"> */}
      <div className="table-responsive-xl">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">{t("sl.No.")}</th>
              <th scope="col">{t("intime")}</th>
              <th scope="col">{t("outtime")}</th>
              {/* <th scope="col" style={{ width: '30%' }}>{t("address")}</th> */}
              {/* <th scope="col" style={{ width: '10%' }}>{t("action")}</th> */}
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
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticularDailyWorker;
