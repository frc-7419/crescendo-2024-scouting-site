import React, { useState } from 'react';

const Form = () => {
    const [robotNumber, setRobotNumber] = useState('');
    const [matchNumber, setMatchNumber] = useState('');
    const [totalPoints, setTotalPoints] = useState('');

    const handleRobotNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRobotNumber(event.target.value);
    };

    const handleMatchNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMatchNumber(event.target.value);
    };

    const handleTotalPointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTotalPoints(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Robot Number:', robotNumber);
        console.log('Match Number:', matchNumber);
        console.log('Total Points:', totalPoints);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={robotNumber} onChange={handleRobotNumberChange} placeholder="Robot Number" />
            <input type="text" value={matchNumber} onChange={handleMatchNumberChange} placeholder="Match Number" />
            <input type="text" value={totalPoints} onChange={handleTotalPointsChange} placeholder="Total Points" />
            <button type="submit">Submit</button>
        </form>
    );
};

export default Form;