import React, { useState } from "react";
import ContractorContext from "./contractorContext";

const ContractorState = (props) => {
  // const host = `http://${localhost}:5000`;
  const host = "";
  const contractorInitial = [];
  const [particularContractors, setParticularContractors] = useState(contractorInitial);
  const [contractors, setContractors] = useState(contractorInitial);
  const [searchResults, setSearchResults] = useState(contractorInitial);
  const [printSearchResults, setPrintSearchResults] = useState(contractorInitial);
  const getContractor = async () => {
    const response = await fetch(`${host}/api/contractors/fetchallcontractors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setContractors(res);
    return res;
  };

  const getContractorBySlNo = async (id) => {
    const response = await fetch(`${host}/api/contractors/fetchcontractor/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setParticularContractors(res);
    return res;
  };

  const getContractorBySearch = async (searchBy, value) => {
    const response = await fetch(`${host}/api/contractors/fetchcontractor/${searchBy}/${value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setContractors(res);
    return { success: response.ok, size: res.length };
  };

  const addContractor = async (contractor, id) => {
    const { name, mobileNumber, driverName, dlNumber, challanNumber, vehicleNumber, amount, product, from } = contractor;
    const response = await fetch(`${host}/api/contractors/addcontractor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, mobileNumber, driverName, dlNumber, challanNumber, vehicleNumber, amount, product, from, id }),
    });
    const res = await response.json();
    setContractors(contractors.concat(res.entity));
    setParticularContractors(res.entity);
    return res;
  };

  const editContractor = async (updatedContractor) => {
    const { id } = updatedContractor;
    const response = await fetch(`${host}/api/contractors/updatecontractor/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setContractors((prevContractors) =>
      prevContractors.map((contractor) => (contractor.id === id ? { ...contractor, ...updatedContractor } : contractor))
    );
    return res;
  };

  return (
    <ContractorContext.Provider
      value={{
        contractors,
        particularContractors,
        setParticularContractors,
        addContractor,
        editContractor,
        getContractor,
        getContractorBySlNo,
        getContractorBySearch, searchResults, setSearchResults,
        printSearchResults, setPrintSearchResults,
      }}
    >
      {props.children}
    </ContractorContext.Provider>
  );
};

export default ContractorState;
