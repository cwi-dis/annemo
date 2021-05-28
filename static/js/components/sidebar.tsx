import * as React from "react";

interface SidebarProps {
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <div style={{ width: "25%" }}>
      Menu
    </div>
  );
};

export default Sidebar;
