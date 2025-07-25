import React from "react";
import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
  role: "User" | "Admin";
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const loginUser = async (data: LoginFormData) => {
    try {
      const response = await fetch("http://localhost:5000/api/login/login/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Login successful!");
        console.log(result);
      } else {
        alert("Login failed: " + result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Error: " + error.message);
        console.error(error.message);
      } else {
        console.error("Unknown error:", error);
        alert("Unknown error occurred");
      }
    }
  };

  const loginAdmin = async (data: LoginFormData) => {
    try {
      const response = await fetch("http://localhost:5000/api/login/login/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Admin login successful!");
        console.log(result);
      } else {
        alert("Admin login failed: " + result.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert("Error: " + error.message);
        console.error(error.message);
      } else {
        console.error("Unknown error:", error);
        alert("Unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleSubmit(loginAdmin)}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Login Here
        </h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your password"
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          onClick={handleSubmit(loginUser)}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signin"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
