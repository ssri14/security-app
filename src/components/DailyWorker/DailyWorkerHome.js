import React, { useContext, useEffect, useRef, useState } from "react";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import AlertContext from "../../context/alert/alertContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const DailyWorkerHome = () => {
  const { t } = useTranslation();
  const { dailyWorkers, getDailyWorker } = useContext(DailyWorkerContext);
  const { editDailyWorker, editValidityDailyWorker, setSearchResults, setPrintSearchResults } = useContext(DailyWorkerContext);
  const { showAlert } = useContext(AlertContext);
  const ref = useRef(null);
  const idRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const updateDailyWorker = async () => {
    ref.current.click();
  };
  const handleUpdateDailyWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedDailyWorker = {
      id: idRef.current.value,
    };
    const res = await editDailyWorker(updatedDailyWorker);
    setLoading(false);
    if (res.success) showAlert({ type: "success", message: t("DailyWorker checkedout successfully") });
    else showAlert({ type: "danger", message: t("Error in editing dailyWorker") });
    idRef.current.value = "";
    ref.current.click();
  };

  return (
    <>
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
                  <input type="text" className="form-control" id="title" ref={idRef} required />
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
      {loading && <Loader />}
      <div className="container my-4" style={{ opacity: loading == true ? 0 : 1 }}>
        <div className="row justify-content-center text-center gap-4">
          <Link className="col-11 col-md-5 shadow p-5 " to="/addNewDailyWorker">
            <button className="btn btn-primary mx-1">{t("addNewDailyWorker")}</button>
          </Link>
          <Link className="col-11 col-md-5 shadow p-5 " to="/searchDailyWorker">
            <button className="btn btn-primary mx-1" onClick={async () => {
              await getDailyWorker();
            }}>{t("search&AddDailyWorker")}</button>
          </Link>
          <Link className="col-11 col-md-5 shadow p-5 ">
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                updateDailyWorker();
              }}
            >
              {t("checkoutDailyWorker")}
            </button>
          </Link>
          <Link className="col-11 col-md-5 shadow p-5" to="/dailyWorker">
            <button
              className="btn btn-primary mx-1"
              onClick={async () => {
                await getDailyWorker();
                await setSearchResults([])
                await setPrintSearchResults([])
              }}
            >
              {t("dailyWorkersList")}
            </button>
          </Link>
          <Link className="col-11 col-md-5 shadow p-5 " to="/updateValidityDailyWorker">
            <button className="btn btn-primary mx-1">{t("updateValidity")}</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default DailyWorkerHome;
