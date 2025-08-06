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
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);

      const fetchProfile = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/api/registration/users"
          );
          const data: User[] = await response.json();

          const matchedUser = data.find((u) => u.name === user.name);
          if (matchedUser) {
            setProfile(matchedUser);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };

      fetchProfile();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

const handleUpdate = async () => {
  if (!profile) return;
  try {
    const response = await fetch(
      `http://localhost:5000/api/registration/update/${profile._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      }
    );
    const data = await response.json();

    localStorage.setItem("user", JSON.stringify(data));

    setMessage("Profile updated successfully!");
    setIsEditing(false);
    setUserName(data.name); 
    setProfile(data);       
  } catch (error) {
    console.error("Error updating profile:", error);
    setMessage(" Error updating profile");
  }
};


  return (
    <div>
      <h1 className="text-4xl flex justify-center pt-15 text-blue-500 font-bold">
        Profile
      </h1>

      <div className="flex items-center justify-center pt-8">
        <FaUser className="text-6xl text-blue-500" />
        <h1 className="pl-4 font-bold text-3xl text-blue-500">
          Welcome <span>{userName}</span>
        </h1>
      </div>

      {profile && (
        <div className="flex justify-center pt-8">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-96 text-left">
            <h2 className="text-xl font-semibold mb-4 text-blue-600">
              User Details
            </h2>
            <p className="mb-2">
              <label className="text-blue-600">Name:</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border border-gray-300 p-2 rounded ${
                  isEditing ? "" : "bg-gray-200"
                }`}
              />
            </p>
            <p className="mb-2">
              <label className="text-blue-600">Email:</label>
              <input
                type="text"
                name="email"
                value={profile.email}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border border-gray-300 p-2 rounded ${
                  isEditing ? "" : "bg-gray-200"
                }`}
              />
            </p>
            <p className="mb-4">
              <label className="text-blue-600">Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`w-full border border-gray-300 p-2 rounded ${
                  isEditing ? "" : "bg-gray-200"
                }`}
              />
            </p>

            <div className="flex justify-between">
              {isEditing ? (
                <>
                  <button
                    onClick={handleUpdate}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setMessage("");
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {message && (
              <p className="mt-4 text-sm text-green-600">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
