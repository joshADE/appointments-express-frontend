import React from 'react'
import { RiCloseLine } from 'react-icons/ri'

interface ModalProps {
    setModalOpen: (open: boolean) => void; 
    title: string;
    bodyText: string;
}

const Modal: React.FC<ModalProps> = ({
    setModalOpen,
    title,
    bodyText,
    children,
}) => {
        return (
        <>
            <div className="bg-black opacity-20 w-screen h-screen z-40 top-1/2 left-1/2 absolute transform -translate-x-1/2 -translate-y-1/2" onClick={() => setModalOpen(false)} />
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="w-64 bg-white z-50 rounded-2xl shadow-xl p-5">
                    <div className="h-14 bg-white overflow-hidden rounded-t-2xl">
                        <h5 className="m-0 p-3 text-gray-500 font-medium text-lg text-center">{title}</h5>
                    </div>
                    <button className="font-medium px-2 py-1 rounded-lg text-lg text-gray-500 bg-white transition-all shadow-lg absolute transform right-0 top-0 self-end -mt-2 -mr-2 hover:-translate-x-1 hover:translate-y-1 hover:shadow-sm" onClick={() => setModalOpen(false)}>
                         <RiCloseLine className="-mb-1" />
                    </button>
                    <div className="p-3 text-sm text-gray-500 text-center">
                        {bodyText}
                    </div>
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </>);
}

export default Modal;