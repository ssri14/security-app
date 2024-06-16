import React, { useContext, useEffect } from "react";
import CollegeMaterialContext from "../../context/collegeMaterials/collegeMaterialContext";
import AlertContext from "../../context/alert/alertContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CollegeMaterialitem = (props) => {
  const { t } = useTranslation();
  const { setParticularCollegeMaterials, getCollegeMaterialBySlNo } = useContext(CollegeMaterialContext);
  const { collegeMaterial, updateCollegeMaterial, isEditable } = props;
  const { slNo, particularOfPerson, mobileNumber, to, from } = collegeMaterial;
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  return (
    <>
      <tr>
        <th scope="row">{slNo}.</th>
        <td>{particularOfPerson}</td>
        <td>{mobileNumber}</td>
        <td>{from}</td>
        <td>{to}</td>
        <td>
          <button
            className="btn btn-link"
            onClick={async () => {
              localStorage.setItem('slNo', slNo);
              await getCollegeMaterialBySlNo(collegeMaterial.slNo);
              navigate("/collegeMaterialmoreinfo");
            }}
          >
            {t("moreinfo")}
          </button>
        </td>
      </tr>
    </>
  );
};

export default CollegeMaterialitem;
