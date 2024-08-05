import React, { useState, useContext, useEffect } from 'react';
import { MedicationContext } from '../contexts/MedicationContext';
import { requestPermission } from '../firebaseConfig';

const MedicationForm = () => {
    const { medications, addMedication, markAsTaken } = useContext(MedicationContext);
    const [name, setName] = useState('');
    const [strips, setStrips] = useState('');
    const [pillsPerStrip, setPillsPerStrip] = useState('');
    const [firstDoseTime, setFirstDoseTime] = useState('');
    const [interval, setInterval] = useState('');
    const [customInterval, setCustomInterval] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [medicationType, setMedicationType] = useState('pill');
    const [reminderList, setReminderList] = useState([]);

    useEffect(() => {
        requestPermission();
    }, []);

    const calculateMedicationSchedule = (firstDoseTime, interval) => {
        const schedule = [];
        const startTime = new Date(firstDoseTime);
        for (let i = 0; i < 10; i++) {
            const doseTime = new Date(startTime.getTime() + i * interval * 60 * 60 * 1000);
            schedule.push({ doseTime: doseTime.toISOString(), taken: false });
        }
        return schedule;
    };

    const scheduleNotification = (time, title, body) => {
        const now = new Date();
        if (now >= time) {
            new Notification(title, { body });
        } else {
            setTimeout(() => new Notification(title, { body }), time - now);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const stripsNum = parseInt(strips, 10);
        const pillsPerStripNum = parseInt(pillsPerStrip, 10);
        const intervalNum = interval === 'custom' ? parseInt(customInterval, 10) : parseInt(interval, 10);

        if (isNaN(stripsNum) || isNaN(pillsPerStripNum) || isNaN(intervalNum) || !firstDoseTime) {
            alert('Please fill out all fields correctly');
            return;
        }

        const totalPills = stripsNum * pillsPerStripNum;
        const newMedication = {
            name,
            totalPills,
            firstDoseTime,
            interval: intervalNum,
            reminderEnabled,
            medicationType,
            doses: calculateMedicationSchedule(firstDoseTime, intervalNum),
            reminderSent: false
        };

        await addMedication(newMedication);

        if (reminderEnabled) {
            const reminderDate = new Date(
                new Date(firstDoseTime).getTime() +
                totalPills * intervalNum * 60 * 60 * 1000 -
                2 * 24 * 60 * 60 * 1000
            );
            setReminderList((prev) => [
                ...prev,
                {
                    name,
                    reminderDate
                }
            ]);
            alert(`Reminder set to purchase more ${name} two days before it runs out.`);

            scheduleNotification(reminderDate, 'Reminder to Purchase Medication', `Reminder to purchase ${name}.`);
        }

        setName('');
        setStrips('');
        setPillsPerStrip('');
        setFirstDoseTime('');
        setInterval('');
        setCustomInterval('');
        setReminderEnabled(false);
        setShowForm(false);
    };

    const handleMarkAsTaken = async (id, doseTime) => {
        if (!medications || medications.length === 0) return;

        const medication = medications.find(med => med.id === id);
        if (!medication) return;

        await markAsTaken(id, doseTime);
    };

    const handleReminderClick = (reminder) => {
        const { name } = reminder;
        setReminderList(prev => prev.map(item =>
            item.name === name ? { ...item, purchased: !item.purchased } : item
        ));

        if (!reminder.purchased) {
            alert(`Reminder to purchase ${name} soon.`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => setShowForm(!showForm)}
            >
                {showForm ? 'Close Medication Form' : 'Add Medication'}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Medication Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Number of Strips</label>
                        <input
                            type="number"
                            value={strips}
                            onChange={(e) => setStrips(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Pills per Strip</label>
                        <input
                            type="number"
                            value={pillsPerStrip}
                            onChange={(e) => setPillsPerStrip(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">First Dose Time</label>
                        <input
                            type="datetime-local"
                            value={firstDoseTime}
                            onChange={(e) => setFirstDoseTime(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Interval (hours)</label>
                        <select
                            value={interval}
                            onChange={(e) => setInterval(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        >
                            <option value="">Select Interval</option>
                            <option value="6">6 hours</option>
                            <option value="12">12 hours</option>
                            <option value="24">24 hours</option>
                            <option value="custom">Custom</option>
                        </select>
                        {interval === 'custom' && (
                            <input
                                type="number"
                                value={customInterval}
                                onChange={(e) => setCustomInterval(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
                                placeholder="Custom Interval (hours)"
                                required
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                checked={reminderEnabled}
                                onChange={() => setReminderEnabled(!reminderEnabled)}
                                className="form-checkbox"
                            />
                            <span className="ml-2 text-gray-700 text-sm">Enable Reminder</span>
                        </label>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Medication Type</label>
                        <select
                            value={medicationType}
                            onChange={(e) => setMedicationType(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="pill">Pill</option>
                            <option value="injection">Injection</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Medication
                    </button>
                </form>
            )}
            <div>
                {medications.map((med) => (
                    <div key={med.id} className="mb-4 p-4 bg-gray-100 rounded shadow-md">
                        <h3 className="text-lg font-bold">{med.name}</h3>
                        <p>Total Pills: {med.total}</p>
                        <p>Total Pills: {med.totalPills}</p>
                        <p>First Dose Time: {new Date(med.firstDoseTime).toLocaleString()}</p>
                        <p>Interval: {med.interval} hours</p>
                        <p>Medication Type: {med.medicationType}</p>
                        {med.doses.map((dose, index) => (
                            <div key={index} className="flex items-center">
                                <p className="mr-2">{new Date(dose.doseTime).toLocaleString()}</p>
                                <button
                                    onClick={() => handleMarkAsTaken(med.id, dose.doseTime)}
                                    className={`bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ${
                                        dose.taken ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={dose.taken}
                                >
                                    {dose.taken ? 'Taken' : 'Mark as Taken'}
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="mt-6">
                <h3 className="text-lg font-bold mb-2">Reminder List</h3>
                {reminderList.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {reminderList.map((reminder, index) => (
                            <li key={index} className="mb-2 flex items-center">
                                <span className={`mr-2 ${reminder.purchased ? 'line-through text-gray-500' : ''}`}>
                                    {reminder.name} - {new Date(reminder.reminderDate).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => handleReminderClick(reminder)}
                                    className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ${
                                        reminder.purchased ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    disabled={reminder.purchased}
                                >
                                    {reminder.purchased ? 'Purchased' : 'Mark as Purchased'}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reminders set.</p>
                )}
            </div>
        </div>
    );
};

export default MedicationForm;
