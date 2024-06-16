import React, { useState } from "react";
import VisitorContext from "./visitorContext";

const VisitorState = (props) => {
  // const host = `http://${localhost}:5000`;
  const host = "";
  const visitorInitial = [];
  const [particularVisitors, setParticularVisitors] = useState(visitorInitial);
  const [visitors, setVisitors] = useState(visitorInitial);
  const [searchResults, setSearchResults] = useState(visitorInitial);
  const [printSearchResults, setPrintSearchResults] = useState(visitorInitial);
  const getVisitor = async () => {
    const response = await fetch(`${host}/api/visitors/fetchallvisitors`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setVisitors(res);
    return res;
  };

  const getVisitorBySlNo = async (id) => {
    const response = await fetch(`${host}/api/visitors/fetchvisitor/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setParticularVisitors(res);
    return res;
  };
  const getVisitorBySearch = async (searchBy, value) => {
    const response = await fetch(`${host}/api/visitors/fetchvisitor/${searchBy}/${value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setVisitors(res);
    return { success: response.ok, size: res.length };
  };

  const addVisitor = async (visitor, id) => {
    const { name, email, mobileNumber, address, purpose, vehicleType, vehicleNumber } = visitor;
    const response = await fetch(`${host}/api/visitors/addvisitor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ name, email, mobileNumber, address, purpose, vehicleType, vehicleNumber, id }),
    });
    const res = await response.json();
    setVisitors(visitors.concat(res.entity));
    setParticularVisitors(res.entity);
    return res;
  };

  const editVisitor = async (updatedVisitor) => {
    const { id } = updatedVisitor;
    const response = await fetch(`${host}/api/visitors/updatevisitor/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setVisitors((prevVisitors) =>
      prevVisitors.map((visitor) => (visitor.id === id ? { ...visitor, ...updatedVisitor } : visitor))
    );
    return res;
  };

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        particularVisitors,
        setParticularVisitors,
        addVisitor,
        editVisitor,
        getVisitor,
        getVisitorBySlNo,
        getVisitorBySearch, searchResults, setSearchResults,
        printSearchResults, setPrintSearchResults
      }}
    >
      {props.children}
    </VisitorContext.Provider>
  );
};

export default VisitorState;
