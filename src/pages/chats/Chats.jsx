import React from "react";
import SidebarLayoutComponent from "../../components/SidebarLayoutComponent";
import ChatsListComponent from "../../components/chats";
import LayoutComponent from "../../components/LayoutComponent";

function Chats() {
  return (
    <LayoutComponent>
      <ChatsListComponent />
    </LayoutComponent>
  );
}

export default Chats;
