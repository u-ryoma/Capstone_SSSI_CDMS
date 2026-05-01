// import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
// import Rightpanel from "../components/Rightpanel";
// import { Outlet } from "react-router-dom";

// const AdminLayout = () => {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
//       <Header />
//       <div className="layout" style={{ flex: 1, minHeight: 0 }}>
//         <Sidebar />
//         <div
//           className="content"
//           style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
//         >
//           <Outlet />
//         </div>
//         <Rightpanel />
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Rightpanel from "../components/Rightpanel";
import { Outlet, Navigate } from "react-router-dom";

const AdminLayout = () => {
  const role = sessionStorage.getItem("role");
  if (!role) {
    return <Navigate to="/" replace />;
  }

  // ← redirect to login if not logged in
  if (!role) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <div className="layout" style={{ flex: 1, minHeight: 0 }}>
        <Sidebar />
        <div
          className="content"
          style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
        >
          <Outlet />
        </div>
        <Rightpanel />
      </div>
    </div>
  );
};

export default AdminLayout;
