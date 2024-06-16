import React, { useContext, useEffect, useRef, useState } from "react";
import VisitorContext from "../../context/visitors/visitorContext";
import Visitoritem from "./VisitorItem";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import PrintContext from "../../context/print/printContext";
import Loader from "../Loading";

const Visitors = () => {
  const { t } = useTranslation();
  const { printData } = useContext(PrintContext);
  const { visitors, getVisitor, searchResults, setSearchResults, printSearchResults, setPrintSearchResults } =
    useContext(VisitorContext);
  const ref = useRef(null);
  const { editVisitor } = useContext(VisitorContext);
  const { showAlert } = useContext(AlertContext);
  const [id, setId] = useState();
  const from = useRef();
  const to = useRef();
  const [loading, setLoading] = useState(false);
  const updateVisitor = async (visitor) => {
    ref.current.click();
    setId(visitor.slNo);
  };
  const handleUpdateVisitor = async (e) => {
    e.preventDefault();
    setLoading(true);
    const updatedVisitor = {
      id: id,
    };
    const res = await editVisitor(updatedVisitor);
    if (res.success) showAlert({ type: "success", message: t("Visitor checkedout successfully") });
    else showAlert({ type: "danger", message: t("Error in editing visitor") });
    const vist = await getVisitor();
    const results = await searchVisitorsByDateRange(vist, from.current.value, to.current.value);
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
  const searchVisitorsByDateRange = (vist, fromDate, toDate) => {
    var data = [];
    for (const v of vist) {
      const slNo = v.slNo;
      const name = v.name;
      const address = v.address;
      const mobileNumber = v.mobileNumber;
      const purpose = v.purpose;
      for (const vi of v.pastvisit) {
        var pastintime = formatDate(vi.pasttin);
        if (pastintime >= fromDate && pastintime <= toDate) {
          pastintime = vi.pasttin;
          const pastouttime = vi.pasttout;
          const pastpurpose = vi.pastpurpose;
          const pastvn = vi.pastvn;
          const pastvt = vi.pastvt;
          data.push({
            slNo,
            name,
            mobileNumber,
            address,
            purpose: pastpurpose,
            vn: pastvn,
            vt: pastvt,
            intime: pastintime,
            outtime: pastouttime,
          });
        }
      }
      if (formatDate(v.tin) <= toDate && formatDate(v.tin) >= fromDate && v.tout == "-1") {
        const intime = v.tin;
        const vn = v.vn;
        const vt = v.vt;
        data.push({ slNo, name, mobileNumber, address, purpose, vn, vt, intime, outtime: "NA" });
      }
    }
    setPrintSearchResults(data);
    return (
      vist &&
      vist.filter(
        (visitor) =>
          (visitor.pastvisit &&
            visitor.pastvisit.some((visit) => {
              const intime = formatDate(visit.pasttin);
              return intime >= fromDate && intime <= toDate;
            })) ||
          (formatDate(visitor.tin) <= toDate && formatDate(visitor.tin) >= fromDate)
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
    const vist = await getVisitor();
    const results = await searchVisitorsByDateRange(vist, from.current.value, to.current.value);
    setSearchResults(results);
    setLoading(false);
  };
  const handelPrintData = async (e, printSearchResults) => {
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
    <h1>Data of Visitors</h1>
    <table>
      <tr>
        <th>SlNo.</th>
        <th>ID</th>
        <th>Name</th>
        <th>Mobile Number</th>
        <th>Address</th>
        <th>Purpose</th>
        <th>Vehicle Number</th>
        <th>Vehicle Type</th>
        <th>In Time</th>
        <th>Out Time</th>
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
        <td>${jsonData.purpose}</td>
        <td>${jsonData.vn}</td>
        <td>${jsonData.vt}</td>
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
    var filename = `visitor_${Date()}`;
    printData(htmlTemplate, filename);
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <div className="text-center">
          <h3>{t("Search visitor by Date")}</h3>
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
                  {t("checkoutVisitor")}
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <form onSubmit={handleUpdateVisitor}>
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
        <h2>{t("viewAllVisitors")}</h2>
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
                searchResults.map((visitor) => {
                  return (
                    <Visitoritem key={visitor._id} visitor={visitor} updateVisitor={updateVisitor} isEditable={true} />
                  );
                })}
            </tbody>
          </table>
          {searchResults.length === 0 && <p>{t("No visitor found please enter date range")}</p>}
        </div>
      </div>
    </>
  );
};

export default Visitors;
