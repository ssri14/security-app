import React, { useState } from "react";
import CollegeMaterialContext from "./collegeMaterialContext";

const CollegeMaterialState = (props) => {
  // const host = `http://${localhost}:5000`;
  const host = "";

  const collegeMaterialInitial = [];
  const [particularCollegeMaterials, setParticularCollegeMaterials] = useState(collegeMaterialInitial);
  const [searchResults, setSearchResults] = useState(collegeMaterialInitial);
  const [collegeMaterials, setCollegeMaterials] = useState(collegeMaterialInitial);
  const getCollegeMaterial = async () => {
    const response = await fetch(`${host}/api/collegeMaterials/fetchallcollegeMaterials`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setCollegeMaterials(res);
    return res;
  };

  const getCollegeMaterialBySlNo = async (id) => {
    const response = await fetch(`${host}/api/collegeMaterials/fetchcollegeMaterial/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setParticularCollegeMaterials(res);
    return res;
  };

  const getCollegeMaterialBySearch = async (searchBy, value) => {
    const response = await fetch(`${host}/api/collegeMaterials/fetchcollegeMaterial/${searchBy}/${value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setCollegeMaterials(res);
    return { success: response.ok, size: res.length };
  };

  const addCollegeMaterial = async (collegeMaterial, id) => {
    const { particularOfPerson, mobileNumber, materials, from, to, incomingOrOutgoing } = collegeMaterial;
    const response = await fetch(`${host}/api/collegeMaterials/addcollegeMaterial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ particularOfPerson, mobileNumber, materials, from, to, id, incomingOrOutgoing }),
    });
    const res = await response.json();
    setCollegeMaterials(collegeMaterials.concat(res.entity));
    setParticularCollegeMaterials(res.entity);
    return res;
  };

  const editCollegeMaterial = async (updatedCollegeMaterial) => {
    const { id } = updatedCollegeMaterial;
    const response = await fetch(`${host}/api/collegeMaterials/updatecollegeMaterial/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setCollegeMaterials((prevCollegeMaterials) =>
      prevCollegeMaterials.map((collegeMaterial) =>
        collegeMaterial.id === id ? { ...collegeMaterial, ...updatedCollegeMaterial } : collegeMaterial
      )
    );
    return res;
  };

  return (
    <CollegeMaterialContext.Provider
      value={{
        collegeMaterials,
        particularCollegeMaterials,
        setParticularCollegeMaterials,
        addCollegeMaterial,
        editCollegeMaterial,
        getCollegeMaterial,
        getCollegeMaterialBySlNo,
        getCollegeMaterialBySearch,
        searchResults, setSearchResults
      }}
    >
      {props.children}
    </CollegeMaterialContext.Provider>
  );
};

export default CollegeMaterialState;
