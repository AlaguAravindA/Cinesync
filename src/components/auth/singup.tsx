import React, { useState } from 'react';
import img from 'D:\\project_react\\moviesapp1\\src\\components\\images\\c.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseauth';
import { Link, useNavigate } from 'react-router-dom';
import { animated, useSpring } from 'react-spring';
import Loader from '../Loader.tsx';

export default function Reg() {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
 ;

 const signUp = async (e) => {
  e.preventDefault();
  
  setIsLoading(true);

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    console.log(userCredential);
    history('/login');
  } catch (error) {
    alert('Invalid Credentials!!!!');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
        <animated.div  className="bg-transparent min-h-screen flex items-center justify-center px-4 py-16">
       {
        isLoading && <Loader></Loader>
      
      }
        <div className="w-full max-w-md p-8 bg-slate-200 bg-opacity-70 rounded-lg shadow-lg">
          <div className="text-center">
            <img className="mx-auto mb-0 h-40 w-auto m rounded-full" src={img} alt="Your Company" />
            <h2 className="magnet mt-10 text-2xl font-bold leading-9 text-gray-900">Register Your Account</h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={signUp}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring focus:border-indigo-700 focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="block w-full rounded-md border py-2 px-3 text-gray-900 placeholder-gray-400 focus:ring focus:border-indigo-700 focus:outline-none focus:ring-2"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring focus:border-indigo-700"
              >
                Register
              </button>
              <p className="mt-6 text-center text-sm text-gray-900">
              Already have an Account?{' '}
              <Link to={'/login'} className="font-semibold text-indigo-600 hover:text-indigo-500">
                Login here
              </Link>
            </p>
            </div>
          </form>
        </div>
      </animated.div>
    </>
  );
}
