import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_KEY = 'c016bd96f35f58e58a42b7cd2c5fe627';

const locations = {
  Iraq: [
    'Baghdad', 'Basrah', 'Erbil', 'Najaf', 'Karbala', 'Mosul', 'Anbar', 'Sulaymaniyah', 'Babylon', 'Diyala',
    'Duhok', 'Dhi Qar', 'Al-Qadisiyyah', 'Maysan', 'Muthanna', 'Salah al-Din', 'Wasit'
  ],
};

const conditions = [
  'الربو', 'الحساسية من الغبار', 'الحساسية من المطر', 'الحساسية من الرطوبة', 'الحساسية من درجات الحرارة المرتفعة', 'الحساسية من درجات الحرارة المنخفضة'
];

const Page3 = () => {
  const [country, setCountry] = useState(localStorage.getItem('country') || 'Iraq');
  const [state, setState] = useState(localStorage.getItem('state') || locations['Iraq'][0]);
  const [selectedConditions, setSelectedConditions] = useState(
    JSON.parse(localStorage.getItem('conditions')) || []
  );
  const [weather, setWeather] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (weather === null) {
      const fetchWeather = async () => {
        try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
              q: state,
              appid: API_KEY,
              units: 'metric'
            }
          });
          setWeather(response.data);
        } catch (error) {
          console.error('Error fetching the weather data', error);
          setWeather(null);
        }
      };

      fetchWeather();
    }
  }, [state, weather]);

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    setState(locations[newCountry][0]);
    localStorage.setItem('country', newCountry);
    localStorage.setItem('state', locations[newCountry][0]);
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setState(newState);
    localStorage.setItem('state', newState);
  };

  const handleConditionChange = (e) => {
    const { value, checked } = e.target;
    const updatedConditions = checked
      ? [...selectedConditions, value]
      : selectedConditions.filter(condition => condition !== value);

    setSelectedConditions(updatedConditions);
    localStorage.setItem('conditions', JSON.stringify(updatedConditions));
  };

  const checkConditions = () => {
    if (weather) {
      const { weather: weatherCondition, main } = weather;
      const mainCondition = weatherCondition[0].main.toLowerCase();
      const temperature = main.temp;
      const humidity = main.humidity;

      let alertMessage = 'الجو ملائم لحالتك الصحية.';

      if (selectedConditions.includes('الربو') && (mainCondition.includes('dust') || mainCondition.includes('sand'))) {
        alertMessage = 'تحذير: الجو يحتوي على غبار. يرجى اتخاذ الاحتياطات اللازمة.';
      } else if (selectedConditions.includes('الحساسية من الغبار') && mainCondition.includes('dust')) {
        alertMessage = 'تحذير: الجو يحتوي على غبار. يرجى اتخاذ الاحتياطات اللازمة.';
      } else if (selectedConditions.includes('الحساسية من المطر') && mainCondition.includes('rain')) {
        alertMessage = 'تحذير: الجو يحتوي على أمطار. يرجى اتخاذ الاحتياطات اللازمة.';
      } else if (selectedConditions.includes('الحساسية من الرطوبة') && humidity > 70) {
        alertMessage = 'تحذير: نسبة الرطوبة مرتفعة. يرجى اتخاذ الاحتياطات اللازمة.';
      } else if (selectedConditions.includes('الحساسية من درجات الحرارة المرتفعة') && temperature > 30) {
        alertMessage = 'تحذير: درجة الحرارة مرتفعة. يرجى اتخاذ الاحتياطات اللازمة.';
      } else if (selectedConditions.includes('الحساسية من درجات الحرارة المنخفضة') && temperature < 10) {
        alertMessage = 'تحذير: درجة الحرارة منخفضة. يرجى اتخاذ الاحتياطات اللازمة.';
      }

      return (
        <>
          <p className="text-lg font-medium mb-1 text-gray-700">درجة الحرارة: {temperature} °C</p>
          <p className="text-lg font-medium mb-1 text-gray-700">الرطوبة: {humidity}%</p>
          <p className="text-lg font-medium mb-2 text-gray-700">سرعة الرياح: {weather.wind.speed} m/s</p>
          <h2 className="text-xl font-bold mt-4 text-red-500">{alertMessage}</h2>
        </>
      );
    }
    return 'جاري جلب بيانات الطقس...';
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      localStorage.setItem('country', country);
      localStorage.setItem('state', state);
      localStorage.setItem('conditions', JSON.stringify(selectedConditions));
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">التحذيرات الصحية حسب الطقس</h1>
      {editMode ? (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <label className="block mb-4">
            <span className="text-lg font-semibold text-gray-700">اختر بلدك:</span>
            <select 
              className="block w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
              value={country} 
              onChange={handleCountryChange}
            >
              {Object.keys(locations).map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            <span className="text-lg font-semibold text-gray-700">اختر محافظتك:</span>
            <select 
              className="block w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
              value={state} 
              onChange={handleStateChange}
            >
              {locations[country].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </label>
          <fieldset className="mb-4">
            <legend className="text-lg font-semibold text-gray-700 mb-2">اختر حالتك الصحية:</legend>
            {conditions.map(cond => (
              <label key={cond} className=" mb-2 flex items-center">
                <input
                  type="checkbox"
                  value={cond}
                  checked={selectedConditions.includes(cond)}
                  onChange={handleConditionChange}
                  className="mr-2 h-5 w-5"
                />
                {cond}
              </label>
            ))}
          </fieldset>
          <button 
            onClick={handleEditToggle}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-pink-600 transition duration-300"
          >
            حفظ
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <button 
            onClick={handleEditToggle}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg shadow-md mb-4 hover:bg-pink-600 transition duration-300"
          >
            تعديل المعلومات
          </button>
          <div>
            {weather ? (
              <>
                <h2 className="text-xl font-bold mb-2 text-gray-800">معلومات الطقس</h2>
                <p className="text-lg font-medium mb-2 text-gray-700">الموقع: {weather.name}</p>
                <p className="text-lg font-medium mb-2 text-gray-700">حالة الطقس: {weather.weather[0].description}</p>
                {checkConditions()}
              </>
            ) : (
              <p>جاري جلب بيانات الطقس...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page3;
