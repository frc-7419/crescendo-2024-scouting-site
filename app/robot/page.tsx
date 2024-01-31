import React, { Suspense } from 'react';

const Form = React.lazy(() => import('./Form.client'));

const Page = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Form />
            </Suspense>
        </div>
    );
};

export default Page;