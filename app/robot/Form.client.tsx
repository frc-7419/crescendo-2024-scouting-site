"use client";


import React, { useState } from 'react';

const Form = () => {
    const [formState, setFormState] = useState({
        name: '',
        robotNumber: '',
        matchNumber: '',
        autoAmps: 0,
        autoSpeakers: 0,
        teleopAmps: 0,
        teleopSpeakers: 0,
        trap: false,
        hang: false,
        spotlight: false
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setFormState({
            ...formState,
            [event.target.name]: value
        });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(formState);
    };

    return (
        <div className="form bg-blue-500 shadow-md rounded px-8 pt-6 pb-8 mb-4"> 
            <form onSubmit={handleSubmit}>
                <input name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" value={formState.name} onChange={handleInputChange} placeholder="Scouter Name" maxLength={10} />          
                <input name="robotNumber" className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" value={formState.robotNumber} onChange={handleInputChange} placeholder="Robot Number" maxLength={5} />          
                <input name="matchNumber" className="shadow appearance-none border rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline" type="text" value={formState.matchNumber} onChange={handleInputChange} placeholder="Match Number" maxLength={2}/>
                <input name="autoAmps" className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" type="number" value={formState.autoAmps || ''} onChange={handleInputChange} placeholder="Amps in Auto" />
                <input name="autoSpeakers" className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" type="number" value={formState.autoSpeakers || ''} onChange={handleInputChange} placeholder="Speakers in Auto" />
                <input name="teleopAmps" className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" type="number" value={formState.teleopAmps || ''} onChange={handleInputChange} placeholder="Amps in Teleop" />
                <input name="teleopSpeakers" className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" type="number" value={formState.teleopSpeakers || ''} onChange={handleInputChange} placeholder="Speakers in Teleop" />
                
               <h1 style={{ fontFamily: 'Arial', color: 'white', fontSize: '1.5em', marginBottom: '10px' }}>Trap</h1>
<input name="trap" className="border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" type="checkbox" checked={formState.trap} onChange={handleInputChange} />

<h1 style={{ fontFamily: 'Arial', color: 'white', fontSize: '1.5em', marginBottom: '10px' }}>Hang</h1>
<input name="hang" className="border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" type="checkbox" checked={formState.hang} onChange={handleInputChange} />

<h1 style={{ fontFamily: 'Arial', color: 'white', fontSize: '1.5em', marginBottom: '10px' }}>Spotlight</h1>
<input name="spotlight" className="border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline" type="checkbox" checked={formState.spotlight} onChange={handleInputChange} />
                <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            </form>
        </div>
    );
};

export default Form;