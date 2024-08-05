import React, { createContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const MedicationContext = createContext();

const MedicationProvider = ({ children }) => {
    const [medications, setMedications] = useState([]);

    useEffect(() => {
        const fetchMedications = async () => {
            const medsCollection = collection(db, 'medications');
            const medsSnapshot = await getDocs(medsCollection);
            const medsList = medsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMedications(medsList);
        };

        fetchMedications();
    }, []);

    const addMedication = async (medication) => {
        const medsCollection = collection(db, 'medications');
        const docRef = await addDoc(medsCollection, medication);
        setMedications(prev => [...prev, { id: docRef.id, ...medication }]);
    };

    const markAsTaken = async (id, doseTime) => {
        const medRef = doc(db, 'medications', id);
        const med = medications.find(med => med.id === id);

        if (!med || !med.doses) {
            console.error('Medication or doses are not defined.');
            return;
        }

        const updatedDoses = med.doses.map(dose =>
            dose.doseTime === doseTime ? { ...dose, taken: true } : dose
        );

        if (med.totalPills <= 1) {
            await deleteDoc(medRef);
            setMedications(prev => prev.filter(med => med.id !== id));
        } else {
            await updateDoc(medRef, { doses: updatedDoses, totalPills: med.totalPills - 1 });
            setMedications(prev => prev.map(med => med.id === id ? { ...med, doses: updatedDoses, totalPills: med.totalPills - 1 } : med));
        }
    };

    const sendReminder = async (name) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Reminder: ${name}`, {
                body: `You need to purchase ${name} before it runs out.`,
                icon: 'https://path/to/reminderIcon.png'
            });
        } else {
            console.log('Notification permission not granted or Notification API is not supported.');
        }
    };

    const checkReminders = async () => {
        if (!Array.isArray(medications)) {
            console.log('Medications is not an array.');
            return;
        }

        const today = new Date();
        medications.forEach(med => {
            if (!med.doses || !med.doses.length) {
                console.log(`No doses found for medication ${med.name}`);
                return;
            }

            const lastDoseDate = new Date(med.doses[med.doses.length - 1].doseTime);
            const reminderDate = new Date(lastDoseDate.getTime() - 2 * 24 * 60 * 60 * 1000);

            if (today >= reminderDate && today < lastDoseDate && !med.reminderSent) {
                sendReminder(med.name);
                updateDoc(doc(db, 'medications', med.id), { reminderSent: true });
            }
        });
    };

    useEffect(() => {
        checkReminders();
    }, [medications]);

    return (
        <MedicationContext.Provider value={{ medications, addMedication, markAsTaken }}>
            {children}
        </MedicationContext.Provider>
    );
};

export { MedicationProvider, MedicationContext };
