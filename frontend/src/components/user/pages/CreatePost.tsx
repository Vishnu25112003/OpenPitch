import React from "react";
import { useForm } from "react-hook-form";

interface FormCreationData {
  title: string;
  description: string;
  category: string;
  file?: FileList;
}

const CreatePost: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormCreationData>();

  // const submit = async (data: FormCreationData) => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/idea/create", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       credentials: "include",
  //       body: JSON.stringify(data),
  //     });
  //     const result = await response.json();
  //     alert(result.message);
  //     console.log("Post response:", result);

  //   } catch (error) {
  //     alert("Post failed: " + error);
  //     console.error("Post failed:", error);
  //   }
  // };

  const submit = async (data: FormCreationData) => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      if (data.file && data.file[0]) {
        formData.append("image", data.file[0]);
      }

      const response = await fetch("http://localhost:5000/api/idea/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      alert(result.message);
      console.log("Post response:", result);
      reset();
    } catch (error) {
      alert("Post failed: " + error);
      console.error("Post failed:", error);
    }
  };

  return (
    <div>
      <div className="text-4xl flex justify-center pt-15 text-blue-500 font-bold">
        <h1>Create Post</h1>
      </div>
      <div className="flex justify-center items-center  pt-15">
        <form
          action="/create"
          method="post"
          encType="multipart/form-data"
          className="flex flex-col space-y-4"
          onSubmit={handleSubmit(submit)}
        >
          {errors.title && (
            <span className="text-red-500">Title is required</span>
          )}
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            placeholder="Title"
            className="border border-blue-500 rounded-md p-2"
          />
          <input
            type="text"
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Description"
            className="border border-blue-500 rounded-md p-2"
          />
          <input
            type="text"
            {...register("category", { required: "Category is required" })}
            placeholder="Category"
            className="border border-blue-500 rounded-md p-2"
          />
          <input
            type="file"
            {...register("file", { required: "Image is required" })}
            className="border border-blue-500 rounded-md p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
