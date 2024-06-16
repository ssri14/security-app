import React, { useContext, useEffect } from "react";
import VisitorContext from "../../context/visitors/visitorContext";
import AlertContext from "../../context/alert/alertContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Visitoritem = (props) => {
  const { t } = useTranslation();
  const { setParticularVisitors, getVisitorBySlNo } = useContext(VisitorContext);
  const { visitor, updateVisitor, isEditable } = props;
  const { slNo, name, address, mobileNumber } = visitor;
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  return (
    <>
      <tr>
        <th scope="row">{slNo}.</th>
        <td>{name}</td>
        <td>{mobileNumber}</td>
        <td>
          <button
            className="btn btn-link"
            onClick={() => {
              localStorage.setItem("slNo", slNo);
              getVisitorBySlNo(visitor.slNo);
              navigate("/visitormoreinfo");
            }}
          >
            {t("moreinfo")}
          </button>
        </td>
        <td>
          {isEditable && visitor.tout === "-1" && (
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                updateVisitor(visitor);
              }}
            >
              {t("checkout")}
            </button>
          )}
          {isEditable && visitor.tout !== "-1" && (
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                setParticularVisitors(visitor);
                localStorage.setItem("slNo", slNo);
                navigate("/addVisitor");
              }}
            >
              {t("addVisitor")}
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

export default Visitoritem;
