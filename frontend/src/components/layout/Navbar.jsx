import { NavLink } from "react-router-dom";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Menu", path: "/menu" },
  { name: "Gallery", path: "/gallery" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--background)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">

        <h1 className="text-3xl font-bold text-[var(--primary)]">
          Hotel Yashdeep
        </h1>

        <nav className="flex items-center gap-10">

          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className="font-medium text-[var(--text)] transition hover:text-[var(--primary)]"
            >
              {link.name}
            </NavLink>
          ))}

        </nav>

        <button className="rounded-xl bg-[var(--primary)] px-6 py-3 text-white transition hover:opacity-90">
          Reserve Table
        </button>

      </div>
    </header>
  );
}

export default Navbar;