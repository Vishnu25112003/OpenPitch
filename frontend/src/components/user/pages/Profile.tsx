import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const Profile: React.FC = () => {
  const [userName, setUserName] = useState<string>("");

  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
      console.log(user);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/registration/users"
        );
        const data = await response.json();
        console.log("Profile data:", data);
        
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
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
          <div className="pl-4 font-bold text-3xl text-blue-500">
            <h1>
              {" "}
              Welcome <span>"{userName}"</span>
            </h1>
          </div>
        </div>
      </div>

      <div>
        {profile && (
          <div className="flex justify-center pt-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96 text-left">
              <h2 className="text-xl font-semibold mb-4 text-blue-600">
                User Details
              </h2>
              <p className="mb-2">
                <label htmlFor="name" className="text-blue-600">Name:</label>
                <input type="text" value={profile.name} className="mb-2 border border-gray-300 p-2 rounded" />
              </p>
              <p className="mb-2">
                <label htmlFor="email" className="text-blue-600">Email:</label>
                <input type="text" value={profile.email} className="mb-2 border border-gray-300 p-2 rounded" />
              </p>
              <p className="mb-2">
                <label htmlFor="phone" className="text-blue-600">Phone:</label>
                <input type="text" value={profile.phone} className="mb-2 border border-gray-300 p-2 rounded" />
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
