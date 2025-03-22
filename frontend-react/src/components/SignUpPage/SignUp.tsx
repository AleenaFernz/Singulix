import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import "./SignUp.css";

interface SignUpFormData {
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await signup(formData.email, formData.password);
      setSuccess(
        "Account created successfully! Redirecting to admin dashboard..."
      );
      setTimeout(() => navigate("/admin"), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <nav className="signup-nav">
        <div className="signup-logo">Singulix</div>
      </nav>

      <div className="signup-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="signup-form-wrapper"
        >
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Join Singulix to revolutionize your event management</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="alert alert-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success" role="alert">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="signup-button"
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="login-link">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")}>Sign in</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
