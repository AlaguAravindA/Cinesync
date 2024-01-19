import logo from './logo.svg';
import './App.css';
import './input.css';
import Home from './components/Home.tsx';
import Login from './components/auth/login.tsx';
import Watchlist from './components/Watchlist.jsx';
import { Routes,Route } from 'react-router-dom';
import Navbar from './components/navbar.tsx';
import Particle from './components/particlesbg.tsx';
import Detailed from './components/detailed.tsx';
import Shownavbar from './components/Shownavbar.tsx';
import Footer from './components/Footer.tsx';
import Reg from './components/auth/singup.tsx';
import Searchresults from './components/Searchresults.jsx';
import { UserProvider } from './components/UserContex.js';
import Protectcomponent from './components/Protectcomponent.tsx';
import UserPreferences from './components/prefrences.jsx';
import ShufflingProvider from './components/suffeling.jsx';
import Playlist from './components/playlist.jsx';
import Detailplaylist from './components/detailplaylist.jsx';
import SearchComponent from './components/searchmovies.jsx';
import EditPlaylist from './components/updatingplaylist.jsx';
import NotFound404 from './components/404notfoun.jsx';


const App = () => {
  return (
    <ShufflingProvider>
      <Shownavbar>
        <Navbar></Navbar>
      </Shownavbar>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/detailed/:id' element={<Detailed />}></Route>
        <Route path='watchlist' element={<Protectcomponent component={<Watchlist />} />} />
        <Route path='pref/:uid' element={<UserPreferences />}></Route>
        <Route path='login' element={<Login />}></Route>
        <Route path='register' element={<Reg />}></Route>
        <Route path='playlist'element={<Protectcomponent component={<Playlist></Playlist>}></Protectcomponent>}></Route>
        <Route path='search-results/:searchquery' element={<Searchresults />}></Route>
        <Route path='playlist/detail/:playlistID' element={<Detailplaylist></Detailplaylist>}></Route>
        <Route path='playlist/search/:playlistID/:searchQuery' element={<SearchComponent></SearchComponent>}></Route>
        <Route path='playlist/edit/:playlistID' element={<EditPlaylist></EditPlaylist>}></Route>
        <Route path='*' element={<NotFound404 />}></Route>
      </Routes>
      {/* Other components like Particle, Footer, etc. */}
      <Particle></Particle>
      <Footer></Footer>
    </ShufflingProvider>
  );
};
  





export default App;
