import React, { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContractorContext from "../../context/contractors/contractorContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const AddContractor = () => {
    const { t } = useTranslation();
    const {
        particularContractors,
        addContractor,
        updateContractor,
        getContractorBySearch,
        setParticularContractors,
        getContractorBySlNo,
    } = useContext(ContractorContext);
    const { showAlert } = useContext(AlertContext);
    const name = useRef();
    const mobileNumber = useRef();
    const driverName = useRef();
    const dlNumber = useRef();
    const challanNumber = useRef();
    const vehicleNumber = useRef();
    const amount = useRef();
    const product = useRef();
    const from = useRef();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getContractorBySlNo(localStorage.getItem("slNo"));
    }, []);
    useEffect(() => {
        if (particularContractors !== null) {
            // Call handleInput with the updated value of particularVisitors
            handleInput(particularContractors);
        }
    }, [particularContractors]);
    const handleInput = (res) => {
        if (res && res.tout !== "-1") {
            showAlert({ type: "success", message: t("Contractor found") });
            if (name.current) name.current.value = res.name;
            if (mobileNumber.current) mobileNumber.current.value = res.mobileNumber;
            if (driverName.current) driverName.current.value = res.driverName;
            if (dlNumber.current) dlNumber.current.value = res.dlNo;
            if (vehicleNumber.current) vehicleNumber.current.value = res.vn;
            product.current.value = "";
            amount.current.value = "";
            from.current.value = "";
            challanNumber.current.value = "";
        } else {
            showAlert({ type: "danger", message: t("Cannot find existing contractor or already in campus") });
            name.current.value = "";
            mobileNumber.current.value = "";
            driverName.current.value = "";
            dlNumber.current.value = "";
            vehicleNumber.current.value = "";
            product.current.value = "";
            amount.current.value = "";
            from.current.value = "";
            challanNumber.current.value = "";
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (amount.current.value && amount.current.value <= 0) {
            showAlert({ type: "danger", message: t("Amount cannot be negative") });
            setLoading(false);
            return;
        }
        const id = particularContractors.slNo;
        const newContractor = {
            name: name.current.value,
            mobileNumber: mobileNumber.current.value,
            driverName: driverName.current.value,
            dlNumber: dlNumber.current.value,
            challanNumber: challanNumber.current.value,
            vehicleNumber: vehicleNumber.current.value,
            amount: amount.current.value,
            product: product.current.value,
            from: from.current.value,
        };
        const res = await addContractor(newContractor, id);
        setLoading(false);
        if (res.success) {
            showAlert({ type: "success", message: `${t("Contractor added successfully with ID:")} ${res.entity.slNo}` });
            localStorage.setItem("slNo", res.entity.slNo);
            navigate("/contractormoreinfo");
        } else showAlert({ type: "danger", message: t("Error in adding contractor") });
        challanNumber.current.value = "";
        amount.current.value = "";
        product.current.value = "";
        from.current.value = "";
    };
    return (
        <>
            {loading && <Loader />}
            <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
                <h2>{t("contractorDiscription")}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            {t("contractorName")}
                        </label>
                        <input type="text" className="form-control" id="name" ref={name} minLength={3} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mobileNumber" className="form-label">
                            {t("mobileNumber")}
                        </label>
                        <input type="text" className="form-control" id="mobileNumber" ref={mobileNumber} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="driverName" className="form-label">
                            {t("driverName")}
                        </label>
                        <input type="text" className="form-control" id="driverName" ref={driverName} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dlNumber" className="form-label">
                            {t("dlNumber")}
                        </label>
                        <input type="text" className="form-control" id="dlNumber" ref={dlNumber} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="challanNumber" className="form-label">
                            {t("challanNumber")}
                        </label>
                        <input type="text" className="form-control" id="challanNumber" ref={challanNumber} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="vehicleNumber" className="form-label">
                            {t("vehicleNumber")}
                        </label>
                        <input type="text" className="form-control" id="vehicleNumber" ref={vehicleNumber} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="product" className="form-label">
                            {t("product")}
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input type="text" className="form-control" id="product" ref={product} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">
                            {t("amount")}
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input type="text" className="form-control" id="amount" ref={amount} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="from" className="form-label">
                            {t("fromWhere")}
                            <span style={{ color: "red" }}>*</span>
                        </label>
                        <input type="text" className="form-control" id="from" ref={from} required />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {t("submit")}
                    </button>
                </form>
            </div>
        </>
    );
};

export default AddContractor;
