import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEdit, FaArrowLeft, FaEnvelope, FaPhone, FaCheck, FaTimes } from "react-icons/fa";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);

      const fetchProfile = async () => {
        try {
          setIsLoading(true);
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
        } finally {
          setIsLoading(false);
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
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage("");
    // Reset form to original values
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setProfile(user);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/homepage")}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                <FaEdit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Welcome, {userName}!</h1>
              <p className="text-indigo-100">Manage your profile information</p>
            </div>
          </div>
        </div>

        {profile && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              <p className="text-sm text-gray-500 mt-1">
                Keep your personal information up to date
              </p>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Name Field */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FaUser className="h-4 w-4 text-indigo-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.name}</p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaEnvelope className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.email}</p>
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaPhone className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{profile.phone}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FaTimes className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaCheck className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}

              {/* Success/Error Message */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes("successfully") 
                    ? "bg-green-50 text-green-800 border border-green-200" 
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
