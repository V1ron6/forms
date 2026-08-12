import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const token = sessionStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return children;
}
