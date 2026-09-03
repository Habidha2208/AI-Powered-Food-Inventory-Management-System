import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginUser = async () => {
  try {
    setError("");

    const res = await API.post("/users/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("name", res.data.user.name);

    navigate("/dashboard");

  } catch (error) {
    console.log(error);

    setError("Invalid Email or Password");
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
  Manage your pantry efficiently and reduce food waste.
</p>
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
        {error && (
  <p
    style={{
      color: "#ff4d4f",
      marginTop: "10px",
      marginBottom: "10px",
      fontWeight: "bold",
      textAlign: "left",
    }}
  >
    {error}
  </p>
)}

        <button onClick={loginUser}>
  🔐 Login
</button>

        <p>
          New User? <Link to="/register">Register Here</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;