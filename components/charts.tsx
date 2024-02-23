'use client'

import React from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, LabelList, Label, Cell, LineChart, Line } from 'recharts';

const Charts = () => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658'];

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

    const teleopData = data.map((team) => ({
        name: team.teamNumber,
        teleopPoints: team.teleopPoints.map((point) => point),
    }));


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
                <div className="w-1/2 h-[300px] dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            width={500}
                            height={300}
                            data={teleopData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="index" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            {data.map((team, index) => (
                                <Line
                                    key={team.teamNumber}
                                    type="monotone"
                                    dataKey={`teleopPoints`}
                                    stroke={`${colors[index]}`}
                                    activeDot={{ r: 8 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="w-1/2 h-[300px] dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner"></div>
            </section>

            <section>
                <div className="flex my-2 gap-2">
                    <div className="flex-1 px-2 justify-center w-16 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                        <div className="">
                            <p className="text-white font-bold">Total returns</p>
                            <p className="py-4 font-bold text-white">$30,000 </p>
                            <p className="text-green-300">+34.5%</p>
                        </div>
                    </div>
                    <div className="flex-1 px-2 justify-center w-16 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                        <div className="">
                            <p className="text-white font-bold">Total sales</p>
                            <p className="py-4 font-bold text-white">$30,000 </p>
                            <p className="text-green-300">+34.5%</p>
                        </div>
                    </div>
                    <div className="flex-1 px-2 justify-center w-16 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                        <div className="">
                            <p className="text-white font-bold">Total subscriptions</p>
                        </div>
                    </div>
                </div>

                <div className="w-1/2 h-[300px] dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner"></div>
            </section >

            <section>
                <div className="flex my-2 gap-2">
                    <div className="flex-1 px-2 justify-center w-16 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                        <div className="">
                            <p className="text-white font-bold">Total returns</p>
                            <p className="py-4 font-bold text-white">$30,000 </p>
                            <p className="text-green-300">+34.5%</p>
                        </div>
                    </div>
                    <div className="flex-1 px-2 justify-center w-16 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                        <div className="">
                            <p className="text-white font-bold">Total sales</p>
                            <p className="py-4 font-bold text-white">$30,000 </p>
                            <p className="text-green-300">+34.5%</p>
                        </div>
                    </div>
                    <div className="flex-1 px-2 justify-center w-16 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                        <div className="">
                            <p className="text-white font-bold">Total subscriptions</p>
                            <p className="py-4 font-bold text-white">$30,000 </p>
                            <p className="text-green-300">+34.5%</p>
                        </div>
                    </div>
                    <div className="flex-1 px-2 justify-center w-16 dark:bg-slate-800 bg-slate-200 rounded-lg p-4 drop-shadow-lg shadow-inner">
                        <div className="">
                            <p className="text-white font-bold">Total returns</p>
                            <p className="py-4 font-bold text-white">$30,000 </p>
                            <p className="text-green-300">+34.5%</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};



export default Charts;