import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContractorContext from "../../context/contractors/contractorContext";
import Contractoritem from "./ContractorItem";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const SearchContractor = () => {
  const { t } = useTranslation();
  const { contractors, editContractor, getContractorBySearch, getContractor } = useContext(ContractorContext);
  const { showAlert } = useContext(AlertContext);
  const [searchBy, setSearchBy] = useState("choose");
  const [loading, setLoading] = useState(false);
  const slNo = useRef();
  const dlNo = useRef();
  const mobileNumber = useRef();
  const name = useRef();
  const driverName = useRef();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [id, setId] = useState();
  const updateContractor = async (contractor) => {
    ref.current.click();
    setId(contractor.slNo);
  };
  const handleUpdateContractor = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedContractor = {
      id: id,
    };
    const res = await editContractor(updatedContractor);
    if (res.success) showAlert({ type: "success", message: t(`Contractor checkedout successfully`) });
    else showAlert({ type: "danger", message: t("Error in editing contractor") });
    await getContractor();
    setLoading(false);
    ref.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let value = null;
    if (searchBy === "slNo") {
      value = slNo.current.value;
    } else if (searchBy === "mobileNumber&dlNo") {
      if (mobileNumber.current.value && mobileNumber.current.value.length !== 10) {
        showAlert({ type: "danger", message: t("Mobile Number must be exactly 10 characters long.") });
        setLoading(false);
        return;
      }
      value = mobileNumber.current.value + dlNo.current.value;
    } else if (searchBy === "mobileNumber") {
      if (mobileNumber.current.value && mobileNumber.current.value.length !== 10) {
        showAlert({ type: "danger", message: t("Mobile Number must be exactly 10 characters long.") });
        setLoading(false);
        return;
      }
      value = mobileNumber.current.value;
    } else if (searchBy === "dlNo") {
      value = dlNo.current.value;
    } else if (searchBy === "name") {
      value = name.current.value;
    } else if (searchBy === "driverName") {
      value = driverName.current.value;
    }
    const { success, size } = await getContractorBySearch(searchBy, value);
    setLoading(false);
    if (success && size > 0) showAlert({ type: "success", message: t("Contractor found") });
    else if (success && size == 0) showAlert({ type: "danger", message: t("No Contractor found") });
    else showAlert({ type: "danger", message: t("Error in finding Contractor") });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>{t("searchContractor")}</h2>
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
              }}
            >
              <option value="choose" disabled>
                {t("choose")}...
              </option>
              <option value="slNo">{t("ID")}</option>
              <option value="mobileNumber&dlNo">{t("mobileNumber")} {t("and")} {t("dlNumber")}</option>
              <option value="mobileNumber">{t("mobileNumber")}</option>
              <option value="dlNo">{t("dlNumber")}</option>
              <option value="name">{t("name")}</option>
              <option value="driverName">{t("driverName")}</option>
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
          {(searchBy === "mobileNumber" || searchBy === "mobileNumber&dlNo") && (
            <div className="mb-3">
              <label htmlFor="mobileNumber" className="form-label">
                {t("mobileNumber")}<span style={{ color: 'red' }}>*</span>
              </label>
              <input type="text" className="form-control" id="mobileNumber" ref={mobileNumber} minLength={3} required />
            </div>
          )}
          {(searchBy === "dlNo" || searchBy === "mobileNumber&dlNo") && (
            <div className="mb-3">
              <label htmlFor="dlNo" className="form-label">
                {t("dlNumber")}<span style={{ color: 'red' }}>*</span>
              </label>
              <input type="text" className="form-control" id="dlNo" ref={dlNo} minLength={3} required />
            </div>
          )}
          {searchBy === "name" && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t("name")}<span style={{ color: 'red' }}>*</span>
              </label>
              <input type="text" className="form-control" id="name" ref={name} minLength={3} required />
            </div>
          )}
          {searchBy === "driverName" && (
            <div className="mb-3">
              <label htmlFor="driverName" className="form-label">
                {t("driverName")}<span style={{ color: 'red' }}>*</span>
              </label>
              <input type="text" className="form-control" id="driverName" ref={driverName} required />
            </div>
          )}
          {searchBy !== "choose" && (
            <button type="submit" className="btn btn-primary">
              {t("search")}
            </button>
          )}
        </form>
        <hr />
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
                  {t("checkoutContractor")}
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form onSubmit={handleUpdateContractor}>
                <div className="modal-body">
                  {t("checkout")} {t("ID")} {id}
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
        <h2>{t("contractorsList")}</h2>
        <div className="table-responsive-xl">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">{t("ID")}</th>
                <th scope="col">{t("contractorName")}</th>
                <th scope="col">{t("mobileNumber")}</th>
                <th scope="col">{t("driverName")}</th>
                <th scope="col">{t("dlNumber")}</th>
                <th scope="col">{t("fromWhere")}</th>
                <th scope="col">{t("moreinfo")}</th>
                <th scope="col">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {contractors.length > 0 &&
                contractors.map((contractor) => {
                  return (
                    <Contractoritem
                      key={contractor._id}
                      contractor={contractor}
                      updateContractor={updateContractor}
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

export default SearchContractor;
