import AddList from "./AddList"
import Show from "./Show"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"


function FrontMain() {
    return (
        <>
        <AddList/>
            <Router>
                <Routes>
                    <Route path="/" element={<Show />} />
                </Routes>
            </Router>
        </>
    )
}
export default FrontMain