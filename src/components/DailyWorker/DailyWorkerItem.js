import React, { useContext, useEffect } from "react";
import DailyWorkerContext from "../../context/dailyWorkers/dailyWorkerContext";
import AlertContext from "../../context/alert/alertContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DailyWorkeritem = (props) => {
  const { t } = useTranslation();
  const { setParticularDailyWorkers, getDailyWorkerBySlNo } = useContext(DailyWorkerContext);
  const { dailyWorker, updateDailyWorker, isEditable } = props;
  const { slNo, name, mobileNumber } = dailyWorker;
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
              getDailyWorkerBySlNo(dailyWorker.slNo);
              navigate("/dailyWorkermoreinfo");
            }}
          >
            {t("moreinfo")}
          </button>
        </td>
        <td>
          {isEditable && dailyWorker.tout === "-1" && (
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                updateDailyWorker(dailyWorker);
              }}
            >
              {t("checkout")}
            </button>
          )}
          {isEditable && dailyWorker.tout !== "-1" && (
            <button
              className="btn btn-primary mx-1"
              onClick={() => {
                setParticularDailyWorkers(dailyWorker);
                localStorage.setItem("slNo", slNo);
                navigate("/addDailyWorker");
              }}
            >
              {t("addDailyWorker")}
            </button>
          )}
        </td>
      </tr>
    </>
  );
};

export default DailyWorkeritem;
