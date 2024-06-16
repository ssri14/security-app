import React, { useContext, useEffect, useRef, useState } from "react";
import CollegeMaterialContext from "../../context/collegeMaterials/collegeMaterialContext";
import CollegeMaterialitem from "./CollegeMaterialItem";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import PrintContext from "../../context/print/printContext";
import Loader from "../Loading";

const CollegeMaterials = () => {
  const { t } = useTranslation();
  const { printData } = useContext(PrintContext);
  const { collegeMaterials, getCollegeMaterial, searchResults, setSearchResults } = useContext(CollegeMaterialContext);
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const from = useRef();
  const to = useRef();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const searchCollegeMaterialsByDateRange = (vist, fromDate, toDate) => {
    return (
      vist &&
      vist.filter(
        (collegeMaterial) => formatDate(collegeMaterial.tout) <= toDate && formatDate(collegeMaterial.tout) >= fromDate
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
    await getCollegeMaterial();
    const results = await searchCollegeMaterialsByDateRange(collegeMaterials, from.current.value, to.current.value);
    setSearchResults(results);
    setLoading(false);
    // from.current.value = "";
    // to.current.value = "";
  };
  const handelPrintData = async (e, searchResults) => {
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
    <h1>Data of College Materials</h1>
    <table>
      <tr>
        <th>SlNo.</th>
        <th>particular Of Person taking out item</th>
        <th>mobileNumber</th>
        <th>from</th>
        <th>to</th>
        <th>out time</th>
        <th>product</th>
        <th>quantity</th>
      </tr>
    `;
    var c = 1;
    for (const jsonData of searchResults) {
      // HTML template
      if (jsonData) {
        htmlTemplate += `
              <tr>
        <td>${c}</td>
        <td>${jsonData.particularOfPerson}</td>
        <td>${jsonData.mobileNumber}</td>
        <td>${jsonData.from}</td>
        <td>${jsonData.to}</td>
        <td>${jsonData.tout.slice(0, 24)}</td>
        `;
        var z = 0;
        for (const materialData of jsonData.materials) {
          if (z == 0) {
            htmlTemplate += `
        <td>${materialData.description}</td>
        <td>${materialData.quantity}</td>
        </tr>
        `;
            z = 1;
          } else {
            htmlTemplate += `
        <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td>${materialData.description}</td>
        <td>${materialData.quantity}</td>
        </tr>
        `;
          }
        }
        c += 1;
      }
    }
    htmlTemplate += `</table>
    </body>
    </html>`;
    var filename = `college_material_${Date()}`;
    printData(htmlTemplate, filename);
    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <div className="text-center">
          <h3>{t("Search collegeMaterial by Date")}</h3>
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
            <button className="btn btn-primary" onClick={(e) => handelPrintData(e, searchResults)}>
              {t("print")}
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
                <th scope="col">{t("descriptionOfParticularOfPerson")}</th>
                <th scope="col">{t("mobileNumber")}</th>
                <th scope="col">{t("fromWhere")}</th>
                <th scope="col">{t("toWhere")}</th>
                <th scope="col">{t("moreinfo")}</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 &&
                searchResults.map((collegeMaterial) => {
                  return (
                    <CollegeMaterialitem key={collegeMaterial._id} collegeMaterial={collegeMaterial} isEditable={true} />
                  );
                })}
            </tbody>
          </table>
          {searchResults.length === 0 && <p>{t("No college material found please enter date range")}</p>}
        </div>
      </div>
    </>
  );
};

export default CollegeMaterials;
