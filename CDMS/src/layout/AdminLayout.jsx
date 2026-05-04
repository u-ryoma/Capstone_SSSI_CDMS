import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Rightpanel from "../components/Rightpanel";
import { Outlet, Navigate } from "react-router-dom";

const AdminLayout = () => {
  const role = sessionStorage.getItem("role");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="layout" style={{ flex: 1, minHeight: 0 }}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div
          className="content"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </div>
        <Rightpanel />
      </div>
    </div>
  );
};

export default AdminLayout;
