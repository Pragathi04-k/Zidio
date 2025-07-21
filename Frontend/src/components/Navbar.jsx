import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <style>{`
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #1f2937;
          color: white;
          padding: 16px;
        }

        .navbar-title {
          font-size: 20px;
          font-weight: bold;
        }

        .navbar-links {
          display: flex;
          gap: 24px; /* Space between nav links */
        }

        .navbar-links a {
          color: white;
          text-decoration: none;
        }

        .navbar-links a:hover {
          text-decoration: underline;
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-title">Blog Platform </div>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/create">Create</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
