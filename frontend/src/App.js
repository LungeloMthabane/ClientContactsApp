import './App.css';
import { Routes, Route } from 'react-router-dom';
import AppDrawer from "./components/atoms/appDrawer/appDrawer";
 import {AppRoutes} from "./routes/appRoutes";
 import {Grid} from "@mui/material";

function App() {
  return (
    <div className="App">
        <Grid container spacing={1}>
            <Grid size={1}>
                <AppDrawer />
            </Grid>
            <Grid size={11}>
                <Routes>
                    {AppRoutes.map((route, index) => (
                        <Route path={route.path} key={index} element={route.element}/>
                    ))}
                </Routes>
            </Grid>
        </Grid>
    </div>
  );
}

export default App;
