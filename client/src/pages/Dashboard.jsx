import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import api from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [printing, setPrinting] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                sessionStorage.getItem("adminToken");

            if (!token) {
                navigate("/admin/login");
                return;
            }

            const { data } = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(data.data || []);

        } catch (err) {
            if (err.response?.status === 401) {
                sessionStorage.removeItem("adminToken");
                navigate("/admin/login");
                return;
            }

            setError(
                "Unable to load attendance records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const logout = () => {
        sessionStorage.removeItem("adminToken");
        navigate("/admin/login");
    };

    const members = users.filter(
        (user) => user.member
    ).length;

    const nonMembers = users.length - members;

    /*
     * Generate attendance PDF
     */
    const printAttendance = () => {
        if (users.length === 0) {
            alert("There are no attendance records to print.");
            return;
        }

        try {
            setPrinting(true);

            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            /*
             * Title
             */
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");

            doc.text(
                "Attendance Report",
                14,
                18
            );

            /*
             * Generated date
             */
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");

            const generatedAt =
                new Date().toLocaleString();

            doc.text(
                `Generated: ${generatedAt}`,
                14,
                25
            );

            /*
             * Summary
             */
            doc.setFontSize(10);

            doc.text(
                `Total Attendance: ${users.length}`,
                14,
                33
            );

            doc.text(
                `Members: ${members}`,
                75,
                33
            );

            doc.text(
                `Non-members: ${nonMembers}`,
                125,
                33
            );

            /*
             * Table
             */
            autoTable(doc, {
                startY: 40,

                head: [[
                    "#",
                    "Name",
                    "Contact",
                    "Hostel",
                    "Invited By",
                    "Member",
                    "Date",
                    "Time",
                ]],

                body: users.map((user, index) => {
                    const date = user.created_at
                        ? new Date(user.created_at)
                        : null;

                    return [
                        index + 1,
                        user.name || "",
                        user.contact || "",
                        user.hostel || "",
                        user.invited_by || "",
                        user.member ? "Yes" : "No",
                        date
                            ? date.toLocaleDateString()
                            : "",
                        date
                            ? date.toLocaleTimeString()
                            : "",
                    ];
                }),

                theme: "grid",

                styles: {
                    fontSize: 8,
                    cellPadding: 3,
                    overflow: "linebreak",
                },

                headStyles: {
                    fontSize: 8,
                    fontStyle: "bold",
                },

                columnStyles: {
                    0: {
                        cellWidth: 10,
                    },
                    1: {
                        cellWidth: 35,
                    },
                    2: {
                        cellWidth: 30,
                    },
                    3: {
                        cellWidth: 35,
                    },
                    4: {
                        cellWidth: 35,
                    },
                    5: {
                        cellWidth: 20,
                    },
                    6: {
                        cellWidth: 25,
                    },
                    7: {
                        cellWidth: 25,
                    },
                },

                didDrawPage: (data) => {
                    /*
                     * Footer
                     */
                    const pageHeight =
                        doc.internal.pageSize.height;

                    doc.setFontSize(8);

                    doc.text(
                        `Page ${data.pageNumber}`,
                        14,
                        pageHeight - 10
                    );
                },
            });

            /*
             * Save PDF
             */
            const date = new Date()
                .toISOString()
                .split("T")[0];

            doc.save(
                `attendance-report-${date}.pdf`
            );

        } catch (err) {
            console.error(
                "PDF generation failed:",
                err
            );

            alert(
                "Unable to generate the attendance PDF."
            );
        } finally {
            setPrinting(false);
        }
    };

    return (
        <main className="dashboard">

            {/* Header */}
            <header className="dashboard-header">

                <div className="dashboard-brand">

                    <div className="brand-icon">
                        A
                    </div>

                    <div>
                        <h1>Attendance</h1>
                        <span>
                            Admin Dashboard
                        </span>
                    </div>

                </div>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>

            <div className="dashboard-content">

                {/* Page heading */}
                <div className="dashboard-title">

                    <div>
                        <h2>
                            Attendance Overview
                        </h2>

                        <p>
                            View everyone who has
                            registered.
                        </p>
                    </div>

                    <div className="dashboard-actions">

                        <button
                            className="refresh-button"
                            onClick={fetchUsers}
                            disabled={loading}
                        >
                            ↻ Refresh
                        </button>

                        <button
                            className="pdf-button"
                            onClick={printAttendance}
                            disabled={
                                loading ||
                                printing ||
                                users.length === 0
                            }
                        >
                            {printing ? (
                                <>
                                    <span className="button-spinner" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <span>↓</span>
                                    Print PDF
                                </>
                            )}
                        </button>

                    </div>

                </div>

                {/* Statistics */}
                <section className="dashboard-stats">

                    <div className="stat-card">

                        <div className="stat-icon total">
                            #
                        </div>

                        <div>
                            <span>
                                Total Attendance
                            </span>

                            <h2>
                                {users.length}
                            </h2>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon members">
                            ✓
                        </div>

                        <div>
                            <span>
                                Members
                            </span>

                            <h2>
                                {members}
                            </h2>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon guests">
                            +
                        </div>

                        <div>
                            <span>
                                Non-members
                            </span>

                            <h2>
                                {nonMembers}
                            </h2>
                        </div>

                    </div>

                </section>

                {/* Attendance */}
                <section className="attendance-panel">

                    <div className="attendance-panel-header">

                        <div>
                            <h2>
                                Attendance Records
                            </h2>

                            <p>
                                {users.length}{" "}
                                {users.length === 1
                                    ? "record"
                                    : "records"}
                            </p>
                        </div>

                    </div>

                    {loading ? (

                        <div className="dashboard-loading">
                            <span className="spinner dark" />
                            Loading attendance...
                        </div>

                    ) : error ? (

                        <div className="dashboard-error">
                            {error}
                        </div>

                    ) : users.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                ○
                            </div>

                            <h3>
                                No attendance yet
                            </h3>

                            <p>
                                Attendance records will
                                appear here once people
                                register.
                            </p>

                        </div>

                    ) : (

                        <div className="table-wrapper">

                            <table className="attendance-table">

                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Hostel</th>
                                        <th>Invited By</th>
                                        <th>Member</th>
                                        <th>Time</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {users.map(
                                        (user) => (
                                            <tr
                                                key={
                                                    user.id
                                                }
                                            >

                                                <td className="id-cell">
                                                    {
                                                        user.id
                                                    }
                                                </td>

                                                <td className="name-cell">
                                                    {
                                                        user.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        user.contact
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        user.hostel
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        user.invited_by
                                                    }
                                                </td>

                                                <td>
                                                    <span
                                                        className={
                                                            user.member
                                                                ? "member-badge yes"
                                                                : "member-badge no"
                                                        }
                                                    >
                                                        {user.member
                                                            ? "Yes"
                                                            : "No"}
                                                    </span>
                                                </td>

                                                <td className="time-cell">
                                                    {new Date(
                                                        user.created_at
                                                    ).toLocaleString()}
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </div>

        </main>
    );
}
