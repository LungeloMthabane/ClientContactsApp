import './App.css';
import { Routes, Route } from 'react-router-dom';
import AppDrawer from "./components/atoms/appDrawer/appDrawer";
 import {AppRoutes} from "./routes/appRoutes";
 import {Grid} from "@mui/material";

function App() {
  return (
    <div className="App">
        <Grid container spacing={2}>
            <Grid >
                <AppDrawer />
            </Grid>
            <Grid size={10}>
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
