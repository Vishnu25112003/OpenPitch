import {Link} from 'react-router-dom'

const Verities : React.FC = () => {
    return (
        <div>
            <li>
                <Link to="/homepage">Home</Link>
            </li>
            <li>
                <Link to="/create">Create</Link>
            </li>
            <li>
                <Link to="/profile">Profile</Link>
            </li>
        </div>
    )
}

export default Verities