import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Sidebar() {
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

  // ==========================
  // SAVE LOG HELPER
  // ==========================
  async function saveLog(action) {
    try {
      await fetch("http://localhost:3000/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: sessionStorage.getItem("activeUser"),
          name: sessionStorage.getItem("activeName"),
          role: sessionStorage.getItem("userRole"),
          action,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (err) {
      console.error("Log error:", err);
    }
  }

  // ==========================
  // HEARTBEAT
  // ==========================
  useEffect(() => {
    if (!sessionStorage.getItem("activeUser")) return;

    async function sendHeartbeat() {
      try {
        await fetch("http://localhost:3000/api/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: sessionStorage.getItem("activeUser"),
          }),
        });
      } catch (err) {
        console.error("Heartbeat error:", err);
      }
    }

    sendHeartbeat();
    const heartbeat = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(heartbeat);
  }, []);

  // ==========================
  // TAB/BROWSER CLOSE
  // ==========================
  useEffect(() => {
    const handlePageHide = (e) => {
      if (!sessionStorage.getItem("activeUser")) return;
      if (e.persisted) return;

      // remove from heartbeat
      navigator.sendBeacon(
        "http://localhost:3000/api/logout",
        new Blob(
          [JSON.stringify({ username: sessionStorage.getItem("activeUser") })],
          { type: "application/json" },
        ),
      );

      // save logout log
      navigator.sendBeacon(
        "http://localhost:3000/api/logs",
        new Blob(
          [
            JSON.stringify({
              username: sessionStorage.getItem("activeUser"),
              name: sessionStorage.getItem("activeName"),
              role: sessionStorage.getItem("userRole"),
              action: "logged out",
              timestamp: new Date().toISOString(),
            }),
          ],
          { type: "application/json" },
        ),
      );
    };

    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  // ==========================
  // REDIRECT IF SESSION EXPIRED
  // ==========================
  useEffect(() => {
    if (!sessionStorage.getItem("activeUser")) {
      localStorage.removeItem("name");
      localStorage.removeItem("username");
      navigate("/", { replace: true });
    }
  }, []);

  // ==========================
  // LOGOUT
  // ==========================
  async function handleLogout() {
    await saveLog("logged out");

    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: sessionStorage.getItem("activeUser"),
      }),
    });

    sessionStorage.clear();
    localStorage.removeItem("name");
    localStorage.removeItem("username");
    navigate("/", { replace: true });
  }

  return (
    <aside className="sidebar">
      <nav className="nav-menu">
        <p className="nav-label">Main Menu</p>
        {(role === "admin" || role === "owner") && (
          <Link className="nav-link" to="/admin">
            Dashboard
          </Link>
        )}
        <Link className="nav-link" to="/admin/customer">
          Customer
        </Link>
        <Link className="nav-link" to="/admin/joblist">
          Job Number List
        </Link>
        {role === "owner" && (
          <Link className="nav-link" to="/admin/accounts">
            Accounts
          </Link>
        )}
        {role === "owner" && (
          <Link className="nav-link" to="/admin/systemactivity">
            System Activity
          </Link>
        )}

        <p className="nav-label">Calibration</p>
        <Link className="nav-link" to="/admin/incomingcalib">
          Incoming Calibration
        </Link>
        <Link className="nav-link" to="/admin/ongoinggcalib">
          On Going Calibration
        </Link>
        <Link className="nav-link" to="/admin/sitecalibration">
          Site Calibration
        </Link>
        <Link className="nav-link" to="/admin/standardforcalib">
          Standard For Calibration
        </Link>
        <Link className="nav-link" to="/admin/schedmonitor">
          Schedule Monitor
        </Link>

        <p className="nav-label">Standards</p>
        <Link className="nav-link" to="/admin/stdforcertification">
          Std For Certification
        </Link>
        <Link className="nav-link" to="/admin/stdforupdate">
          Std For Update
        </Link>
        <Link className="nav-link" to="/admin/recallsys">
          Recall System
        </Link>
        <Link className="nav-link" to="/admin/assetmonitoring">
          Asset Monitoring
        </Link>
        <Link className="nav-link" to="/admin/instrumenttag">
          Instrument Tag
        </Link>

        <p className="nav-label">Quotation</p>
        <Link className="nav-link" to="/admin/qtnlist">
          Quotation List
        </Link>
        <Link className="nav-link" to="/admin/qtnforcheck">
          Qtn For Check
        </Link>
        <Link className="nav-link" to="/admin/qtnforfile">
          Qtn For File
        </Link>
        <Link className="nav-link" to="/admin/qtnforfolowup">
          Qtn For Follow Up
        </Link>

        <p className="nav-label">Concerns</p>
        <Link className="nav-link" to="/admin/concernincoming">
          Concern Incoming
        </Link>
        <Link className="nav-link" to="/admin/concernout">
          Concern Out
        </Link>

        <p className="nav-label">Documents</p>
        <Link className="nav-link" to="/admin/jobreceipt">
          Job Receipt
        </Link>
        <Link className="nav-link" to="/admin/deliveryreceipt">
          Delivery Receipt
        </Link>
        <Link className="nav-link" to="/admin/printagreement">
          Print Agreement
        </Link>
        <Link className="nav-link" to="/admin/printfinal">
          Print Final
        </Link>

        <p className="nav-label">Checking</p>
        <Link className="nav-link" to="/admin/forcheckingic">
          For Checking OIC
        </Link>
        <Link className="nav-link" to="/admin/forcheckingsig">
          For Checking Sig
        </Link>
        <Link className="nav-link" to="/admin/fortyping">
          For Typing
        </Link>
        <Link className="nav-link" to="/admin/monitoring">
          Monitoring
        </Link>
        <Link className="nav-link" to="/admin/onholdlist">
          On Hold List
        </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="user-display">
          <i className="fas fa-user-circle"></i>
          <span>{sessionStorage.getItem("activeName") || "User"}</span>
        </div>
        <a className="nav-link logout" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </div>
    </aside>
  );
}
