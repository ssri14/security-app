import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
    const { t } = useTranslation();
    return (
        <div className='container'>
            <p>{t('This app is for security purpose')}</p>
        </div>
    )
}

export default About
