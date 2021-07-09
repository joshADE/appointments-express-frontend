import React from 'react'

const ErrorNotice: React.FC<{message: string}> = ({message}) => {
    return (
        <div className="text-red-400 text-sm">
            <span>{message}</span>
        </div>
    )
}

export default ErrorNotice
