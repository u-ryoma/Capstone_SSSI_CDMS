import { useEffect, useState } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <i className="fas fa-microscope"></i>
        <span>Scientific Standard Services</span>
      </div>

      <div className="header-right">{time}</div>
    </header>
  );
}
