import React, { useState } from "react";
import AlertContext from "./alertContext";

const AlertState = (props) => {
    const [alert, setAlert] = useState(null);
    const showAlert = ({ message, type }) => {
        setAlert({
            msg: message,
            type: type,
        });
    }
    return (
        <AlertContext.Provider value={{ showAlert, alert, setAlert }}>
            {props.children}
        </AlertContext.Provider>
    )
}

export default AlertState;
