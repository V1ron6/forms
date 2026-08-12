import { useState } from "react";
import api from "../services/api";
import "../styles/attendance.css";
import Navbar from "../components/Navbar";

export default function Attendance() {
    const [form, setForm] = useState({
        name: "",
        contact: "",
        hostel: "",
        invitedBy: "",
        member: false,
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMemberChange = (value) => {
        setForm((prev) => ({
            ...prev,
            member: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            !form.name.trim() ||
            !form.contact.trim() ||
            !form.hostel.trim() ||
            !form.invitedBy.trim()
        ) {
            setError("Please complete all fields.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/users", form);

            setSubmitted(true);

            setForm({
                name: "",
                contact: "",
                hostel: "",
                invitedBy: "",
                member: false,
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to submit attendance. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="attendance-page">
                <section className="attendance-success">

                    <div className="success-icon">
                        ✓
                    </div>

                    <h1>Attendance Recorded</h1>

                    <p>
                        Your attendance has been successfully
                        registered.
                    </p>

                    <button
                        onClick={() => {
                            setSubmitted(false);
                            setError("");
                        }}
                    >
                        Register Another
                    </button>

                </section>
            </main>
        );
    }

    return (
    <>
   <Navbar />
        <main className="attendance-page">

            <section className="attendance-card">

                <div className="attendance-header">
                    <span className="attendance-label">
                        ATTENDANCE
                    </span>
                </div>

                {error && (
                    <div className="form-error" role="alert">
                        {error}
                    </div>
                )}

                <form
                    className="attendance-form"
                    onSubmit={handleSubmit}
                >

                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={50}
                            autoComplete="name"
                            required
                        />
                    </div>

                    {/* Contact */}
                    <div className="form-group">
                        <label htmlFor="contact">
                            Contact
                        </label>

                        <input
                            id="contact"
                            name="contact"
                            type="tel"
                            placeholder="e.g. 0241234567"
                            value={form.contact}
                            onChange={handleChange}
                            maxLength={20}
                            autoComplete="tel"
                            required
                        />
                    </div>

                    {/* Hostel */}
                    <div className="form-group">
                        <label htmlFor="hostel">
                            Hostel
                        </label>

                        <input
                            id="hostel"
                            name="hostel"
                            type="text"
                            placeholder="Enter your hostel"
                            value={form.hostel}
                            onChange={handleChange}
                            maxLength={50}
                            required
                        />
                    </div>

                    {/* Invited By */}
                    <div className="form-group">
                        <label htmlFor="invitedBy">
                            Invited by
                        </label>

                        <input
                            id="invitedBy"
                            name="invitedBy"
                            type="text"
                            placeholder="Who invited you?"
                            value={form.invitedBy}
                            onChange={handleChange}
                            maxLength={100}
                            required
                        />
                    </div>

                    {/* Member */}
                    <fieldset className="member-fieldset">

                        <legend>
                            Are you a member?
                        </legend>

                        <div className="member-options">

                            <div className="member-option">
                                <input
                                    id="member-yes"
                                    type="radio"
                                    name="member"
                                    checked={form.member === true}
                                    onChange={() =>
                                        handleMemberChange(true)
                                    }
                                />

                                <label htmlFor="member-yes">
                                    <span className="radio-dot" />
                                    Yes
                                </label>
                            </div>

                            <div className="member-option">
                                <input
                                    id="member-no"
                                    type="radio"
                                    name="member"
                                    checked={form.member === false}
                                    onChange={() =>
                                        handleMemberChange(false)
                                    }
                                />

                                <label htmlFor="member-no">
                                    <span className="radio-dot" />
                                    No
                                </label>
                            </div>

                        </div>

                    </fieldset>

                    {/* Submit */}
                    <button
                        className="attendance-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner" />
                                Submitting...
                            </>
                        ) : (
                            "Register Attendance"
                        )}
                    </button>

                </form>

            </section>

        </main>
</>
    );
}
