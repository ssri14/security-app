import React, { useState } from "react";
import DailyWorkerContext from "./dailyWorkerContext";

const DailyWorkerState = (props) => {
  const localhost = "localhost";
  // const host = `http://${localhost}:5000`;
  const host = "";

  const dailyWorkerInitial = [];
  const [particularDailyWorkers, setParticularDailyWorkers] = useState(dailyWorkerInitial);
  const [dailyWorkers, setDailyWorkers] = useState(dailyWorkerInitial);
  const [searchResults, setSearchResults] = useState(dailyWorkerInitial);
  const [printSearchResults, setPrintSearchResults] = useState(dailyWorkerInitial);
  const getDailyWorker = async () => {
    const response = await fetch(`${host}/api/dailyWorkers/fetchalldailyWorkers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setDailyWorkers(res);
    return res;
  };

  const getDailyWorkerBySlNo = async (id) => {
    const response = await fetch(`${host}/api/dailyWorkers/fetchdailyWorker/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setParticularDailyWorkers(res);
    return res;
  };

  const getDailyWorkerBySearch = async (searchBy, value) => {
    const response = await fetch(`${host}/api/dailyWorkers/fetchdailyWorker/${searchBy}/${value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setDailyWorkers(res);
    return { success: response.ok, size: res.length };
  };

  const addDailyWorker = async (dailyWorker, id) => {
    const { name, email, address, mobileNumber, guardian, guardianName, place, natureOfWork, from, to } = dailyWorker;
    var validupto = new Date();
    validupto.setMonth(validupto.getMonth() + 6);
    const response = await fetch(`${host}/api/dailyWorkers/adddailyWorker`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name,
        email,
        address,
        mobileNumber,
        guardian,
        guardianName,
        place,
        natureOfWork,
        from,
        to,
        validupto,
        id,
      }),
    });
    const res = await response.json();
    setDailyWorkers(dailyWorkers.concat(res.entity));
    setParticularDailyWorkers(res.entity);
    return res;
  };

  const editDailyWorker = async (updatedDailyWorker) => {
    const { id } = updatedDailyWorker;
    const response = await fetch(`${host}/api/dailyWorkers/updatedailyWorker/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const res = await response.json();
    setDailyWorkers((prevDailyWorkers) =>
      prevDailyWorkers.map((dailyWorker) =>
        dailyWorker.id === id ? { ...dailyWorker, ...updatedDailyWorker } : dailyWorker
      )
    );
    return res;
  };

  const editValidityDailyWorker = async (updatedDailyWorker) => {
    const { id } = updatedDailyWorker;
    var validupto = new Date();
    validupto.setMonth(validupto.getMonth() + 6);
    const response = await fetch(`${host}/api/dailyWorkers/updatevaliditydailyWorker/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ validupto }),
    });
    const res = await response.json();
    setDailyWorkers((prevDailyWorkers) =>
      prevDailyWorkers.map((dailyWorker) =>
        dailyWorker.id === id ? { ...dailyWorker, ...updatedDailyWorker } : dailyWorker
      )
    );
    return res;
  };

  return (
    <DailyWorkerContext.Provider
      value={{
        dailyWorkers,
        particularDailyWorkers,
        editValidityDailyWorker,
        setParticularDailyWorkers,
        addDailyWorker,
        editDailyWorker,
        getDailyWorker,
        getDailyWorkerBySlNo,
        getDailyWorkerBySearch,
        searchResults,
        setSearchResults,
        printSearchResults,
        setPrintSearchResults,
      }}
    >
      {props.children}
    </DailyWorkerContext.Provider>
  );
};

export default DailyWorkerState;
