import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import DailyWorkeritem from "./DailyWorkerItem";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const SearchDailyWorker = () => {
  const { t } = useTranslation();
  const { dailyWorkers, getDailyWorkerBySearch, editDailyWorker, getDailyWorker } = useContext(DailyWorkerContext);
  const { showAlert } = useContext(AlertContext);
  const [searchBy, setSearchBy] = useState("choose");
  const slNo = useRef();
  const name = useRef();
  const mobileNumber = useRef();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const updateDailyWorker = async (dailyWorker) => {
    ref.current.click();
    setId(dailyWorker.slNo);
  };
  const handleUpdateDailyWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedDailyWorker = {
      id: id,
    };
    const res = await editDailyWorker(updatedDailyWorker);
    if (res.success) showAlert({ type: "success", message: t("DailyWorker checkedout successfully") });
    else showAlert({ type: "danger", message: t("Error in editing dailyWorker") });
    await getDailyWorker();
    setLoading(false);
    ref.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let value = null;
    if (searchBy === "slNo") {
      value = slNo.current.value;
    } else if (searchBy === "name") {
      value = name.current.value;
    } else if (searchBy === "mobileNumber") {
      if (mobileNumber.current.value && mobileNumber.current.value.length !== 10) {
        showAlert({ type: "danger", message: t("Mobile Number must be exactly 10 characters long.") });
        setLoading(false);
        return;
      }
      value = mobileNumber.current.value;
    }
    const { success, size } = await getDailyWorkerBySearch(searchBy, value);
    setLoading(false);
    if (success && size > 0) showAlert({ type: "success", message: t("DailyWorker found") });
    else if (success && size == 0) showAlert({ type: "danger", message: t("No Daily Worker found") });
    else showAlert({ type: "danger", message: t("Error in finding Daily Worker") });
  };
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>{t("search&AddDailyWorker")}</h2>
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
              <option value="name">{t("name")}</option>
              <option value="mobileNumber">{t("mobileNumber")}</option>
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
          {searchBy === "name" && (
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                {t("name")}<span style={{ color: 'red' }}>*</span>
              </label>
              <input type="text" className="form-control" id="name" ref={name} minLength={3} required />
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
          {searchBy !== "choose" && (
            <button type="submit" className="btn btn-primary">
              {t("search")}
            </button>
          )}
        </form>
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
        <hr />
        <h2>{t("dailyWorkersList")}</h2>
        <div className="table-responsive-xl">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">{t("ID")}</th>
                <th scope="col">{t("name")}</th>
                <th scope="col">{t("mobileNumber")}</th>
                <th scope="col">{t("moreinfo")}</th>
                <th scope="col">{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {dailyWorkers.length > 0 &&
                dailyWorkers.map((dailyWorker) => {
                  return (
                    <DailyWorkeritem
                      key={dailyWorker._id}
                      dailyWorker={dailyWorker}
                      updateDailyWorker={updateDailyWorker}
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

export default SearchDailyWorker;
