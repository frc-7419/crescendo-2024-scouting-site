import React, { Suspense } from 'react';

const Page = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                
            </Suspense>
        </div>
    );
};

export default Page;
