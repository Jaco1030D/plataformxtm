import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./components/pages/Home"
import EditSegments from "./components/pages/EditSegments"
import AllFiles from "./components/pages/AllFiles"
import { allFilesRoutes, editSegmentsRoutes } from "./const/routes"

const App = () => {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path={allFilesRoutes} element={<AllFiles />} />

                <Route path={editSegmentsRoutes} element={<EditSegments />} />
            
            </Routes>
        
        </BrowserRouter>
    )
}

export default App
