import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    // Log user data (you can send this to an API later)
    console.log("Registering user:", {
      username,
      email,
      password,
    });

    // Show success alert
    alert(`Registered successfully!\nUsername: ${username}\nEmail: ${email}`);
    
    // Reset form
    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <style>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding-top: 60px;
          background-color: #f3f4f6;
        }

        .register-box {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 400px;
        }

        .register-title {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          color: #1d4ed8;
          margin-bottom: 24px;
        }

        .form-input {
          width: 100%;
          height: 48px;
          padding: 0 14px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          margin-bottom: 18px;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .submit-btn {
          width: 100%;
          height: 48px;
          background-color: #2563eb;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .submit-btn:hover {
          background-color: #1d4ed8;
        }
      `}</style>

      <div className="register-container">
        <div className="register-box">
          <h1 className="register-title">Create Your Account</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
