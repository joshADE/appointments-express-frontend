import React from 'react';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
export type ErrorType = FetchBaseQueryError | SerializedError | undefined;

interface ErrorPageProps {
    errors: ErrorType[];
}

const ErrorPage = ({
    errors,
}:ErrorPageProps) => {
        return (
        <div className="h-full text-center bg-green-50 bg-opacity-90 rounded p-5 text-xs text-gray-500 whitespace-pre-wrap">
            Error fetching data from the server: <div className="text-left w-20 mx-auto">{JSON.stringify(errors, null,  2)}</div>
            If the status is 401 try refreshing the page and relogging
        </div>
    );
}

export default ErrorPage;