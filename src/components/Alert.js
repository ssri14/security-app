import React, { useContext } from 'react'
import AlertContext from '../context/alert/alertContext';
import { useTranslation } from 'react-i18next';

const Alert = () => {
    const { t } = useTranslation();
    const { alert, setAlert } = useContext(AlertContext);
    return (
        <>
            <div >
                {alert && (
                    <div
                        className={`alert alert-${alert.type} alert-dismissible fade show`}
                        role="alert"
                    >
                        <strong>{alert.type === "danger" ? t('error') : t('Success')}</strong>: {alert.msg}
                        <button type="button" onClick={() => { setAlert(null); }} className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Alert;
