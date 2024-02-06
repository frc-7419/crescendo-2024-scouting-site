import React from 'react';

const DashCard = ({ title, content}: { title: string, content: React.JSX.Element }) => {
    return (
        <div className="bg-slate-800 rounded-lg p-6 mt-6 mb-6 drop-shadow-lg shadow-inner">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <div className="mt-4">
                {content}
            </div>
        </div>
    )
}

export default DashCard;
