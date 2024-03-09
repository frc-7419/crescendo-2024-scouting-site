'use client'

import React from 'react';

const Charts = () => {
    const data = [
        {
            teamNumber: 1234,
            EPA: 82.3,
            teleopPoints: [
                70, 80, 60
            ],
            autoPoints: [
                30, 40, 20
            ],
            rank: 1
        },
        {
            teamNumber: 5678,
            EPA: 54.2,
            teleopPoints: [
                120, 130, 110
            ],
            autoPoints: [
                80, 90, 70
            ],
            rank: 2
        },
        {
            teamNumber: 9876,
            EPA: 24.2,
            teleopPoints: [
                90, 100, 80
            ],
            autoPoints: [
                60, 70, 50
            ],
            rank: 3
        },
    ]

    return (
        <>
            <section className="flex mb-2 gap-2">
                <div className="w-1/3 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                    <h2 className="text-white font-bold text-2xl">Team {data[0].teamNumber}</h2>
                    <p className="text-white">EPA: {data[0].EPA}</p>
                    <p className="text-white">Rank: {data[0].rank}st</p>
                </div>
                <div className="w-1/3 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                    <h2 className="text-white font-bold text-2xl">Team {data[1].teamNumber}</h2>
                    <p className="text-white">EPA: {data[1].EPA}</p>
                    <p className="text-white">Rank: {data[1].rank}nd</p>
                </div>
                <div className="w-1/3 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                    <h2 className="text-white font-bold text-2xl">Team {data[2].teamNumber}</h2>
                    <p className="text-white">EPA: {data[2].EPA}</p>
                    <p className="text-white">Rank: {data[2].rank}rd</p>
                </div>
            </section>

            <section className="flex my-2 gap-2">
                <div
                    className="w-1/2 h-[300px] dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                </div>

                <div
                    className="w-1/2 h-[300px] dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner"></div>
            </section>
        </>
    );
};


export default Charts;