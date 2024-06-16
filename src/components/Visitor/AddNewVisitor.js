import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisitorContext from "../../context/visitors/visitorContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const AddNewVisitor = () => {
  const { t } = useTranslation();
  const { visitors, addVisitor, getVisitorBySlNo } = useContext(VisitorContext);
  const { showAlert } = useContext(AlertContext);
  const name = useRef();
  const email = useRef();
  const mobileNumber = useRef();
  const address = useRef();
  const vehicleNumber = useRef();
  const vehicleType = useRef();
  const purpose = useRef();
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
    const newVisitor = {
      name: name.current.value,
      email: email.current.value,
      mobileNumber: mobileNumber.current.value,
      address: address.current.value,
      vehicleNumber: vehicleNumber.current.value,
      vehicleType: vehicleType.current.value,
      purpose: purpose.current.value,
    };
    const id = -1;
    const res = await addVisitor(newVisitor, id);
    setLoading(false);
    if (res.success) {
      showAlert({ type: "success", message: `${t("Visitor added successfully with ID:")} ${res.entity.slNo}` });
      localStorage.setItem("slNo", res.entity.slNo);
      navigate("/visitormoreinfo");
    } else showAlert({ type: "danger", message: t("Error in adding visitor") });
    name.current.value = "";
    email.current.value = "";
    mobileNumber.current.value = "";
    address.current.value = "";
    vehicleNumber.current.value = "";
    vehicleType.current.value = "";
    purpose.current.value = "";
  };
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>{t("visitorDescription")}</h2>
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
            <label htmlFor="purpose" className="form-label">
              {t("purpose")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="purpose" ref={purpose} required />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleNumber" className="form-label">
              {t("vehicleNumber")}
            </label>
            <input type="text" className="form-control" id="vehicleNumber" ref={vehicleNumber} />
          </div>
          <div className="mb-3">
            <label htmlFor="vehicleType" className="form-label">
              {t("vehicleType")}
            </label>
            <input type="text" className="form-control" id="vehicleType" ref={vehicleType} />
          </div>
          <button type="submit" className="btn btn-primary">
            {t("submit")}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewVisitor;
