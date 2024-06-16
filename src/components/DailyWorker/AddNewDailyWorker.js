import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const AddNewDailyWorker = () => {
  const { t } = useTranslation();
  const { dailyWorkers, addDailyWorker, getDailyWorkerBySlNo } = useContext(DailyWorkerContext);
  const { showAlert } = useContext(AlertContext);
  const name = useRef();
  const email = useRef();
  const guardian = useRef();
  const guardianName = useRef();
  const place = useRef();
  const natureOfWork = useRef();
  const from = useRef();
  const to = useRef();
  const mobileNumber = useRef();
  const address = useRef();
  const idRef = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (mobileNumber.current.value && mobileNumber.current.value.length !== 10) {
      showAlert({ type: "danger", message: t("Mobile Number must be exactly 10 characters long.") });
      setLoading(false);
      return;
    }
    if (from.current.value.length < 4) {
      from.current.value = "0" + from.current.value;
    }
    if (to.current.value.length < 4) {
      to.current.value = "0" + to.current.value;
    }
    if (from.current.value && !(from.current.value <= "2359" && from.current.value >= "0000")) {
      showAlert({ type: "danger", message: t("From time must be between 0000 and 2359") });
      setLoading(false);
      return;
    }
    if (to.current.value && !(to.current.value <= "2359" && to.current.value >= "0000")) {
      showAlert({ type: "danger", message: t("To time must be between 0000 and 2359") });
      setLoading(false);
      return;
    }
    if (to.current.value && from.current.value && !(from.current.value <= to.current.value)) {
      showAlert({ type: "danger", message: t("From time must be less than To time") });
      setLoading(false);
      return;
    }
    const newDailyWorker = {
      name: name.current.value,
      email: email.current.value,
      mobileNumber: mobileNumber.current.value,
      address: address.current.value,
      guardian: guardian.current.value,
      guardianName: guardianName.current.value,
      place: place.current.value,
      natureOfWork: natureOfWork.current.value,
      from: from.current.value,
      to: to.current.value,
    };
    const id = -1;
    const res = await addDailyWorker(newDailyWorker, id);
    setLoading(false);
    // console.log(res);
    if (res.success) {
      showAlert({
        type: "success",
        message: `${t("DailyWorker added successfully with ID:")} ${res.entity.slNo}`,
      });
      localStorage.setItem("slNo", res.entity.slNo);
      navigate("/dailyWorkermoreinfo");
    } else showAlert({ type: "danger", message: t("Error in adding dailyWorker") });
    name.current.value = "";
    email.current.value = "";
    mobileNumber.current.value = "";
    address.current.value = "";
    guardian.current.value = "";
    guardianName.current.value = "";
    place.current.value = "";
    natureOfWork.current.value = "";
    from.current.value = "";
    to.current.value = "";
  };
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>{t("dailyWorkerDiscription")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              {t("name")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="name" ref={name} minLength={3} required />
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label">
              {t("mobileNumber")}<span style={{ color: 'red' }}>*</span>{t("(10 Digits)")}
            </label>
            <input type="text" className="form-control" id="mobileNumber" ref={mobileNumber} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("email")}
            </label>
            <input type="email" className="form-control" id="email" ref={email} />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              {t("address")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="address" ref={address} required />
          </div>
          <div className="mb-3">
            <label htmlFor="place" className="form-label">
              {t("place")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="place" ref={place} required />
          </div>
          <div className="mb-3">
            <label htmlFor="guardian" className="form-label">
              {t("guardian")}
            </label>
            <input type="text" className="form-control" id="guardian" ref={guardian} />
          </div>
          <div className="mb-3">
            <label htmlFor="guardianName" className="form-label">
              {t("guardianName")}
            </label>
            <input type="text" className="form-control" id="guardianName" ref={guardianName} />
          </div>
          <div className="mb-3">
            <label htmlFor="natureOfWork" className="form-label">
              {t("natureOfWork")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="natureOfWork" ref={natureOfWork} />
          </div>
          <div className="mb-3">
            <label htmlFor="from" className="form-label">
              {t("Duration-from")}<span style={{ color: 'red' }}>*</span>{t("0000-2359")}
            </label>
            <input type="text" className="form-control" id="from" ref={from} />
          </div>
          <div className="mb-3">
            <label htmlFor="to" className="form-label">
              {t("Duration-to")}<span style={{ color: 'red' }}>*</span>{t("0000-2359")}
            </label>
            <input type="text" className="form-control" id="to" ref={to} />
          </div>
          <button type="submit" className="btn btn-primary">
            {t("submit")}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewDailyWorker;
