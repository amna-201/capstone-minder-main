import React from 'react';
import { MedicationProvider } from '../contexts/MedicationContext';
import MedicationForm from '../Components/MedicationForm';

const Time = () => {
    return (
        <MedicationProvider>
            <div>
                <h1>منبه الدواء</h1>
                <MedicationForm />
            </div>
        </MedicationProvider>
    );
};

export default Time;
