import { createSlice } from "@reduxjs/toolkit";

interface Menu {
  id: string;
  name: string;
  parent: string;
  depth: number;
  children: Menu[];
}

interface MenuSliceState {
  menus: Menu[];
  selectedRootMenu: Menu;
  selectedMenu: Menu;
  selectedParentMenu: Menu;
  textMenuName: string;
}

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menus: [],
    selectedRootMenu: {
      id: "",
      name: "",
      parent: "",
      depth: 0,
      children: [],
    } as Menu,
    selectedMenu: {
      id: "",
      name: "",
      parent: "",
      depth: 0,
      children: [],
    } as Menu,
    selectedParentMenu: {
      id: "",
      name: "",
      parent: "",
      depth: 0,
      children: [],
    } as Menu,
    textMenuName: "",
  } as MenuSliceState,
  reducers: {
    setMenus: (state, action) => {
      state.menus = action.payload;
    },
    setSelectedRootMenu: (state, action) => {
      state.selectedRootMenu = action.payload;
    },
    setSelectedMenu: (state, action) => {
      state.selectedMenu = action.payload;
    },
    setSelectedParentMenu: (state, action) => {
      state.selectedParentMenu = action.payload;
    },
    setTextMenuName: (state, action) => {
      state.textMenuName = action.payload;
    },
  },
});

export const {
  setMenus,
  setSelectedRootMenu,
  setSelectedMenu,
  setSelectedParentMenu,
  setTextMenuName,
} = menuSlice.actions;

export default menuSlice.reducer;
