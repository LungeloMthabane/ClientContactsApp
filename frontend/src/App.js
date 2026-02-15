 import './App.css';
import { Routes, Route } from 'react-router-dom';
import AppDrawer from "./components/atoms/appDrawer";
 import {AppRoutes} from "./routes/appRoutes";

function App() {
  return (
    <div className="App">
        <AppDrawer />
        <Routes>
            {AppRoutes.map((route, index) => (
                <Route path={route.path} key={index} element={route.element}/>
            ))}
        </Routes>
    </div>
  );
}

export default App;
