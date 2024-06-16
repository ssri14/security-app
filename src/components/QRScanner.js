import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useTranslation } from "react-i18next";

const QRScanner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [result, setResult] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    const qrCodeScanner = new Html5QrcodeScanner("reader", { qrbox: { width: 450, height: 450 }, fps: 10 });
    qrCodeScanner.render(success, error);

    function success(result) {
      qrCodeScanner.clear();
      // Parsing the string into a JavaScript object
      let jsonObject = JSON.parse(result);
      //redirecting to add
      localStorage.setItem("slNo", jsonObject.id);
      if (jsonObject.user_type === "visitors") {
        navigate("/addVisitor");
      } else if (jsonObject.user_type === "dailyWorkers") {
        navigate("/addDailyWorker");
      }
    }
    function error(err) {
      console.warn(err);
    }
  };

  return (
    <div className="container my-4 text-center">
      <div id="reader">
        <h1>{t("QR Code Scanner")}</h1>
        <button className="btn btn-primary" onClick={(e) => handleScan(e)}>
          {t("Scan")}
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
