
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyD2XHCZtjSk65vvQX0nPbXxvlv6yF_LFXU",
  authDomain: "jcamille-tech.firebaseapp.com",
  projectId: "jcamille-tech",
  storageBucket: "jcamille-tech.appspot.com",
  messagingSenderId: "484292122701",
  appId: "1:484292122701:web:59b0828f4a61803487e404",
  measurementId: "G-KP1SLMXH8S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
  );
}

export default App;
export { app, analytics };  // Export the app and analytics objects for use in other files
