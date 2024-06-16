import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const AddDailyWorker = () => {
  const { t } = useTranslation();
  const {
    particularDailyWorkers,
    addDailyWorker,
    setParticularDailyWorkers,
    getDailyWorkerBySlNo,
    updateDailyWorker,
    getDailyWorkerBySearch,
  } = useContext(DailyWorkerContext);
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
  const navigate = useNavigate();
  const [flg, setFlg] = useState("0");
  const [loading, setLoading] = useState(false);

  const handleInput = (res) => {
    if (res && res.tout !== "-1") {
      showAlert({ type: "success", message: t("DailyWorker found") });
      var date = new Date();
      var hr = date.getHours();
      var mn = date.getMinutes();
      var tm = hr + "" + mn;
      if (tm.length < 4) tm = "0" + tm;
      if (res.validupto < date) {
        showAlert({ type: "danger", message: t("Daily worker validity periode expires please update") });
        setFlg("1");
      } else if (res.duration && !(res.duration.from <= tm && res.duration.to >= tm)) {
        showAlert({ type: "danger", message: t("Daily worker is not comming during their duration") });
        setFlg("1");
      }
      if (name.current) name.current.value = res.name;
      if (mobileNumber.current) mobileNumber.current.value = res.mobileNumber;
      if (email.current) email.current.value = res.email;
      if (address.current) address.current.value = res.address;
      if (guardian.current) guardian.current.value = res.guardian;
      if (guardianName.current) guardianName.current.value = res.guardianName;
      if (place.current) place.current.value = res.place;
      if (natureOfWork.current) natureOfWork.current.value = res.natureOfWork;
      if (from.current && res.duration) from.current.value = res.duration.from;
      if (to.current && res.duration) to.current.value = res.duration.to;
    } else {
      // showAlert({ type: "danger", message: t("Cannot find existing dailyWorker or already in campus") });
      showAlert({ type: "success", message: t("Daily Worker already in campus do checkout") });
      localStorage.setItem("slNo", res.slNo);
      getDailyWorkerBySlNo(res.slNo);
      navigate("/dailyWorkermoreinfo");
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
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    const res = await addDailyWorker(newDailyWorker, particularDailyWorkers.slNo);
    setLoading(false);
    if (res.success) {
      showAlert({
        type: "success",
        message: `${t("DailyWorker added successfully with ID:")} ${res.entity.slNo}`,
      });
      navigate("/dailyWorkerhome");
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
  useEffect(() => {
    // setParticularDailyWorkers(getDailyWorkerBySlNo(localStorage.getItem("slNo")));
    getDailyWorkerBySlNo(localStorage.getItem("slNo"));
  }, []);
  useEffect(() => {
    if (particularDailyWorkers !== null) {
      // Call handleInput with the updated value of particularVisitors
      handleInput(particularDailyWorkers);
    }
  }, [particularDailyWorkers]);
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>{t("dailyWorkerDiscription")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              {t("name")}
            </label>
            <input type="text" className="form-control" id="name" ref={name} minLength={3} required readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label">
              {t("mobileNumber")}
            </label>
            <input type="text" className="form-control" id="mobileNumber" ref={mobileNumber} required readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              {t("email")}
            </label>
            <input type="email" className="form-control" id="email" ref={email} />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              {t("address")}
            </label>
            <input type="text" className="form-control" id="address" ref={address} required readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="place" className="form-label">
              {t("place")}
            </label>
            <input type="text" className="form-control" id="place" ref={place} required readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="guardian" className="form-label">
              {t("guardian")}
            </label>
            <input type="text" className="form-control" id="guardian" ref={guardian} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="guardianName" className="form-label">
              {t("guardianName")}
            </label>
            <input type="text" className="form-control" id="guardianName" ref={guardianName} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="natureOfWork" className="form-label">
              {t("natureOfWork")}
            </label>
            <input type="text" className="form-control" id="natureOfWork" ref={natureOfWork} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="from" className="form-label">
              {t("Duration-from")}
            </label>
            <input type="text" className="form-control" id="from" ref={from} readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="to" className="form-label">
              {t("Duration-to")}
            </label>
            <input type="text" className="form-control" id="to" ref={to} readOnly />
          </div>
          {flg == "0" && (
            <button type="submit" className="btn btn-primary">
              {t("addDailyWorker")}
            </button>
          )}
        </form>
      </div>
    </>
  );
};

export default AddDailyWorker;
