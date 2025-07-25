import { useForm } from "react-hook-form";

interface UserRegistrationData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "User";
}

function Signin() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationData>();

  const registerUser = async (data: UserRegistrationData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/registration/register/user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, role: "User" }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("User registered successfully!");
        console.log(result);
        reset();
      } else {
        alert("Registration failed: " + result.message);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <form
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 ">
          SignUp Here
        </h2>

        <div>
          <label className="block font-semibold text-gray-700">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email format",
              },
            })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="example@email.com"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Phone</label>
          <input
            {...register("phone", {
              required: "Phone is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Enter 10-digit phone number",
              },
            })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="9876543210"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          onClick={handleSubmit(registerUser)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Register
        </button>

        <div className="text-center text-sm mt-3 text-gray-600">
          Already have an account?{" "}
          <a href="/" className="text-blue-600 font-medium hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}

export default Signin;
