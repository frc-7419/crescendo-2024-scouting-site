import React from 'react';

const DashCard = ({ title, content, size}: { title: string, content: React.JSX.Element, size: string }) => {
    return (
        <div className="dark:bg-slate-800 bg-slate-200 rounded-lg p-6 mb-6 drop-shadow-lg shadow-inner">
            <h1 className={size}>{title}</h1>
            <div className="mt-4">
                {content}
            </div>
        </div>
    )
}

export default DashCard;
