import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const UpdateValidity = () => {
  const { t } = useTranslation();
  const { dailyWorkers, getDailyWorkerBySearch, getDailyWorkerBySlNo } = useContext(DailyWorkerContext);
  const { editDailyWorker, editValidityDailyWorker } = useContext(DailyWorkerContext);
  const { showAlert } = useContext(AlertContext);
  const ref = useRef(null);
  const idRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleValidityUpdateDailyWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedDailyWorker = {
      id: idRef.current.value,
    };
    const res = await editValidityDailyWorker(updatedDailyWorker);
    if (res.success) showAlert({ type: "success", message: t("DailyWorker validity updated successfully") });
    else showAlert({ type: "danger", message: t("Error in editing dailyWorker") });
    idRef.current.value = "";
    setLoading(false);
  };
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>
          {t("update validity")} {t("6 months")}
        </h2>
        <form onSubmit={handleValidityUpdateDailyWorker}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              {t("ID")}<span style={{ color: 'red' }}>*</span>:
            </label>
            <input type="text" className="form-control" id="title" ref={idRef} required />
          </div>
          <button type="submit" className="btn btn-primary">
            {t("update validity")}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateValidity;
