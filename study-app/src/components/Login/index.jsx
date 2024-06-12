import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login({ setAuthState }) {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [inputData, setInputData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: false, password: false });
  const [showMessage, setShowMessage] = useState(false);

  const handleChange = (e) => {
    setShowMessage(false);
    const { value, name } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      username: inputData.username.trim() === "",
      password: inputData.password.trim() === "",
    };
    setErrors(newErrors);

    if (newErrors.username || newErrors.password) {
      console.log("Some inputs are empty");
      return;
    }

    try {
      const response = await axios.post(`${serverUrl}/user/login`, inputData);
      console.log("response from post.login", response.data.username); //message : "Username or Password is Incorrect"

      const handleCorrectAuth = () => {
        console.log("-------------------------------");
        setAuthState({
          username: response.data.username,
          id: response.data.userId, //"6667f4b39da6637d5ed0994d"
          status: true,
        });
        setInputData({ username: "", password: "" });
        navigate("/");
      };
      response.data.username ? handleCorrectAuth() : setShowMessage(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="signUpContainer">
      <div className="card">
        <form className="inputsContainer" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            name="username"
            type="text"
            placeholder="Username..."
            value={inputData.username}
            className={errors.username ? "inputEmpty" : "input"}
          />

          <input
            onChange={handleChange}
            name="password"
            type="text"
            placeholder="Password..."
            value={inputData.password}
            className={errors.password ? "inputEmpty" : "input"}
          />

          
            <div className="textMessage">{showMessage ? "Incorrect Username or Password" : "" }</div>
          

          {/* {showMessage ? <div className="textMessage">Username or Password is Incorrect</div> : <Link to="forgot-password" className="forgotPasswordLink">
            Forgot Password
          </Link>} */}

          <button className="submitBtn" type="submit">
            Login
          </button>
        </form>
        <div className="signUpLinkContainer">
          <div>Don't have an account?</div>
          <div className="signUpLink" onClick={() => navigate("/signup")}>
            Sign Up
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
