import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CollegeMaterialContext from "../../context/collegeMaterials/collegeMaterialContext";
import CollegeMaterialitem from "./CollegeMaterialItem";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const SearchCollegeMaterail = () => {
  const { t } = useTranslation();
  const { collegeMaterials, addCollegeMaterial, updateCollegeMaterial, getCollegeMaterialBySearch } =
    useContext(CollegeMaterialContext);
  const { showAlert } = useContext(AlertContext);
  const [searchBy, setSearchBy] = useState("choose");
  const slNo = useRef();
  const mobileNumber = useRef();
  const particularOfPerson = useRef();
  const [incomingOrOutgoing, setIncomingOrOutgoing] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let value = null;
    if (searchBy === "slNo") {
      value = slNo.current.value;
    } else if (searchBy === "particularOfPerson") {
      value = particularOfPerson.current.value;
    } else if (searchBy === "mobileNumber") {
      if (mobileNumber.current.value && mobileNumber.current.value.length !== 10) {
        showAlert({ type: "danger", message: t("Mobile Number must be exactly 10 characters long.") });
        setLoading(false);
        return;
      }
      value = mobileNumber.current.value;
    } else if (searchBy === "incomingOrOutgoing") {
      value = incomingOrOutgoing;
    }
    const { success, size } = await getCollegeMaterialBySearch(searchBy, value);
    setLoading(false);
    if (success && size > 0) showAlert({ type: "success", message: t("College Material found") });
    else if (success && size == 0) showAlert({ type: "danger", message: t("No College Material found") });
    else showAlert({ type: "danger", message: t("Error in finding College Material") });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>{t("searchCollegeMaterial")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="select" className="form-label">
              {t("searchField")}:
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              defaultValue="choose"
              onChange={(e) => {
                setSearchBy(e.target.value);
                console.log(e.target.value);
              }}
            >
              <option value="choose" disabled>
                {t("choose")}...
              </option>
              <option value="slNo">{t("ID")}</option>
              <option value="mobileNumber">{t("mobileNumber")}</option>
              <option value="particularOfPerson">{t("descriptionOfParticularOfPerson")}</option>
              <option value="incomingOrOutgoing">{t("incomingOrOutgoing")}</option>
            </select>
          </div>
          {searchBy === "slNo" && (
            <div className="mb-3">
              <label htmlFor="slNo" className="form-label">
                {t("ID")}<span style={{ color: 'red' }}>*</span>
              </label>
              <input type="text" className="form-control" id="slNo" ref={slNo} required />
            </div>
          )}
          {searchBy === "particularOfPerson" && (
            <div className="mb-3">
              <label htmlFor="particularOfPerson" className="form-label">
                {t("descriptionOfParticularOfPerson")}<span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="particularOfPerson"
                ref={particularOfPerson}
                minLength={3}
                required
              />
            </div>
          )}
          {searchBy === "mobileNumber" && (
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="form-label">
                {t("mobileNumber")}<span style={{ color: 'red' }}>*</span>{t("(10 Digits)")}
              </label>
              <input type="text" className="form-control" id="mobileNumber" ref={mobileNumber} required />
            </div>
          )}
          {searchBy === "incomingOrOutgoing" && (
            <div className="mb-3">
              <label htmlFor="to" className="form-label">
                {t("incomingOrOutgoing")}<span style={{ color: 'red' }}>*</span>
              </label>
              <select
                className="form-select"
                aria-label="Default select example"
                defaultValue="choose"
                onChange={(e) => {
                  setIncomingOrOutgoing(e.target.value);
                }}
                required
              >
                <option value="choose" disabled>
                  {t("choose")}...
                </option>
                <option value="incoming">{t("incoming")}</option>
                <option value="outgoing">{t("outgoing")}</option>
              </select>
            </div>
          )}
          {searchBy !== "choose" && (
            <button type="submit" className="btn btn-primary">
              {t("search")}
            </button>
          )}
        </form>
        <hr />
        <h2>{t("collegeMaterialsList")}</h2>
        <div className="table-responsive-xl">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">{t("ID")}</th>
                <th scope="col">{t("name")}</th>
                <th scope="col">{t("mobileNumber")}</th>
                <th scope="col">{t("fromWhere")}</th>
                <th scope="col">{t("toWhere")}</th>
                <th scope="col">{t("moreinfo")}</th>
              </tr>
            </thead>
            <tbody>
              {collegeMaterials.length > 0 &&
                collegeMaterials.map((collegeMaterial) => {
                  return (
                    <CollegeMaterialitem
                      key={collegeMaterial._id}
                      collegeMaterial={collegeMaterial}
                      updateCollegeMaterial={updateCollegeMaterial}
                      isEditable={true}
                      page="search&Add"
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SearchCollegeMaterail;
