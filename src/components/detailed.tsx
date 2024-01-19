import React, { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useParams } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useUser } from "./UserContex";
import { auth } from "../firebaseauth";
import moviesimages from "../backend/moviesimg";
import { METHODS } from "http";
import { json } from "body-parser";
import CommentSection from "./comment";
import NotFound404 from "./404notfoun";

export default function Detailed() {
  const { id } = useParams();
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [rating, setRating] = useState(0);
  const [userId, setUserId] = useState("");
  const [username ,setUserName]=useState("");
  const [emailname ,setUserNameemail]=useState("");

  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid || "");
      setUserName(user?.displayName || "");
      setUserNameemail(user?.email || "");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await fetch(
          `/watchlist/fetchWatchlist/${userId}/${id}`
        );
        console.log(response);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch watchlist information. Status: ${response.status}`
          );
        }

        const data = await response.json();
        setIsInWatchlist(data.isInWatchlist);
      } catch (error) {
        console.error("Error checking watchlist:", error.message);
      }
    };

    checkWatchlist();
  }, [userId, id]);

  const addToWatchlist = async () => {
    try {
      if (!userId) {
        console.warn("User is not logged in. Cannot add to watchlist.");
        return;
      }
      // Make the GET request to check the watchlist
      const response = await fetch(
        `/watchlist/addtowatchlist/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        }
      );

      // Check if the response status is in the success range (2xx)
      if (response.ok) {
        // Parse the response JSON
        const data = await response.json();

        // Handle the response data
        if (data.error) {
          console.error("Error adding movie to watchlist:", data.error);
        } else {
          // Update the local state after successful addition
          setIsInWatchlist(true);

          console.log("Movie added to watchlist successfully");
        }
      } else {
        // Handle non-successful response (e.g., server error)
        console.error(
          "Error checking watchlist. Server returned:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      // Handle network or other errors
      console.error("Error checking watchlist:", error.message);
    }
  };

  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const setImg = async () => {
      try {
        const result = await moviesimages(
          id,
          "6dbdf27e3fb82e5b69b71a171310e6a3"
        );
        setImageSrc(result);
      } catch (error) {
        console.error("Error fetching image:", error.message);
      }
    };

    setImg();
  }, [id]);

  useEffect(() => {
    // Fetch data from the server
    fetch(`/searchmovies/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setSelectedMovie(data.items[0]); // Assuming the response structure has an 'items' array
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
      });
  }, [id]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  if (!selectedMovie) {
    // Render loading state or error message while data is being fetched
    return <NotFound404/>;
  }

  return (
    <div className='container mt-4 mx-auto pt-10 bg-slate-50 bg-opacity-10 rounded-3xl '>
      <div className='flex p-4 flex-col lg:flex-row justify-center items-center gap-8'>
        <div className='aspect-w-2 aspect-h-3 w-full lg:w-1/3 lg:max-w-md'>
          <img
            src={imageSrc}
            alt={selectedMovie.original_title}
            className='object-cover w-full h-full rounded-2xl shadow-lg'
          />
        </div>
        <div className='flex-1 p-4'>
          <h1 className='text-3xl font-bold text-gray-100 mb-4'>
            {selectedMovie.original_title}
          </h1>
          <p className='text-gray-100 mb-2'>
            <span className='text-gray-400 font-bold'>Genres:</span>{" "}
            {selectedMovie.genres}
          </p>
          <div className='flex items-center mb-6'>
            <p className='text-gray-400 mr-2'>
              Rating: <br />
            </p>
            <SingleStarRating rating={parseFloat(selectedMovie.vote_average)} />
          </div>
          <div className='flex items-center mb-6'>
            <p className='text-gray-400 mr-2'>
              Runtime: <br />
            </p>
            <p className='text-gray-400 mr-2'>{selectedMovie.runtime} min</p>
          </div>
          <div className='flex items-center mb-6'>
            <p className='text-gray-400 mr-2'>
              Release Year: <br />
            </p>
            <p className='text-gray-400 mr-2'>{selectedMovie.release_year} </p>
          </div>
          <div className='flex items-center mb-6'>
            <p className='text-gray-400 mr-2'>
              Release Date: <br />
            </p>
            <p className='text-gray-400 mr-2'>
              <b>{selectedMovie.release_date}</b>{" "}
            </p>
          </div>
          <div className='flex items-center mb-6'>
            <p className='text-gray-400 mr-2'>
              Director :<br />
            </p>
            <p className='text-gray-400 mr-2'>
              <b>{selectedMovie.director}</b>{" "}
            </p>
          </div>
          <div className='flex items-center mb-6'>
            <p className='text-gray-400 mr-2'>
              Cast-mambers:
              <br />
            </p>
            <p className='text-gray-400 mr-2'>
              <b>{selectedMovie.cast}</b>{" "}
            </p>
          </div>
          <div className='flex items-center mb-6'>
            <p className='text-gray-400 mr-3'>
              Production Companies:
              <span className='font-bold ml-2'>
                {selectedMovie.production_companies}
              </span>{" "}
            </p>
          </div>

          <h2 className='text-xl font-bold text-gray-400 mb-4 mt-3'>
            Description
          </h2>
          <p className='text-slate-100 mb-8'>{selectedMovie.overview}</p>
          <button
            type='button'
            onClick={addToWatchlist}
            className={`bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              !userId
                ? "opacity-50 cursor-not-allowed"
                : isInWatchlist
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!userId || isInWatchlist}
          >
            {userId
              ? isInWatchlist
                ? "Added to Watchlist"
                : "Add to Watchlist"
              : "Login to Add to Watchlist"}
          </button>
          
        </div>
      </div>
      <CommentSection imdb_id={id}></CommentSection>
    </div>
  );
}

const SingleStarRating = ({ rating }) => {
  return (
    <div className='flex items-center'>
      <StarIcon className='h-6 w-6 text-yellow-400' />
      <p className='ml-2 text-gray-400'>{rating}</p>
    </div>
  );
};
