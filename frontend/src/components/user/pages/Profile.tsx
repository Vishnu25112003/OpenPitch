import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

const Profile: React.FC = () => {
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
      console.log(user);
    }
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-4xl flex justify-center pt-15 text-blue-500 font-bold">
          Profile
        </h1>
      </div>
      <div>
        <div className="flex items-center justify-center pt-8">
          <div>
            <FaUser className="text-6xl text-blue-500" />
          </div>
          <div> 
            <h1>{userName}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
