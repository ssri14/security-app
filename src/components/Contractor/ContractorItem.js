import React, { useContext, useEffect } from "react";
import ContractorContext from "../../context/contractors/contractorContext";
import AlertContext from "../../context/alert/alertContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Contractoritem = (props) => {
  const { t } = useTranslation();
  const { setParticularContractors, getContractorBySlNo } = useContext(ContractorContext);
  const { contractor, updateContractor, isEditable } = props;
  const { slNo, name, mobileNumber, driverName, dlNo, from } = contractor;
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  return (
    <>
      <tr>
        <th scope="row">{slNo}.</th>
        <td>{name}</td>
        <td>{mobileNumber}</td>
        <td>{driverName}</td>
        <td>{dlNo}</td>
        <td>{from}</td>
        <td>
          <button
            className="btn btn-link"
            onClick={() => {
              // getContractorBySlNo(contractor.slNo);
              localStorage.setItem('slNo', slNo);
              getContractorBySlNo(contractor.slNo);
              navigate("/contractormoreinfo");
            }}
          >
            {t("moreinfo")}
          </button>
        </td>
        <td>
          {isEditable && contractor.tout === "-1" && (
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                updateContractor(contractor);
              }}
            >
              {t("checkout")}
            </button>
          )}
          {isEditable && contractor.tout !== "-1" && (
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                setParticularContractors(contractor);
                localStorage.setItem('slNo', slNo);
                navigate("/addContractor");
              }}
            >
              {t("addContractor")}
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

export default Contractoritem;
