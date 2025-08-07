import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaImage, FaTimes } from "react-icons/fa";

interface FormCreationData {
  title: string;
  description: string;
  category: string;
  file?: FileList;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormCreationData>();

  const watchFile = watch("file");

  React.useEffect(() => {
    if (watchFile && watchFile[0]) {
      const file = watchFile[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }, [watchFile]);

  const submit = async (data: FormCreationData) => {
    setIsSubmitting(true);
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
      
      if (response.ok) {
        alert("Post created successfully!");
        reset();
        setImagePreview(null);
        navigate("/homepage");
      } else {
        alert(result.message || "Failed to create post");
      }
    } catch (error) {
      alert("Post failed: " + error);
      console.error("Post failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    reset({ file: undefined });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/homepage")}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <FaArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">Create New Post</h1>
            </div>
            <button
              onClick={() => navigate("/homepage")}
              className="text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit(submit)} className="p-8 space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="What's your brilliant idea?"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Describe your idea in detail... What problem does it solve? How does it work?"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (Optional)
              </label>
              
              {!imagePreview ? (
                <div className="relative">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaImage className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      {...register("file")}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/homepage")}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isSubmitting ? "Publishing..." : "Publish Idea"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
