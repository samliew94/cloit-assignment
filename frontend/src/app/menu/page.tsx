"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
  setMenus,
  setSelectedRootMenu,
  setSelectedMenu,
  setSelectedParentMenu,
  setTextMenuName,
} from "@/lib/features/menu/menuSlice";
import { Icon } from "@iconify/react";

const fetchMenus = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service: "menu",
      action: "get",
      type: "all",
    }),
  });
  if (res.ok) {
    const json = await res.json();
    return json.menus;
  }
};

const handleSave = async ({
  selectedMenu,
  selectedParentMenu,
  textMenuName,
  saveCallback,
}) => {
  await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service: "menu",
      action: "save",
      id: selectedMenu?.id,
      parentId: selectedParentMenu?.id,
      name: textMenuName,
    }),
  });
  saveCallback();
};

const handleSaveBranch = async ({
  selectedMenu,
  textMenuName,
  saveCallback,
}) => {
  await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service: "menu",
      action: "save",
      parentId: selectedMenu.id,
      name: textMenuName,
    }),
  });
  saveCallback();
};

const handleDelete = async ({ selectedMenu, deleteCallback }) => {
  await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service: "menu",
      action: "delete",
      id: selectedMenu.id,
    }),
  });
  deleteCallback();
};

const MenuTree = ({ menu }) => {
  const dispatch = useAppDispatch();
  const selectedMenu = useAppSelector((state) => state.menu.selectedMenu);
  const selectedRootMenu = useAppSelector(
    (state) => state.menu.selectedRootMenu,
  );
  const textMenuName = useAppSelector((state) => state.menu.textMenuName);

  const handleMenuClick = () => {
    dispatch(setSelectedMenu(menu));
    dispatch(setTextMenuName(menu.name));
    dispatch(setSelectedParentMenu(menu.parent));
  };

  return (
    <>
      <div>
        <div className="flex gap-1">
          <Icon
            icon="weui:arrow-filled"
            className="rotate-90"
            width="12"
            height="24"
          />
          <button onClick={handleMenuClick}>{menu.name}</button>
          {selectedMenu.id === menu.id && (
            <>
              <button
                onClick={() => {
                  handleSaveBranch({
                    selectedMenu,
                    textMenuName,
                    saveCallback: () => {
                      fetchMenus().then((data) => {
                        dispatch(setMenus(data));
                        dispatch(
                          setSelectedRootMenu(
                            data.find(
                              (menu) => menu.id === selectedRootMenu.id,
                            ),
                          ),
                        );
                      });
                    },
                  });
                }}
              >
                <Icon
                  icon="material-symbols:add-circle"
                  className="text-2xl text-blue-500"
                />
              </button>
            </>
          )}
        </div>
        {menu.children?.length > 0 && (
          <div className="pl-4">
            {menu.children.map((child) => (
              <MenuTree
                key={child.id}
                menu={{
                  ...child,
                  depth: menu.depth + 1,
                  parent: menu,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const Popup = ({ popupMessage, closeCallback }) => (
  <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
    <div className="flex flex-col items-center justify-center gap-4 rounded border bg-white px-8 py-4">
      <p>{popupMessage}</p>
      <button
        className="rounded bg-red-500 px-4 py-2 text-white active:bg-red-800"
        onClick={closeCallback}
      >
        Close
      </button>
    </div>
  </div>
);

export default function Menu() {
  const menus = useAppSelector((state) => state.menu.menus);
  const selectedRootMenu = useAppSelector(
    (state) => state.menu.selectedRootMenu,
  );
  const selectedMenu = useAppSelector((state) => state.menu.selectedMenu);
  const selectedParentMenu = useAppSelector(
    (state) => state.menu.selectedParentMenu,
  );
  const textMenuName = useAppSelector((state) => state.menu.textMenuName);
  const [popupMessage, setPopupMessage] = useState("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchMenus().then((data) => {
      dispatch(setMenus(data));
      dispatch(setSelectedRootMenu(data.length > 0 ? data[0] : null));
      dispatch(setSelectedMenu(data.length > 0 ? data[0] : null));
      dispatch(setTextMenuName(data.length > 0 ? data[0].name : ""));
    });
  }, []);

  return (
    <div className="flex h-screen flex-col gap-4 overflow-auto p-4">
      <p>Menus</p>
      <p>Menu</p>
      <select
        onChange={(e) => {
          const menuId = e.target.value;
          const menu = menus.find((menu) => menu.id === menuId);
          dispatch(setSelectedRootMenu(menu));
          dispatch(setSelectedMenu(menu));
          dispatch(setSelectedParentMenu(null));
          setTextMenuName(menu?.name || "");
        }}
        className="max-w-[400px] rounded border px-4 py-2"
      >
        <option value="">-- root --</option>
        {menus.map((menu) => (
          <option key={menu.id} value={menu.id}>
            {menu.name}
          </option>
        ))}
      </select>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
        <div>
          {selectedRootMenu && (
            <MenuTree key={selectedRootMenu.id} menu={selectedRootMenu} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p>Menu ID</p>
            <div className="max-w-[400px] rounded bg-neutral-300 px-4 py-2">
              <p>{selectedMenu?.id}</p>
            </div>
          </div>
          <div>
            <p>Depth</p>
            <div className="max-w-[400px] rounded bg-neutral-300 px-4 py-2">
              <p>{selectedMenu?.depth}</p>
            </div>
          </div>
          <div>
            <p>Parent Data</p>
            <div className="max-w-[400px] rounded bg-neutral-300 px-4 py-2">
              <p>{selectedParentMenu?.name}</p>
            </div>
          </div>
          <div>
            <p>Name</p>
            <input
              type="text"
              value={textMenuName ?? ""}
              onChange={(e) => {
                dispatch(setTextMenuName(e.target.value));
              }}
              className="w-full max-w-[400px] rounded border px-4 py-2"
            ></input>
          </div>
          <div className="grid w-full max-w-[400px] grid-cols-2 gap-2">
            <button
              onClick={() =>
                handleSave({
                  selectedMenu,
                  selectedParentMenu,
                  textMenuName,
                  saveCallback: () => {
                    setPopupMessage("Saved");
                    fetchMenus().then((data) => {
                      dispatch(setMenus(data));
                      dispatch(
                        setSelectedRootMenu(
                          data.find((menu) => menu.id === selectedRootMenu?.id),
                        ),
                      );
                    });
                  },
                })
              }
              className="flex items-center justify-center gap-1 bg-blue-500 py-2 text-white active:bg-blue-800"
            >
              <Icon icon="material-symbols:save" />
              <p>Save</p>
            </button>
            <button
              onClick={() => {
                handleDelete({
                  selectedMenu,
                  deleteCallback: () => {
                    setPopupMessage("Deleted");
                    fetchMenus().then((data) => {
                      dispatch(setMenus(data));
                      dispatch(
                        setSelectedRootMenu(
                          data.find((menu) => menu.id === selectedRootMenu.id),
                        ),
                      );
                      dispatch(setSelectedMenu(selectedParentMenu));
                    });
                  },
                });
              }}
              className="flex items-center justify-center gap-1 bg-red-500 py-2 text-white active:bg-red-800"
            >
              <Icon icon="material-symbols:delete" />
              <p>Delete</p>
            </button>
          </div>
        </div>
      </div>
      {popupMessage && (
        <Popup
          popupMessage={popupMessage}
          closeCallback={() => setPopupMessage("")}
        />
      )}
    </div>
  );
}
