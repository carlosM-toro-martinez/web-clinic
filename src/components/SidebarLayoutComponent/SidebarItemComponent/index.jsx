import { NavLink } from "react-router-dom";

import React from "react";

function SidebarItemComponent() {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "sidebar-item--active font-semibold" : ""} ${
          collapsed ? "justify-center" : ""
        }`
      }
    >
      <Icon size={18} />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}

export default SidebarItemComponent;
