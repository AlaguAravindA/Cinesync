import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebaseauth";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import ErrorModal from "./errorModal.tsx";
import Loader from "../Loader.tsx";
import eyesopen from "D:\\project_react\\moviesapp1\\src\\components\\images\\8666618_eye_icon.svg";
import eyesclose from "D:\\project_react\\moviesapp1\\src\\components\\images\\8666649_eye_off_icon.svg";
import img from "D:\\project_react\\moviesapp1\\src\\components\\images\\c.png";
import gsign from "D:\\project_react\\moviesapp1\\src\\components\\images\\gsignin.svg";
import { animated, useSpring } from "react-spring";
import mypass from "../images/posters/undraw_my_password_re_ydq7.svg";

const fetchPreferences = async (userId) => {
  const response = await fetch(`/prefrences/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch preferences data from the server.");
  }
  return response.json();
};
const fetchWatchlist = async (userId) => {
  const response = await fetch(`/watchlists/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch watchlist data from the server.");
  }
  return response.json();
};
export default function Login() {
  const history = useNavigate();

  // State variables
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [textPass, setTextPass] = useState("password");
  const [eyes, setEyes] = useState(eyesopen);
  const [errorMessage, setErrorMessage] = useState("");

  // Toggle password visibility
  const handleTextToPass = () => {
    setTextPass((prevText) => (prevText === "password" ? "text" : "password"));
    setEyes((prevEyes) => (prevEyes === eyesopen ? eyesclose : eyesopen));
  };

  // Sign in with email and password
  const signInWithEmailAndPasswordHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        pass
      );
      const userId = userCredential.user.uid;
      console.log(userId);

      const preferencesData = await fetchPreferences(userId);
      const WatchlistData = await fetchWatchlist(userId);
      console.log(WatchlistData);

      if (preferencesData.exists && WatchlistData) {
        // If the user has preferences, navigate to home
        history("/home");
      } else {
        // If the user does not have preferences, redirect to preferences selection
        history("/pref/" + userId);
      }
    } catch (error) {
      console.error("Error signing in with email and password:", error.message);
      setErrorMessage(error.code);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Send reset email
  const handleForgotPassword = async () => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      alert("Email sent");
    } catch (error) {
      setShowError(true);
      setErrorMessage(error.code);
    } finally {
      setIsLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setShowError(false);
  };

  // Google sign-in
  // Google sign-in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const userId = result.user.uid;
      console.log(userId);

      // Fetch user preferences and watchlist data
      const preferencesData = await fetchPreferences(userId);
      const watchlistData = await fetchWatchlist(userId);
      console.log(watchlistData);

      if (preferencesData.exists && watchlistData) {
        // If the user has preferences and watchlist data, navigate to home
        history("/home");
      } else {
        // If the user does not have preferences or watchlist data, redirect to preferences selection
        history("/pref/" + userId);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {showError && (
        <ErrorModal errorMeassge={errorMessage} onclose={closeModal} />
      )}
      <div className='bg-transparent min-h-screen flex items-center justify-center px-4 py-16'>
        <div className='w-full max-w-md p-8 bg-slate-200 bg-opacity-70 rounded-lg shadow-lg'>
          <div className='text-center'>
            <img
              className='mx-auto h-24 w-auto mb-4 rounded-full'
              src={img}
              alt='Your Company'
            />
            <h2 className='text-2xl font-bold text-gray-900'>
              Login to Your Account
            </h2>
          </div>

          <form
            className='mt-8 space-y-6'
            action='#'
            method='POST'
            onSubmit={signInWithEmailAndPasswordHandler}
          >
            {/* Email input */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-900'
              >
                Email address
              </label>
              <div className='mt-1'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className='block w-full rounded-md border py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring focus:border-indigo-700 focus:outline-none focus:ring-2'
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-900'
                >
                  Password
                </label>
                <div className='text-sm'>
                  <Link
                    to='#'
                    onClick={handleForgotPassword}
                    className='font-semibold text-indigo-600 hover:text-indigo-500'
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <div className='mt-1 relative rounded-md'>
                <input
                  id='password'
                  name='password'
                  type={textPass}
                  autoComplete='current-password'
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className='block w-full rounded-md border py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring focus:border-indigo-700 focus:outline-none focus:ring-2 pr-10' // Adjusted styling
                />
                <p
                  className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 rounded-md cursor-pointer'
                  onClick={handleTextToPass}
                >
                  <img src={eyes} alt='' className='pt-0.5' />
                </p>
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type='submit'
                className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-700'
              >
                Login
              </button>
            </div>
          </form>

          {/* Google Sign-in button */}
          <div className='mt-4 text-center'>
            <button onClick={handleGoogleSignIn} className='inline-block'>
              <img src={gsign} alt='Google Sign-in' />
            </button>
          </div>

          {/* Register link */}
          <p className='mt-6 text-center text-sm text-gray-600'>
            Not a member?{" "}
            <Link
              to={"/register"}
              className='font-semibold text-indigo-600 hover:text-indigo-500'
            >
              Register here
            </Link>
            <br />
            <br />
            <Link to='/' className='text-indigo-600 hover:text-indigo-500'>
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
