import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import VisitorContext from "../../context/visitors/visitorContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const AddVisitor = () => {
  const { t } = useTranslation();
  const { particularVisitors, addVisitor, getVisitorBySlNo, setParticularVisitors, updateVisitor, getVisitorBySearch } =
    useContext(VisitorContext);
  const { showAlert } = useContext(AlertContext);
  const name = useRef();
  const email = useRef();
  const address = useRef();
  const purpose = useRef();
  const vehicleNumber = useRef();
  const vehicleType = useRef();
  const mobileNumber = useRef();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getVisitorBySlNo(localStorage.getItem("slNo"));
  }, []);
  useEffect(() => {
    if (particularVisitors !== null) {
      // Call handleInput with the updated value of particularVisitors
      handleInput(particularVisitors);
    }
  }, [particularVisitors]);

  const handleInput = (res) => {
    if (res && res.tout !== "-1") {
      showAlert({ type: "success", message: t("Visitor found") });
      if (name.current) name.current.value = res.name;
      if (email.current) email.current.value = res.email;
      if (mobileNumber.current) mobileNumber.current.value = res.mobileNumber;
      if (address.current) address.current.value = res.address;
      if (vehicleNumber.current) vehicleNumber.current.value = res.vn;
      if (vehicleType.current) vehicleType.current.value = res.vt;
      purpose.current.value = "";
    } else {
      // showAlert({ type: "danger", message: t("Cannot find existing visitor or already in campus") });
      showAlert({ type: "success", message: t("Visitor already in campus do checkout") });
      localStorage.setItem("slNo", res.slNo);
      getVisitorBySlNo(res.slNo);
      navigate("/visitormoreinfo");
      name.current.value = "";
      email.current.value = "";
      mobileNumber.current.value = "";
      address.current.value = "";
      vehicleNumber.current.value = "";
      vehicleType.current.value = "";
      purpose.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = particularVisitors.slNo;
    const newVisitor = {
      name: name.current.value,
      mobileNumber: mobileNumber.current.value,
      email: email.current.value,
      address: address.current.value,
      vehicleNumber: vehicleNumber.current.value,
      vehicleType: vehicleType.current.value,
      purpose: purpose.current.value,
    };
    const res = await addVisitor(newVisitor, id);
    setLoading(false);
    if (res.success) {
      showAlert({ type: "success", message: t("Visitor added successfully") });
      localStorage.setItem("slNo", res.entity.slNo);
      navigate("/visitormoreinfo");
    } else showAlert({ type: "danger", message: t("Error in adding visitor") });
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
            <input type="email" className="form-control" id="email" ref={email} required readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              {t("address")}
            </label>
            <input type="text" className="form-control" id="address" ref={address} required readOnly />
          </div>
          <div className="mb-3">
            <label htmlFor="purpose" className="form-label">
              {t("purpose")}
              <span style={{ color: "red" }}>*</span>
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

export default AddVisitor;
