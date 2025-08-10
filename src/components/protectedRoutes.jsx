/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useUser, useSession } from "@clerk/clerk-react";

const ProtectedRoutes = ({ children }) => {
  const { isSignedIn, isLoaded: userLoaded, user } = useUser();
  const { isLoaded: sessionLoaded, session } = useSession();
  const { pathname } = useLocation();

  // Wait for both user and session to be fully loaded
  const isFullyLoaded = userLoaded && sessionLoaded;

  // Show a loading screen until everything is ready
  if (!isFullyLoaded) {
    return <div>Loading...</div>;
  }

  // Redirect if not signed in
  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  // Redirect to onboarding if user doesn't have a role yet
  if (
    user !== undefined &&
    !user?.unsafeMetadata?.role &&
    pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" />;
  }

  // ✅ Now it's 100% safe to use session.getToken() inside child components
  return children;
};

export default ProtectedRoutes;
