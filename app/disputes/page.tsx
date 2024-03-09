'use client';

import React, {useContext, useEffect, useState} from 'react';
import DashCard from '@/components/templates/dash-card';
import axios from 'axios';
import {LoadStatusContext} from '@/components/loading/LoadStatusContext';
import Loading from '@/components/loading/loading';
import ManageDisputes from "@/components/scouting/manage-disputes";
import AcceptDisputes from "@/components/scouting/accept-disputes";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const Dashboard = () => {
    const {setValue} = useContext(LoadStatusContext) as {
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
        <DashboardLayout>
            <div id='cards' className="mt-4 overflow-y-auto flex-1">
                <DashCard title="Accept Disputes"
                          content={<AcceptDisputes disputes={sentDisputes} loading={loading}/>}/>
                <DashCard title="Manage Disputes"
                          content={<ManageDisputes disputes={disputes} loading={loading}/>}/>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
