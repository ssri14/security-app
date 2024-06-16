import React, { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CollegeMaterialContext from "../../context/collegeMaterials/collegeMaterialContext";
import AlertContext from "../../context/alert/alertContext";
import { useTranslation } from "react-i18next";
import Loader from "../Loading";

const AddNewCollegeMaterial = () => {
  var z = 0;
  const { t } = useTranslation();
  const { collegeMaterials, addCollegeMaterial, getCollegeMaterialBySlNo } = useContext(CollegeMaterialContext);
  const { showAlert } = useContext(AlertContext);
  const particularOfPerson = useRef();
  const mobileNumber = useRef();
  const from = useRef();
  const to = useRef();
  const [incomingOrOutgoing, setIncomingOrOutgoing] = useState();
  const idRef = useRef();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleAddItem = async (event) => {
    event.preventDefault();
    // Logic to add a new material
    const newMaterial = {
      description: "",
      quantity: "",
    };
    setMaterials([...materials, newMaterial]);
  };
  const handleNameChange = async (index, value) => {
    // Update the name for the specified material index
    const updatedMaterials = [...materials];
    updatedMaterials[index].description = value;
    setMaterials(updatedMaterials);
  };
  const handleRollNumberChange = async (index, value) => {
    // Update the roll number for the specified material index
    const updatedMaterials = [...materials];
    updatedMaterials[index].quantity = value;
    setMaterials(updatedMaterials);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (mobileNumber.current.value && mobileNumber.current.value.length !== 10) {
      showAlert({ type: "danger", message: t("Mobile Number must be exactly 10 characters long.") });
      setLoading(false);
      return;
    }
    const newCollegeMaterial = {
      particularOfPerson: particularOfPerson.current.value,
      mobileNumber: mobileNumber.current.value,
      materials: materials,
      from: from.current.value,
      to: to.current.value,
      incomingOrOutgoing: incomingOrOutgoing,
    };
    const id = -1;
    const res = await addCollegeMaterial(newCollegeMaterial, id);
    setLoading(false)
    if (res.success) {
      showAlert({
        type: "success",
        message: `${t("CollegeMaterial added successfully with ID:")} ${res.entity.slNo}`,
      });
      localStorage.setItem("slNo", res.entity.slNo);
      navigate("/collegeMaterialmoreinfo");
    } else showAlert({ type: "danger", message: t("Error in adding collegeMaterial") });
    particularOfPerson.current.value = "";
    mobileNumber.current.value = "";
    setIncomingOrOutgoing = "";
    from.current.value = "";
    to.current.value = "";
    setMaterials([]);
  };
  useEffect(() => { }, [materials]);
  return (
    <>
      {loading && <Loader />}
      <div className="container my-3" style={{ opacity: loading == true ? 0 : 1 }}>
        <h2>{t("collegeMaterialDescription")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="particularOfPerson" className="form-label">
              {t("descriptionOfParticularOfPerson")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="particularOfPerson" ref={particularOfPerson} required />
          </div>
          <div className="mb-3">
            <label htmlFor="mobileNumber" className="form-label">
              {t("mobileNumber")}<span style={{ color: 'red' }}>*</span>{t("(10 Digits)")}
            </label>
            <input type="text" className="form-control" id="mobileNumber" ref={mobileNumber} required />
          </div>
          <div className="mb-3">
            <label htmlFor="from" className="form-label">
              {t("fromWhere")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="from" ref={from} required />
          </div>
          <div className="mb-3">
            <label htmlFor="to" className="form-label">
              {t("toWhere")}<span style={{ color: 'red' }}>*</span>
            </label>
            <input type="text" className="form-control" id="to" ref={to} required />
          </div>
          <div className="mb-3">
            <label htmlFor="to" className="form-label">
              {t("incomingOrOutgoing")}<span style={{ color: 'red' }}>*</span>
            </label>
            <select
              className="form-select"
              aria-label="Default select example"
              defaultValue="choose"
              onChange={(e) => {
                setIncomingOrOutgoing(e.target.value);
              }}
              required
            >
              <option value="choose" disabled>
                {t("choose")}...
              </option>
              <option value="incoming">{t("incoming")}</option>
              <option value="outgoing">{t("outgoing")}</option>
            </select>
          </div>
          <div>
            <button onClick={handleAddItem} className="btn btn-primary">
              {t("addItem")}
            </button>
            <div className="table-responsive-xl">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">{t("sl.No.")}</th>
                    <th scope="col">{t("description")}</th>
                    <th scope="col">{t("quantity")}</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((material, materialIndex) => (
                    <tr key={materialIndex}>
                      <th scope="row">{(z = z + 1)}.</th>
                      <td>
                        <input
                          type="text"
                          value={material.name}
                          onChange={(e) => handleNameChange(materialIndex, e.target.value)}
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={material.rollNumber}
                          onChange={(e) => handleRollNumberChange(materialIndex, e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {t("submit")}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNewCollegeMaterial;
