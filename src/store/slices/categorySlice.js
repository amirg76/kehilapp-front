import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    loadCategories(state, action) {
      state.categories = action.payload;
    },
    saveCategory(state, action) {
      const { newCategory } = action.payload;
      state.categories.push(newCategory);
    },
    updateCategory(state, action) {
      const { categoryToSave } = action.payload;
      state.categories = state.categories.map((category) =>
        category._id === categoryToSave._id ? categoryToSave : category
      );
    },
    removeCategory(state, action) {
      state.categories = state.categories.filter(
        (category) => category._id !== action.payload.categoryId
      );
    },
  },
});

export const categoryReducer = categorySlice.reducer;
export const categoryActions = categorySlice.actions;
