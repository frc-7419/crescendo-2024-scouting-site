'use client';

import NavBar from '@/components/nav-bar';
import SideBar from '@/components/side-bar';
import React, {useContext, useEffect, useState} from 'react';
import DashCard from '@/components/templates/dash-card';
import axios from 'axios';
import {LoadStatusContext} from '@/components/LoadStatusContext';
import Loading from '@/components/loading';
import ManageDisputes from "@/components/manage-disputes";
import AcceptDisputes from "@/components/accept-disputes";

const Dashboard = () => {
    const {value, setValue} = useContext(LoadStatusContext) as {
        value: number;
        setValue: React.Dispatch<React.SetStateAction<number>>
    };
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sentDisputes, setSentDisputes] = useState([]);

    useEffect(() => {
        setValue(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        try {
            axios.get(`/api/disputes/get`, {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                },
            })
                .then(response => response.data)
                .then(data => {
                    console.debug(data);
                    setDisputes(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
            axios.get(`/api/disputes/get/sent`, {
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
                    );
                    setValue(percentCompleted);
                },
            })
                .then(response => response.data)
                .then(data => {
                    console.debug(data);
                    setSentDisputes(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <Loading/>
    }

    return (
        <main className="min-h-screen overflow-clip dark:bg-slate-950">
            <SideBar/>
            <NavBar/>
            <div id='dash' className="pt-6 pr-6 pl-6 flex flex-col">

                <div id='cards' className="mt-4 overflow-y-auto flex-1">
                    <DashCard title="Accept Disputes"
                              content={<AcceptDisputes disputes={sentDisputes} loading={loading}/>}/>
                    <DashCard title="Manage Disputes"
                              content={<ManageDisputes disputes={disputes} loading={loading}/>}/>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
