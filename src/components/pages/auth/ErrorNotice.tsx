import React from 'react'

const ErrorNotice: React.FC<{message: string; clearError: () => void}> = ({message, clearError}) => {
    return (
        <div className="text-red-700">
            <span>{message}</span>
            <button onClick={clearError}>X</button>
        </div>
    )
}

export default ErrorNotice
