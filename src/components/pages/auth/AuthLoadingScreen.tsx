import React from 'react';
import { SkewLoader } from 'react-spinners';

const AuthLoadingScreen = () => {
    return (
        <div
            className="h-screen flex justify-center items-center"
        >
            <SkewLoader
                color="#333"
                loading={true}
                size="70px"
            />
        </div>
    )
}

export default AuthLoadingScreen
