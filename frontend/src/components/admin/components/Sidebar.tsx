import React from 'react'
import {FaHome, FaPlus, FaUser} from 'react-icons/fa'



const Sidebar : React.FC = () => {
    return (
        <div className="flex flex-col h-screen w-64 bg-gray-100">
            <div className="flex items-center justify-center h-16 bg-gray-200"> 
                <h1 className="text-2xl font-semibold text-gray-800">OpenPitch</h1>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ul className="mt-4">
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        <FaHome className="mr-2" />
                        <span>Home</span>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        <FaPlus className="mr-2" />
                        <span>Create</span>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                        <FaUser className="mr-2" />
                        <span>Profile</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar