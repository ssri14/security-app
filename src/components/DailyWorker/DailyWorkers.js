import React, { useContext, useEffect, useRef, useState } from "react";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import DailyWorkeritem from "./DailyWorkerItem";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import PrintContext from "../../context/print/printContext";
import Loader from "../Loading";

const DailyWorkers = () => {
  const { t } = useTranslation();
  const { printData } = useContext(PrintContext);
  const { dailyWorkers, getDailyWorker, searchResults, setSearchResults, printSearchResults, setPrintSearchResults } =
    useContext(DailyWorkerContext);
  const ref = useRef(null);
  const { editDailyWorker } = useContext(DailyWorkerContext);
  const { showAlert } = useContext(AlertContext);
  const [id, setId] = useState();
  const from = useRef();
  const to = useRef();
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
    const vist = await getDailyWorker();
    const results = await searchDailyWorkersByDateRange(vist, from.current.value, to.current.value);
    setSearchResults(results);
    setLoading(false);
    ref.current.click();
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const searchDailyWorkersByDateRange = async (vist, fromDate, toDate) => {
    var data = [];
    for (const v of vist) {
      const slNo = v.slNo;
      const name = v.name;
      const guardian = v.fOrHName.guardian;
      const guardianName = v.fOrHName.name;
      const address = v.address;
      const mobileNumber = v.mobileNumber;
      const place = v.place;
      const natureOfWork = v.natureOfWork;
      for (const vi of v.pastvisit) {
        var pastintime = formatDate(vi.pasttin);
        if (pastintime >= fromDate && pastintime <= toDate) {
          pastintime = vi.pasttin;
          const pastouttime = vi.pasttout;
          data.push({
            slNo,
            name,
            mobileNumber,
            address,
            guardian,
            guardianName,
            place,
            natureOfWork,
            intime: pastintime,
            outtime: pastouttime,
          });

        }
      }
      if (formatDate(v.tin) <= toDate && formatDate(v.tin) >= fromDate && v.tout == "-1") {
        const intime = v.tin;
        data.push({
          slNo,
          name,
          mobileNumber,
          address,
          guardian,
          guardianName,
          place,
          natureOfWork,
          intime,
          outtime: "NA",
        });
      }
    }
    setPrintSearchResults(data);
    return (
      vist &&
      vist.filter(
        (dailyWorker) =>
          (dailyWorker.pastvisit &&
            dailyWorker.pastvisit.some((visit) => {
              const intime = formatDate(visit.pasttin);
              return intime >= fromDate && intime <= toDate;
            })) ||
          (formatDate(dailyWorker.tin) <= toDate && formatDate(dailyWorker.tin) >= fromDate)
      )
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (to.current.value && from.current.value && !(from.current.value <= to.current.value)) {
      showAlert({ type: "danger", message: t("From date must be less than To date") });
      setLoading(false);
      return;
    }
    const vist = await getDailyWorker();
    const results = await searchDailyWorkersByDateRange(vist, from.current.value, to.current.value);
    setSearchResults(results);
    setLoading(false);
  };
  const handelPrintData = (e, printSearchResults) => {
    e.preventDefault();
    setLoading(true);
    var htmlTemplate = `<html>
    <head>
    <style>
    h1 {
      text-align: center;
    }
    table {
      font-family: arial, sans-serif;
      font-size: 10px;
      border-collapse: collapse;
      width: 100%;
    }
    th {
      border: 1px solid #000000;
      text-align: center;
    }
    td{
      border: 1px solid #000000;
      text-align: left;
    }
    </style>
    </head>
    <body>
    <h1>Data of Daily Worker</h1>
    <table>
      <tr>
        <th>SlNo.</th>
        <th>ID</th>
        <th>Name</th>
        <th>MobileNumber</th>
        <th>Address</th>
        <th>Place</th>
        <th>Guardian</th>
        <th>Guardian Name</th>
        <th>Nature of Work</th>
        <th>tin</th>
        <th>tout</th>
      </tr>
    `;
    var c = 1;
    for (const jsonData of printSearchResults) {
      // HTML template
      if (jsonData) {
        htmlTemplate += `
              <tr>
        <td>${c}</td>
        <td>${jsonData.slNo}</td>
        <td>${jsonData.name}</td>
        <td>${jsonData.mobileNumber}</td>
        <td>${jsonData.address}</td>
        <td>${jsonData.place}</td>
        <td>${jsonData.guardian}</td>
        <td>${jsonData.guardianName}</td>
        <td>${jsonData.natureOfWork}</td>
        <td>${jsonData.intime.slice(0, 24)}</td>
        <td>${jsonData.outtime.slice(0, 24)}</td>
      </tr>
                  `;
        c += 1;
      }
    }
    htmlTemplate += `</table>
    </body>
    </html>`;
    var filename = `daily_worker_${Date()}`;
    printData(htmlTemplate, filename);
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <div className="text-center">
          <h3>{t("Search dailyWorker by Date")}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-group-text" id="basic-addon1">
              {t("from")}<span style={{ color: 'red' }}>*</span>
            </span>
            <input
              type="date"
              className="form-control"
              id="from"
              ref={from}
              aria-label="From Date"
              aria-describedby="basic-addon1"
              style={{ marginRight: "10px" }} // Adding right margin
              required
            />
            <span className="input-group-text" id="basic-addon2" style={{ marginLeft: "10px" }}>
              {" "}
              {/* Adding left margin */}
              {t("to")}<span style={{ color: 'red' }}>*</span>
            </span>
            <input
              type="date"
              className="form-control"
              id="to"
              ref={to}
              aria-label="To Date"
              aria-describedby="basic-addon2"
              required
            />
          </div>
          <button className="btn btn-primary me-3">{t("search")}</button>
          {searchResults.length > 0 && (
            <button className="btn btn-primary" onClick={(e) => handelPrintData(e, printSearchResults)}>
              {t("print")}
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
              {searchResults.length > 0 &&
                searchResults.map((dailyWorker) => {
                  return (
                    <DailyWorkeritem
                      key={dailyWorker._id}
                      dailyWorker={dailyWorker}
                      updateDailyWorker={updateDailyWorker}
                      isEditable={true}
                    />
                  );
                })}
            </tbody>
          </table>
          {searchResults.length === 0 && <p>{t("No daily worker found please enter date range")}</p>}
        </div>
      </div>
    </>
  );
};

export default DailyWorkers;
