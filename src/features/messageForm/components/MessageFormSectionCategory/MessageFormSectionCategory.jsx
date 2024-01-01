import React from "react";

const MessageFormSectionCategory = ({
  categories,
  handleChange,
  categoryId,
}) => {
  return (
    <>
      {/* Category  */}
      <div className="relative w-1/2 mb-5">
        <select
          name="categoryId"
          onChange={handleChange}
          className="block appearance-none w-full bg-white text-gray-400 border border-gray-300 hover:border-gray-500 py-2 px-4 rounded-md leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="">קטגוריה</option>

          {categories &&
            categories.map((category) => (
              <option
                key={category._id}
                value={category._id}
              >
                {category.title}
              </option>
            ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700">
          {/* <!-- Arrow icon or styling can be added here --> */}
          <svg
            className="fill-current h-4 w-3   "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M10 12l-6-6-1.4 1.4L10 15.8l7.4-7.4L16 6z" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default MessageFormSectionCategory;
