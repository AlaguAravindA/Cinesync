import React, { useState, useEffect, useRef } from "react";
import imgsrc from "D:\\project_react\\moviesapp1\\src\\components\\images\\c.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "D:\\project_react\\moviesapp1\\src\\firebaseauth.js";
import { error } from "console";
import { title } from "process";
import logout from "./images/logout.svg";
import pref from "./images/pref.svg";

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameemail, setUserNameemail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [userId, setUserId] = useState("");
  const historys = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // Check if the click is inside the button or the dropdown
      const isButtonClick = (event.target as HTMLElement).closest(
        ".text-slate-400"
      ); // Adjust the class accordingly
      const isDropdownClick =
        dropdownRef.current &&
        dropdownRef.current.contains(event.target as Node);

      // Close the dropdown only if the click is outside the button and the dropdown
      if (!isButtonClick && !isDropdownClick) {
        setShowDropdown(false);
      }
    };

    // Add event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setUserName(user?.displayName || "");
      setUserNameemail(user?.email || "");
      setUserId(user?.uid || "");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const closeMobileMenu = () => {
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.body.addEventListener("click", closeMobileMenu);

    return () => {
      document.body.removeEventListener("click", closeMobileMenu);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      setMobileMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      historys("/home");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };
  function extractUsername(email) {
    // Using a regular expression to extract the username
    const match = email.match(/^([a-zA-Z0-9._%+-]+)@/);
    if (match && match[1]) {
      return match[1];
    } else {
      // Return null or handle the case where no match is found
      return "";
    }
  }

  let usernameemail = extractUsername(userNameemail);
  if (userName === "" && userNameemail != null) {
    usernameemail = usernameemail;
  } else if (userName != null && userNameemail === "") {
    usernameemail = userName;
  } else if (userName != "" || userNameemail != "") {
    usernameemail = userName;
  } else {
    console.log("some problem");
  }

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(
        `/searchmovies/movietitle/${query}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      var titles = data.similarTitles.map((stitles) => stitles.original_title);

      if (titles.length > 0) {
        setSuggestions(titles);
      } else {
        setSuggestions(["No RESULT found"]);
      }
    } catch (error) {
      console.error("Error fetching or processing data:", error);
      setSuggestions(["No RESULT found"]);
    }
  };
  const navigate = useNavigate();
  const handleprefrence = () => {
    navigate(`/pref/${userId}`);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() !== "") {
      fetchSuggestions(query);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <>
      <div className='bg-opacity-10 bg-slate-200 backdrop-blur-md z-auto ' >
        <nav
          className='flex items-center justify-between p-4 lg:px-8'
          aria-label='Global'
        >
          <div className='flex lg:flex-1'>
            <Link to='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>CinéSync</span>
              <img className='h-16 w-auto rounded-full' src={imgsrc} alt='' />
            </Link>
          </div>
          <div className='lg:hidden items-center'>
            <button
              type='button'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700'
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              <span className='sr-only'>Open main menu</span>
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
                />
              </svg>
            </button>
          </div>
          <div className='hidden lg:flex lg:gap-x-6'>
            <Link
              to='/watchlist'
              className='text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400'
            >
              WatchList
            </Link>
            <Link
              to='/playlist'
              className='text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400'
            >
              Playlists
            </Link>
          </div>
          <div className='lg:flex lg:flex-1 lg:justify-end items-center text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400'>
            <div className='relative mx-3'>
              <input
                type='text'
                className='py-1 px-2 border w-64 border-gray-300 rounded-md focus:outline-none focus:border-blue-500'
                placeholder='Search...'
                value={searchQuery}
                required
                onChange={handleSearchChange}
              />
              {searchQuery !== "" && suggestions.length > 0 && (
                <div className='absolute left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg'>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className='px-4 py-2 cursor-pointer hover:bg-gray-100'
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              <Link to={"/search-results/" + searchQuery}>
                <button
                  className='absolute right-0 top-0 h-full px-3'
                  disabled={
                    searchQuery === "No RESULT found" || searchQuery === ""
                      ? true
                      : false
                  }
                >
                  <svg
                    className='h-5 w-5 text-gray-500'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    viewBox='0 0 24 24'
                  >
                    <path d='M21 21l-5.2-5.2' />
                    <circle cx='10' cy='10' r='8' />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
          {isLoggedIn ? (
            <div className='relative inline-block text-left'>
              <button
                type='button'
                className='text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400'
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Profile
                <span className='ml-1' aria-hidden='true'>
                  &rarr;
                </span>
              </button>
              {showDropdown && (
                <div
                  ref={dropdownRef}
                  className='origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'
                >
                  <div
                    className='py-1'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='options-menu'
                  >
                    <div className='block px-4 py-2 text-sm text-left text-gray-700'>
                      Welcome, <br /> <b>{usernameemail}</b>
                    </div>
                    <button
                      onClick={handleLogout}
                      className=' w-full max-w-xs mx-auto px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center'
                      role='menuitem'
                      style={{ height: "40px", width: "150px" }}
                    >
                      <img
                        src={logout}
                        alt='Logout'
                        className='mr-2'
                        style={{ height: "20px", width: "20px" }}
                      />
                      Logout
                    </button>

                    <button
                      onClick={handleprefrence}
                      className='block w-full max-w-xs mx-auto px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center'
                      role='menuitem'
                      style={{ height: "40px", width: "150px" }}
                    >
                      <img
                        src={pref}
                        alt='Change Preference'
                        className='mr-2'
                        style={{ height: "20px", width: "20px" }}
                      />
                      Change Preference
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={"/login"}
              className='text-sm font-semibold leading-6 text-slate-400 hover:text-sky-400'
            >
              Log in <span aria-hidden='true'>&rarr;</span>
            </Link>
          )}
        </nav>

        {isMobileMenuOpen && (
          <div className='bg-gray-500 py-2 top-0 right-0'>
            <Link
              to='/Watchlist'
              className='block px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600'
            >
              WatchList
            </Link>
            <Link
              to='/playlist'
              className='block px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600'
            >
              Playlists
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
