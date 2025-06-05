import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

function App() {
  const [allSwipeEvents, setAllSwipeEvents] = useState([]); // Stores individual swipe events
  const [selectedGender, setSelectedGender] = useState('All'); // 'All', 'Male', 'Female'
  const [selectedResidenceHall, setSelectedResidenceHall] = useState('All'); // 'All' or specific hall
  const [selectedCollege, setSelectedCollege] = useState('All'); // 'All' or specific college
  const dashboardDate = "June 4, 2025 (Simulated Data)";

  // List of Notre Dame Residence Halls with their associated gender
  // Compiled from residentiallife.nd.edu and Wikipedia for accuracy
  const residenceHalls = useMemo(() => [
    { name: 'Alumni Hall', gender: 'Male' },
    { name: 'Badin Hall', gender: 'Female' },
    { name: 'Baumer Hall', gender: 'Male' },
    { name: 'Breen-Phillips Hall', gender: 'Female' },
    { name: 'Carroll Hall', gender: 'Male' },
    { name: 'Cavanaugh Hall', gender: 'Female' },
    { name: 'Dillon Hall', gender: 'Male' },
    { name: 'Duncan Hall', gender: 'Male' },
    { name: 'Dunne Hall', gender: 'Male' },
    { name: 'Farley Hall', gender: 'Female' },
    { name: 'Flaherty Hall', gender: 'Female' },
    { name: 'Graham Family Hall', gender: 'Male' },
    { name: 'Howard Hall', gender: 'Female' },
    { name: 'Johnson Family Hall', gender: 'Female' },
    { name: 'Keenan Hall', gender: 'Male' },
    { name: 'Keough Hall', gender: 'Male' },
    { name: 'Knott Hall', gender: 'Male' },
    { name: 'Lewis Hall', gender: 'Female' },
    { name: 'Lyons Hall', gender: 'Female' },
    { name: 'McGlinn Hall', gender: 'Female' },
    { name: 'Morrissey Hall', gender: 'Male' },
    { name: 'O\'Neill Family Hall', gender: 'Male' },
    { name: 'Pasquerilla East Hall', gender: 'Female' },
    { name: 'Pasquerilla West Hall', gender: 'Female' },
    { name: 'Ryan Hall', gender: 'Female' },
    { name: 'Siegfried Hall', gender: 'Male' },
    { name: 'Sorin Hall', gender: 'Male' },
    { name: 'St. Edward\'s Hall', gender: 'Male' },
    { name: 'Stanford Hall', gender: 'Male' },
    { name: 'Walsh Hall', gender: 'Female' },
    { name: 'Welsh Family Hall', gender: 'Female' },
    { name: 'Zahm Hall', gender: 'Male' }, // Zahm Hall includes Coyle Community
    { name: 'Undergraduate Community at Fischer', gender: 'Female' } // Often associated with female students
  ].sort((a, b) => a.name.localeCompare(b.name)), []);

  // List of Notre Dame Colleges and Schools
  const colleges = useMemo(() => [
    'School of Architecture',
    'College of Arts and Letters',
    'Mendoza College of Business',
    'College of Engineering',
    'Keough School of Global Affairs',
    'College of Science'
  ].sort(), []); // Sort alphabetically

  // Function to simulate individual swipe events with gender, residence hall, and college
  const generateSimulatedEvents = useMemo(() => {
    const maleHalls = residenceHalls.filter(hall => hall.gender === 'Male');
    const femaleHalls = residenceHalls.filter(hall => hall.gender === 'Female');
    const allColleges = colleges;

    return () => {
      const events = [];
      for (let hour = 0; hour < 24; hour++) {
        let expectedSwipesPerHour = 0;

        // Determine general expected swipes for all students at this hour
        if (hour >= 7 && hour <= 9) { // Breakfast
          expectedSwipesPerHour = Math.floor(Math.random() * (600 - 300) + 300);
        } else if (hour >= 11 && hour <= 13) { // Lunch
          expectedSwipesPerHour = Math.floor(Math.random() * (1000 - 600) + 600);
        } else if (hour >= 17 && hour <= 19) { // Dinner
          expectedSwipesPerHour = Math.floor(Math.random() * (1200 - 700) + 700);
        } else if (hour >= 5 && hour < 7) { // Early morning
          expectedSwipesPerHour = Math.floor(Math.random() * (150 - 20) + 20);
        } else if (hour >= 20 && hour < 22) { // Late evening
          expectedSwipesPerHour = Math.floor(Math.random() * (300 - 50) + 50);
        } else { // Off-peak hours
          expectedSwipesPerHour = Math.floor(Math.random() * 30);
        }

        // Generate individual swipe events for this hour based on expectedSwipesPerHour
        for (let j = 0; j < expectedSwipesPerHour; j++) {
          const currentGender = Math.random() < 0.5 ? 'Male' : 'Female';
          const relevantHalls = currentGender === 'Male' ? maleHalls : femaleHalls;

          // Skip if no relevant halls for this gender
          if (relevantHalls.length === 0) continue;

          const assignedResidenceHall = relevantHalls[Math.floor(Math.random() * relevantHalls.length)].name;
          const assignedCollege = allColleges[Math.floor(Math.random() * allColleges.length)];
          const diningHall = Math.random() < 0.5 ? 'north' : 'south';

          // Apply Architecture specific patterns for THIS individual swipe event
          let includeThisSwipe = true;
          let forceLateDinner = false; // Flag to potentially force a late dinner swipe

          if (assignedCollege === 'School of Architecture') {
            if (hour >= 11 && hour <= 13) { // Lunch hours
              // Architecture students rarely eat lunch (e.g., 90% chance to skip this lunch swipe)
              if (Math.random() < 0.9) includeThisSwipe = false;
            } else if (hour >= 17 && hour <= 18) { // Early dinner hours (5 PM - 6 PM)
              // Architecture students prefer late dinner (e.g., 70% chance to skip early dinner)
              if (Math.random() < 0.7) {
                includeThisSwipe = false;
                // If they skip early dinner, they might eat late dinner instead
                if (Math.random() < 0.7) forceLateDinner = true; // 70% chance to generate a late dinner swipe
              }
            }
          }

          if (includeThisSwipe) {
            events.push({
              hour: hour,
              hall: diningHall,
              gender: currentGender,
              residenceHall: assignedResidenceHall,
              college: assignedCollege
            });
          }

          // If forceLateDinner is true, add a late dinner swipe for this Architecture student
          if (forceLateDinner) {
            const lateDinnerHour = Math.floor(Math.random() * (23 - 19 + 1)) + 19; // Random hour between 19 and 23
            events.push({
                hour: lateDinnerHour,
                hall: diningHall, // Could be same or different hall, keep consistent for simplicity
                gender: currentGender,
                residenceHall: assignedResidenceHall,
                college: assignedCollege
            });
          }
        }
      }
      return events;
    };
  }, [residenceHalls, colleges]);

  useEffect(() => {
    setAllSwipeEvents(generateSimulatedEvents());
  }, [generateSimulatedEvents]);

  // Filter and aggregate data based on selected gender, residence hall, and college
  const aggregatedSwipeData = useMemo(() => {
    const filteredEvents = allSwipeEvents.filter(event => {
      const genderMatches = selectedGender === 'All' || event.gender === selectedGender;
      const hallMatches = selectedResidenceHall === 'All' || event.residenceHall === selectedResidenceHall;
      const collegeMatches = selectedCollege === 'All' || event.college === selectedCollege;

      // Ensure consistency: if a specific gender is selected, and a residence hall
      // is selected that does NOT match that gender, then no events should be shown.
      const selectedHallObject = residenceHalls.find(hall => hall.name === selectedResidenceHall);
      const genderAndHallConsistent = (selectedGender === 'All' || selectedResidenceHall === 'All') ||
                                     (selectedHallObject && selectedHallObject.gender === selectedGender);

      return genderMatches && hallMatches && collegeMatches && genderAndHallConsistent;
    });

    const dataMap = new Map();
    for (let i = 0; i < 24; i++) {
      dataMap.set(i, {
        hour: `${i.toString().padStart(2, '0')}:00 - ${(i + 1).toString().padStart(2, '0')}:00`,
        north: 0,
        south: 0,
        total: 0,
      });
    }

    filteredEvents.forEach(event => {
      const hourEntry = dataMap.get(event.hour);
      if (hourEntry) {
        if (event.hall === 'north') {
          hourEntry.north++;
        } else if (event.hall === 'south') {
          hourEntry.south++;
        }
        hourEntry.total++;
      }
    });
    return Array.from(dataMap.values());
  }, [allSwipeEvents, selectedGender, selectedResidenceHall, selectedCollege, residenceHalls]);

  // Calculate daily totals for filtered data
  const totalNorthDaily = aggregatedSwipeData.reduce((sum, entry) => sum + entry.north, 0);
  const totalSouthDaily = aggregatedSwipeData.reduce((sum, entry) => sum + entry.south, 0);
  const totalDaily = aggregatedSwipeData.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8 font-inter text-gray-800">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-800 mb-4">
          Notre Dame Dining Hall Swipes: Daily Overview
        </h1>
        <p className="text-center text-lg text-gray-600 mb-4">
          <span className="font-semibold">Date:</span> {dashboardDate}
        </p>
        <p className="text-center text-sm text-red-600 font-semibold mb-8">
          Disclaimer: Gender, Residence Hall, and College data are simulated and not based on actual collected swipe data.
        </p>

        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
          This dashboard illustrates hourly swipe data for both North Dining Hall and South Dining Hall,
          providing insights into peak usage times and overall traffic distribution throughout the day.
          The data presented below is simulated to demonstrate potential patterns.
        </p>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg shadow-sm">
          {/* Gender Filter */}
          <div className="flex items-center">
            <label htmlFor="gender-filter" className="text-lg font-medium text-gray-700 mr-3">Filter by Gender:</label>
            <div className="relative inline-block text-gray-700">
              <select
                id="gender-filter"
                className="block appearance-none w-full bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base cursor-pointer"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Residence Hall Filter */}
          <div className="flex items-center mt-4 md:mt-0">
            <label htmlFor="residence-hall-filter" className="text-lg font-medium text-gray-700 mr-3">Filter by Residence Hall:</label>
            <div className="relative inline-block text-gray-700">
              <select
                id="residence-hall-filter"
                className="block appearance-none w-full bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base cursor-pointer"
                value={selectedResidenceHall}
                onChange={(e) => setSelectedResidenceHall(e.target.value)}
              >
                <option value="All">All Residence Halls</option>
                {residenceHalls.map((hall, index) => (
                  <option key={index} value={hall.name}>{hall.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* College Filter */}
          <div className="flex items-center mt-4 md:mt-0">
            <label htmlFor="college-filter" className="text-lg font-medium text-gray-700 mr-3">Filter by College:</label>
            <div className="relative inline-block text-gray-700">
              <select
                id="college-filter"
                className="block appearance-none w-full bg-white border border-gray-300 py-2 pl-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-base cursor-pointer"
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
              >
                <option value="All">All Colleges</option>
                {colleges.map((college, index) => (
                  <option key={index} value={college}>{college}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="mb-10 p-4 bg-blue-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Hourly Swipe Trend ({selectedGender} Swipes from {selectedResidenceHall === 'All' ? 'All Halls' : selectedResidenceHall} in {selectedCollege === 'All' ? 'All Colleges' : selectedCollege})</h2>
          {aggregatedSwipeData && aggregatedSwipeData.length > 0 ? (
            <div className="w-full h-[400px] flex justify-center items-center">
              <LineChart
                width={800}
                height={400}
                data={aggregatedSwipeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis dataKey="hour" angle={-45} textAnchor="end" height={80} interval={2} tick={{ fill: '#4a5568', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}`} tick={{ fill: '#4a5568' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e0', borderRadius: '8px', padding: '10px' }}
                  labelStyle={{ color: '#2d3748', fontWeight: 'bold' }}
                  itemStyle={{ color: '#4a5568' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="north" stroke="#3b82f6" strokeWidth={2} name="North Dining Hall" dot={{ r: 3 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="south" stroke="#ef4444" strokeWidth={2} name="South Dining Hall" dot={{ r: 3 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={2} name="Total Swipes" dot={{ r: 3 }} activeDot={{ r: 8 }} />
              </LineChart>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              <p>No data available for the selected filters or data is loading...</p>
              <p>Please adjust your gender, residence hall, or college selections.</p>
            </div>
          )}
        </div>

        {/* Table Section */}
        <div className="mb-10 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Hourly Swipe Data ({selectedGender} Swipes from {selectedResidenceHall === 'All' ? 'All Halls' : selectedResidenceHall} in {selectedCollege === 'All' ? 'All Colleges' : selectedCollege})</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-600 text-white rounded-t-lg">
                <th className="py-3 px-4 text-left border-b border-blue-500 rounded-tl-lg">Hour (24-Hour)</th>
                <th className="py-3 px-4 text-left border-b border-blue-500">North Dining Hall Swipes</th>
                <th className="py-3 px-4 text-left border-b border-blue-500">South Dining Hall Swipes</th>
                <th className="py-3 px-4 text-left border-b border-blue-500 rounded-tr-lg">Total Swipes</th>
              </tr>
            </thead>
            <tbody>
              {aggregatedSwipeData.map((entry, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-100 transition-colors duration-200`}>
                  <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{entry.hour}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{entry.north}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{entry.south}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-gray-800 font-medium">{entry.total}</td>
                </tr>
              ))}
              <tr className="bg-blue-700 text-white font-bold">
                <td className="py-3 px-4 text-left rounded-bl-lg">Daily Total</td>
                <td className="py-3 px-4 text-left">{totalNorthDaily}</td>
                <td className="py-3 px-4 text-left">{totalSouthDaily}</td>
                <td className="py-3 px-4 text-left rounded-br-lg">{totalDaily}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Key Observations */}
        <div className="mb-10 p-6 bg-green-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Key Observations from this Dashboard:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><span className="font-semibold">Peak Meal Times:</span> The line chart and table clearly show high swipe volumes during traditional breakfast (7 AM - 9 AM), lunch (11 AM - 1 PM), and dinner (5 PM - 7 PM) hours, with lunch and dinner being the busiest.</li>
            <li><span className="font-semibold">Dining Hall Comparison:</span> In this simulation, North Dining Hall generally experiences slightly higher swipe numbers than South Dining Hall, particularly during peak meal times.</li>
            <li><span className="font-semibold">Off-Peak Hours:</span> There is very low activity in the very early morning hours (2 AM - 5 AM) and late night (10 PM onwards), indicating minimal demand during these times.</li>
          </ul>
        </div>

        {/* How this dashboard helps */}
        <div className="p-6 bg-purple-50 rounded-lg shadow-inner">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">How this dashboard helps improve dining experience:</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li><span className="font-semibold">Staffing Optimization:</span> Dining hall management can use this data to optimize staffing levels at different hours, ensuring sufficient personnel during peak times to maintain service quality and reducing overstaffing during lulls to manage costs efficiently.</li>
            <li><span className="font-semibold">Food Preparation & Waste Reduction:</span> Understanding demand patterns helps predict food quantities needed more accurately, leading to reduced food waste and ensuring fresh, available food during busy periods.</li>
            <li><span className="font-semibold">Crowd Management:</span> This data identifies hours when dining halls are most crowded, allowing for proactive communication to students about less busy alternative times or potentially adjusting serving strategies to alleviate congestion.</li>
            <li><span className="font-semibold">Targeted Promotions:</span> If combined with survey data indicating student preferences, this dashboard could inform targeted promotions or special offerings during less busy hours to help spread out traffic and enhance the dining experience.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;

