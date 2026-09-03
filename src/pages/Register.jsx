import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const registerUser = async () => {
    try {
      await API.post("/users/register", {
        name,
        email,
        password,
      });

      setSuccess("✅ Registration Successful!");

setTimeout(() => {
  navigate("/");
}, 1500);
    } catch (error) {
      console.log(error);
      setSuccess("❌ Registration Failed");

setTimeout(() => {
  setSuccess("");
}, 3000);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1>🥗 FreshGuard</h1>

<p
  style={{
    color: "white",
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "16px",
  }}
>
  Create your account to manage your pantry smartly.
</p>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={registerUser}>
  🚀 Register
</button>

        <p>
  Already have an account?
  <br />
  <Link to="/">
    Login Now
  </Link>
</p>

      </div>
      {success && (
  <div className="toast-success">
    {success}
  </div>
)}
    </div>
  );
}

export default Register;