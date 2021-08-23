import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import EditProfile from "./EditProfile";
import CreateProfile from "./CreateProfile";
import SignIn from "./SignIn";
import PasswordReset from "./PasswordReset";
import SignUp from "./SignUp";
import MyClub from "./MyClub";
import SearchPlayers from "./SearchPlayers";
import SearchClubs from "./SearchClubs";
import CreateClub from "./CreateClub";
import ManageClub from "./ManageClub";
import Notifications from "./Notifications";
import UserProfile from "./UserProfile";
import ClubProfile from "./ClubProfile";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app__container">
          <PrivateRoute exact path="/dashboard" component={Dashboard} />
          <PrivateRoute exact path="/editprofile" component={EditProfile} />
          <PrivateRoute exact path="/createprofile" component={CreateProfile} />
          <Route exact path="/" component={SignIn} />
          <Route exact path="/passwordreset" component={PasswordReset} />
          <Route exact path="/signup" component={SignUp} />
          <PrivateRoute exact path="/myclub" component={MyClub} />
          <PrivateRoute exact path="/searchplayers" component={SearchPlayers} />
          <PrivateRoute exact path="/searchclubs" component={SearchClubs} />
          <PrivateRoute exact path="/createclub" component={CreateClub} />
          <PrivateRoute exact path="/manageclub" component={ManageClub} />
          <PrivateRoute exact path="/notifications" component={Notifications} />
          <Route exact path="/users/:userid">
            <UserProfile />
          </Route>
          <Route exact path="/clubs/:clubid">
            <ClubProfile />
          </Route>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
