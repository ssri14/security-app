import React, { useContext, useEffect, useRef, useState } from "react";
import ContractorContext from "../../context/contractors/contractorContext";
import Contractoritem from "./ContractorItem";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import PrintContext from "../../context/print/printContext";
import Loader from "../Loading";

const Contractors = () => {
  const { t } = useTranslation();
  const { printData } = useContext(PrintContext);
  const { contractors, getContractor, searchResults, setSearchResults, printSearchResults, setPrintSearchResults } =
    useContext(ContractorContext);
  const ref = useRef(null);
  const { editContractor } = useContext(ContractorContext);
  const { showAlert } = useContext(AlertContext);
  const [id, setId] = useState();
  const from = useRef();
  const to = useRef();
  const [loading, setLoading] = useState(false);
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
    if (res.success) showAlert({ type: "success", message: t("Contractor checkedout successfully") });
    else showAlert({ type: "danger", message: t("Error in editing contractor") });
    const vist = await getContractor();
    const results = await searchContractorsByDateRange(vist, from.current.value, to.current.value);
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
  const searchContractorsByDateRange = async (vist, fromDate, toDate) => {
    var data = [];
    for (const v of vist) {
      const slNo = v.slNo;
      const name = v.name;
      const mobileNumber = v.mobileNumber;
      const driverName = v.driverName;
      const dlNumber = v.dlNo;
      const fromwhere = v.from;
      for (const vi of v.pastvisit) {
        var pastintime = formatDate(vi.pasttin);
        if (pastintime >= fromDate && pastintime <= toDate) {
          pastintime = vi.pasttin;
          const pastouttime = vi.pasttout;
          const pastproduct = vi.pastproduct;
          const pastamount = vi.pastamount;
          const pastfrom = vi.pastfrom;
          const pastvn = vi.pastvn;
          const pastcn = vi.pastcn;
          data.push({
            slNo,
            name,
            mobileNumber,
            driverName,
            dlNumber,
            cn: pastcn,
            vn: pastvn,
            intime: pastintime,
            outtime: pastouttime,
            product: pastproduct,
            amount: pastamount,
            from: pastfrom,
          });
        }
      }
      if (formatDate(v.tin) <= toDate && formatDate(v.tin) >= fromDate && v.tout == "-1") {
        const intime = v.tin;
        const vn = v.vn;
        const cn = v.cn;
        const product = v.product;
        const amount = v.amount;
        data.push({
          slNo,
          name,
          mobileNumber,
          driverName,
          dlNumber,
          cn,
          vn,
          intime,
          outtime: "NA",
          product,
          amount,
          from: fromwhere,
        });
      }
    }
    setPrintSearchResults(data);
    return (
      vist &&
      vist.filter(
        (contractor) =>
          (contractor.pastvisit &&
            contractor.pastvisit.some((visit) => {
              const intime = formatDate(visit.pasttin);
              return intime >= fromDate && intime <= toDate;
            })) ||
          (formatDate(contractor.tin) <= toDate && formatDate(contractor.tin) >= fromDate)
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
    const vist = await getContractor();
    const results = await searchContractorsByDateRange(vist, from.current.value, to.current.value);
    setSearchResults(results);
    setLoading(false);
  };
  const handelPrintData = (e, searchResults) => {
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
    <h1>Data of Contractors</h1>
    <table>
      <tr>
        <th>SlNo.</th>
        <th>Contractor Name</th>
        <th>Mobile Number</th>
        <th>Driver Name</th>
        <th>Dl.No.</th>
        <th>Vehicle Number</th>
        <th>Challan Number</th>
        <th>Product</th>
        <th>Amount</th>
        <th>From</th>
        <th>In Time</th>
        <th>Out Time</th>
      </tr>
    `;
    var c = 1;
    for (const jsonData of searchResults) {
      // HTML template
      if (jsonData) {
        htmlTemplate += `
              <tr>
        <td>${c}</td>
        <td>${jsonData.name}</td>
        <td>${jsonData.mobileNumber}</td>
        <td>${jsonData.driverName}</td>
        <td>${jsonData.dlNumber}</td>
        <td>${jsonData.vn}</td>
        <td>${jsonData.cn}</td>
        <td>${jsonData.product}</td>
        <td>${jsonData.amount}</td>
        <td>${jsonData.from}</td>
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
    var filename = `contractor_${Date()}`;
    printData(htmlTemplate, filename);
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <div className="text-center">
          <h3>{t("Search contractor by Date")}</h3>
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
        <hr />
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
              {searchResults.length > 0 &&
                searchResults.map((contractor) => {
                  return (
                    <Contractoritem
                      key={contractor._id}
                      contractor={contractor}
                      updateContractor={updateContractor}
                      isEditable={true}
                    />
                  );
                })}
            </tbody>
          </table>
          {searchResults.length === 0 && <p>{t("No Contractor found please enter date range")}</p>}
        </div>
      </div>
    </>
  );
};

export default Contractors;
