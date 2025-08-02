import {Link} from 'react-router-dom'
import {FaHome, FaPlus, FaUser} from 'react-icons/fa'

const Verities : React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white  shadow-md list-none flex justify-center items-center px-4 py-2 space-x-20">
            <li>
                <Link to="/homepage">
                    <FaHome className='text-4xl text-blue-600 ' />
                </Link>
            </li>
            <li>
                <Link to="/create">
                    <FaPlus className='text-4xl text-blue-600' />
                </Link>
            </li>
            <li>
                <Link to="/profile">
                    <FaUser className='text-4xl text-blue-600' />
                </Link>
            </li>
        </div>
    )
}

export default Verities