"use client";

import React, { useState } from 'react';
import "../globals.css";

const Form = () => {
    const [name, setName] = useState('');
    const [robotNumber, setRobotNumber] = useState('');
    const [matchNumber, setMatchNumber] = useState('');
    const [autoAmps, setAutoAmps] = useState('');
    const [autoSpeakers, setAutoSpeakers] = useState('');
    const [teleopAmps, setTeleopAmps] = useState('');
    const [teleopSpeakers, setTeleopSpeakers] = useState('');
    const [trap, setTrap] = useState(false);
    const [hang, setHang] = useState(false);
    const [spotlight, setSpotlight] = useState(false);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRobotNumber(event.target.value);
    };

    const handleRobotNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRobotNumber(event.target.value);
    };

    const handleMatchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMatchNumber(event.target.value);
    };

    const handleAutoAmpsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoAmps(event.target.value);
    };

    const handleAutoSpeakersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoSpeakers(event.target.value);
    };

    const handleTeleopAmpsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeleopAmps(event.target.value);
    };

    const handleTeleopSpeakersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTeleopSpeakers(event.target.value);
    };

    const handleTrapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTrap(event.target.checked);
    };
    
    const handleHangChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHang(event.target.checked);
    };

    const handleSpotlightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSpotlight(event.target.checked);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Robot Number:', robotNumber);
        console.log('Match Number:', matchNumber);
    };

    return (
    <div className="form bg-blue-500 shadow-md rounded px-8 pt-6 pb-8 mb-4"> 
    <form onSubmit={handleSubmit}>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" value={name} onChange={handleNameChange} placeholder="Scouter Name" maxLength={5} />          
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" value={robotNumber} onChange={handleRobotNumberChange} placeholder="Robot Number" maxLength={5} />          
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" value={matchNumber} onChange={handleMatchNumberChange} placeholder="Match Number" maxLength={2}/>

        <h3 className="text-2xl font-bold m-3 text-white">Auto</h3>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="number" value={autoAmps} onChange={handleAutoAmpsChange} placeholder="Amps in Auto" />
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="number" value={autoSpeakers} onChange={handleAutoSpeakersChange} placeholder="Speakers in Auto" />
        <h3 className="text-2xl font-bold m-3 text-white">Teleop</h3>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="number" value={teleopAmps} onChange={handleTeleopAmpsChange} placeholder="Amps in Teleop" />
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="number" value={teleopSpeakers} onChange={handleTeleopSpeakersChange} placeholder="Speakers in Teleop" />
        <h3 className="text-2xl font-bold m-3 text-white">Endgame</h3>
        <div className='block items-center'>
        <label htmlFor="trap" className="p-2 text-xl font-medium text-white dark:text-gray-300">Trap?</label>
        <input type="checkbox" id="trap" checked={trap} onChange={handleTrapChange} className="w-5 h-5 p-5 m-3 text-blue-600 hover:bg-gray-300 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label htmlFor="hang" className="p-2 text-xl font-medium text-white dark:text-gray-300">Hang?</label>
        <input type="checkbox" id="hang" checked={hang} onChange={handleHangChange} className="w-5 h-5 p-5 m-3 text-blue-600 hover:bg-gray-300 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <label htmlFor="spotlight" className="p-2 text-xl font-medium text-white dark:text-gray-300">Spotlight?</label>
        <input type="checkbox" id="spotlight" checked={spotlight} onChange={handleSpotlightChange} className="w-5 h-5 p-5 m-3 text-blue-600 hover:bg-gray-300 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit</button>
    </form>
    </div>
);
 }
export default Form;