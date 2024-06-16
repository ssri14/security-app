import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import VisitorState from "./context/visitors/visitorState";
import AuthState from "./context/auths/authState";
import SignUp from "./components/Auth/SignUp";
import LogIn from "./components/Auth/LogIn";
import AlertState from "./context/alert/alertState";
import Alert from "./components/Alert";
import AddNewVisitor from "./components/Visitor/AddNewVisitor";
import ParticularVisitor from "./components/Visitor/ParticularVisitor";
import Visitors from "./components/Visitor/Visitors";
import SearchVisitor from "./components/Visitor/SearchVisitor";
import AddVisitor from "./components/Visitor/AddVisitor";

import VisitorHome from "./components/Visitor/VisitorHome";
import ContractorState from "./context/contractors/contractorState";
import Contractors from "./components/Contractor/Contractors";
import SearchContractor from "./components/Contractor/SearchContractor";

import AddNewContractor from "./components/Contractor/AddNewContractor";
import ContractorHome from "./components/Contractor/ContractorHome";
import ParticularContractor from "./components/Contractor/ParticularContractor";
import AddNewDailyWorker from "./components/DailyWorker/AddNewDailyWorker";
import DailyWorkerHome from "./components/DailyWorker/DailyWorkerHome";
import DailyWorkers from "./components/DailyWorker/DailyWorkers";
import SearchDailyWorker from "./components/DailyWorker/SearchDailyWorker";
import AddDailyWorker from "./components/DailyWorker/AddDailyWorker";

import ParticularDailyWorker from "./components/DailyWorker/ParticularDailyWorker";
import DailyWorkerState from "./context/dailyWorkers/dailyWorkerState";
import AddNewCollegeMaterial from "./components/CollegeMaterial/AddNewCollegeMaterial";
import ParticularCollegeMaterial from "./components/CollegeMaterial/ParticularCollegeMaterial";
import CollegeMaterialHome from "./components/CollegeMaterial/CollegeMaterialHome";
import CollegeMaterials from "./components/CollegeMaterial/CollegeMaterials";
import SearchCollegeMaterial from "./components/CollegeMaterial/SearchCollegeMaterial";
import CollegeMaterialState from "./context/collegeMaterials/collegeMaterialState";
import PrintState from "./context/print/printState";
import UpdateValidity from "./components/DailyWorker/UpdateValidity";
import AddContractor from "./components/Contractor/AddContractor";
import QRScanner from "./components/QRScanner";

function App() {
  return (
    <>
      <AuthState>
        <PrintState>
          <VisitorState>
            <ContractorState>
              <DailyWorkerState>
                <CollegeMaterialState>
                  <Router>
                    <AlertState>
                      <Navbar />
                      <Alert />
                      <Routes>
                        <Route exact path="/home" element={<Home />} />
                        <Route exact path="/about" element={<About />} />
                        <Route exact path="/signup" element={<SignUp />} />
                        <Route exact path="/" element={<LogIn />} />
                        <Route exact path="/addNewVisitor" element={<AddNewVisitor />} />
                        <Route exact path="/visitorhome" element={<VisitorHome />} />
                        <Route exact path="/visitor" element={<Visitors />} />
                        <Route exact path="/searchVisitor" element={<SearchVisitor />} />
                        <Route exact path="/addVisitor" element={<AddVisitor />} />
                        <Route exact path="/visitormoreinfo" element={<ParticularVisitor />} />

                        <Route exact path="/addNewContractor" element={<AddNewContractor />} />
                        <Route exact path="/contractorhome" element={<ContractorHome />} />
                        <Route exact path="/contractor" element={<Contractors />} />
                        <Route exact path="/searchContractor" element={<SearchContractor />} />
                        <Route exact path="/contractormoreinfo" element={<ParticularContractor />} />
                        <Route exact path="/addContractor" element={<AddContractor />} />

                        <Route exact path="/addNewCollegeMaterial" element={<AddNewCollegeMaterial />} />
                        <Route exact path="/collegeMaterialhome" element={<CollegeMaterialHome />} />
                        <Route exact path="/collegeMaterial" element={<CollegeMaterials />} />
                        <Route exact path="/searchCollegeMaterial" element={<SearchCollegeMaterial />} />
                        <Route exact path="/collegeMaterialmoreinfo" element={<ParticularCollegeMaterial />} />

                        <Route exact path="/addNewDailyWorker" element={<AddNewDailyWorker />} />
                        <Route exact path="/dailyWorkerhome" element={<DailyWorkerHome />} />
                        <Route exact path="/dailyWorker" element={<DailyWorkers />} />
                        <Route exact path="/searchDailyWorker" element={<SearchDailyWorker />} />
                        <Route exact path="/addDailyWorker" element={<AddDailyWorker />} />
                        <Route exact path="/dailyWorkermoreinfo" element={<ParticularDailyWorker />} />
                        <Route exact path="/updateValidityDailyWorker" element={<UpdateValidity />} />

                        <Route exact path="/qr-scanner" element={<QRScanner />} />
                      </Routes>
                    </AlertState>
                  </Router>
                </CollegeMaterialState>
              </DailyWorkerState>
            </ContractorState>
          </VisitorState>
        </PrintState>
      </AuthState>
    </>
  );
}

export default App;
