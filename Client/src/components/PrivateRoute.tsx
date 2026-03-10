import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

type PrivateRouteProps = {
    isAuthenticated: boolean;
    children: ReactNode;
};

function PrivateRoute({ isAuthenticated, children }: PrivateRouteProps) {
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default PrivateRoute;