import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const base = "px-3 py-2 rounded-lg text-sm font-medium";
  const active = "bg-blue-600 text-white";
  const idle = "text-blue-600 hover:bg-blue-100";

  return (
    <header className="bg-white shadow sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-700 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">🛡️</span>
          ARMOR
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/verify" className={({isActive}) => `${base} ${isActive ? active : idle}`}>Verify UPI</NavLink>
          <NavLink to="/report" className={({isActive}) => `${base} ${isActive ? active : idle}`}>Report Fraud</NavLink>
        </nav>
      </div>
    </header>
  );
}
