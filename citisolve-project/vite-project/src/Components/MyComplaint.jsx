import React, { useEffect, useState } from "react";
import "./MyComplaint.css";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../services/API";

const MyComplaint = () => {

    const navigate = useNavigate();

    const [complaints, setComplaints] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchComplaints = async () => {
            try {

                const res = await fetch(`${BASE_URL}/api/complaints`);

                const data = await res.json();

                setComplaints(data || []);

            } catch (err) {

                console.log("Error fetching complaints:", err);

            } finally {

                setLoading(false);

            }
        };

        fetchComplaints();

    }, []);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this complaint?"
        );

        if (!confirmDelete) return;

        try {

            await fetch(`${BASE_URL}/api/complaints/${id}`, {
                method: "DELETE",
            });

            setComplaints(prev =>
                prev.filter(item => item._id !== id)
            );

        } catch (error) {

            console.log("Delete error:", error);

        }
    };

    const filteredComplaints =
        statusFilter === "All"
            ? complaints
            : complaints.filter(c => c.status === statusFilter);

    if (loading) {
        return <h2 style={{ textAlign: "center" }}>Loading complaints...</h2>;
    }

    if (!complaints.length) {
        return (
            <div className="empty-wrapper">
                <div className="empty-card">
                    <div className="empty-icon">📝</div>
                    <h1>No Complaints Yet</h1>
                    <p>You haven't submitted any complaints yet.</p>

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/complaintform")}
                    >
                        Submit Your First Complaint
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-bg">

            <h1 className="page-title">My Complaints</h1>

            <div className="top-controls">

                <div className="filter-controls">

                    <label>Filter by status:</label>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>

                </div>

                <button
                    className="primary-btn"
                    onClick={() => navigate("/complaintform")}
                >
                    Submit New Complaint
                </button>

            </div>

            <div className="complaint-list">

                {filteredComplaints.map((c) => (

                    <div className="complaint-card" key={c._id}>

                        <div className="card-header">

                            <span className="complaint-id">
                                ID: {c._id?.slice(-6).toUpperCase()}
                            </span>

                            <span className={`status ${(c.status || "Pending").toLowerCase().replace(" ", "-")}`}>
                                {c.status || "Pending"}
                            </span>

                        </div>

                        <h3 className="complaint-name">{c.name}</h3>

                        <div className="row">
                            <span>Ward:</span>
                            <span>{c.ward}</span>
                        </div>

                        <div className="row">
                            <span>Location:</span>
                            <span>{c.location}</span>
                        </div>

                        <div className="row">
                            <span>Category:</span>
                            <span className="category-badge">{c.category}</span>
                        </div>

                        <div className="row">
                            <span>Submitted:</span>
                            <span>
                                {c.createdAt
                                    ? new Date(c.createdAt).toLocaleDateString()
                                    : "N/A"}
                            </span>
                        </div>

                        <div className="row">
                            <span>Description:</span>
                            <span>{c.description}</span>
                        </div>

                        <button
                            className="delete-btn"
                            onClick={() => handleDelete(c._id)}
                        >
                            Delete
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MyComplaint;
