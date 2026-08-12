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
            <>
                <Navbar />

                <main className="attendance-page">
                    <section className="attendance-success">
                        <div className="success-check">
                            <span>✓</span>
                        </div>

                        <span className="success-label">
                            CHECK-IN COMPLETE
                        </span>

                        <h1>Attendance Recorded</h1>

                        <p>
                            Your attendance has been successfully
                            registered. Thank you for joining us.
                        </p>

                        <button
                            className="register-again"
                            onClick={() => {
                                setSubmitted(false);
                                setError("");
                            }}
                        >
                            Register Another
                        </button>
                    </section>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="attendance-page">
                <div className="attendance-glow glow-one" />
                <div className="attendance-glow glow-two" />

                <section className="attendance-card">

                    <div className="attendance-header">
                        <div className="header-badge">
                            <span className="badge-dot" />
                            ATTENDANCE
                        </div>

                        <h1>
                            Welcome.
                            <br />
                            <span>Let's check you in.</span>
                        </h1>

                        <p>
                            Please provide your details below to
                            register your attendance.
                        </p>
                    </div>

                    {error && (
                        <div className="form-error" role="alert">
                            <span>!</span>
                            {error}
                        </div>
                    )}

                    <form
                        className="attendance-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="form-group">
                            <label htmlFor="name">
                                <span className="field-number">01</span>
                                Full Name
                            </label>

                            <div className="input-wrapper">
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact">
                                <span className="field-number">02</span>
                                Contact Number
                            </label>

                            <div className="input-wrapper">
                                <input
                                    id="contact"
                                    name="contact"
                                    type="tel"
                                    placeholder="e.g. 024 123 4567"
                                    value={form.contact}
                                    onChange={handleChange}
                                    maxLength={20}
                                    autoComplete="tel"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="hostel">
                                <span className="field-number">03</span>
                                Hostel / Residence
                            </label>

                            <div className="input-wrapper">
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
                        </div>

                        <div className="form-group">
                            <label htmlFor="invitedBy">
                                <span className="field-number">04</span>
                                Invited By
                            </label>

                            <div className="input-wrapper">
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
                        </div>

                        <fieldset className="member-fieldset">
                            <legend>
                                <span className="field-number">05</span>
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
                                        <span className="member-icon">
                                            ✓
                                        </span>

                                        <span>
                                            <strong>Yes</strong>
                                            <small>I am a member</small>
                                        </span>
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
                                        <span className="member-icon">
                                            +
                                        </span>

                                        <span>
                                            <strong>No</strong>
                                            <small>I'm a visitor</small>
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        <button
                            className="attendance-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Recording attendance...
                                </>
                            ) : (
                                <>
                                    Register Attendance
                                    <span className="button-arrow">
                                        →
                                    </span>
                                </>
                            )}
                        </button>

                        <p className="privacy-note">
                            Your information is used only for attendance
                            registration.
                        </p>
                    </form>
                </section>
            </main>
        </>
    );
}
