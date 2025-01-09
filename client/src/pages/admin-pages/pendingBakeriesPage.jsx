import React, { useEffect, useState } from 'react';
import { fetchPendingBakeries, approveBakery } from '../../services/adminService';

export default function AdminDashboard() {
    const [pendingBakeries, setPendingBakeries] = useState([]);

    useEffect(() => {
        async function loadPendingBakeries() {
            const bakeries = await fetchPendingBakeries();
            setPendingBakeries(bakeries);
        }
        loadPendingBakeries();
    }, []);

    const handleApproval = async (id, status) => {
        await approveBakery(id, status);
        setPendingBakeries(pendingBakeries.filter((b) => b.id !== id));
    };

    return (
        <div>
            <h1>Pending Bakery Accounts</h1>
            {pendingBakeries.map((bakery) => (
                <div key={bakery.id}>
                    <p>{bakery.name}</p>
                    <button onClick={() => handleApproval(bakery.id, 'approved')}>Approve</button>
                    <button onClick={() => handleApproval(bakery.id, 'rejected')}>Reject</button>
                </div>
            ))}
        </div>
    );
}
