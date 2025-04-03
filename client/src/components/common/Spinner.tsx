import React from 'react';
import { BallTriangle } from 'react-loader-spinner';

const Spinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <BallTriangle
                height={100}
                width={100}
                radius={5}
                color="#1ecdf8"
                ariaLabel="ball-triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    );
};

export default Spinner;
