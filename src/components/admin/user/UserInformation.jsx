import React, { useEffect, useState, useCallback } from "react";
import {
  getUsers,
  removeUser,
  getBookings,
} from "../../../services/adminService";
import BookingInfoPanel from "./BookingInfoPanel";

const THead = ({ children }) => (
  <th className="px-3 py-2.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide text-left bg-gray-50 border-b border-gray-200 whitespace-nowrap">
    {children}
  </th>
);

const TCell = ({ children, className = "" }) => (
  <td
    className={`px-3 py-2.5 text-xs text-gray-700 border-b border-gray-100 ${className}`}
  >
    {children}
  </td>
);

const UserInformation = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // { user, bookings }

  const load = useCallback(async (withSpinner = true) => {
    if (withSpinner) setLoading(true);
    const [u, b] = await Promise.all([getUsers(), getBookings()]);
    setUsers(u);
    setBookings(b);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      const [u, b] = await Promise.all([getUsers(), getBookings()]);
      if (!active) return;
      setUsers(u);
      setBookings(b);
      setLoading(false);
    };
    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  const handleRemoveUser = async (userId) => {
    if (!confirm("Remove this user permanently?")) return;
    await removeUser(userId);
    load();
  };

  const openBookings = (user) => {
    // match bookings by email since mock doesn't have userId
    const ub = bookings.filter(
      (b) => b.userId === user.id || b.primaryTraveler?.email === user.email,
    );
    setSelected({ user, bookings: ub });
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <svg
          className="w-7 h-7 animate-spin text-teal-500"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );

  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-800 mb-5">
        User Information
      </h2>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <THead>ID</THead>
                <THead>First Name</THead>
                <THead>Last Name</THead>
                <THead>Full Name</THead>
                <THead>Email</THead>
                <THead>Address</THead>
                <THead>Phone</THead>
                <THead>NID No.</THead>
                <THead>WhatsApp</THead>
                <THead>Emergency</THead>
                <THead>Relationship</THead>
                <THead>Actions</THead>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="text-center text-gray-400 text-sm py-12"
                  >
                    No registered users yet.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => {
                  const ub = bookings.filter(
                    (b) =>
                      b.userId === user.id ||
                      b.primaryTraveler?.email === user.email,
                  );
                  const hasBooking = ub.length > 0;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TCell className="font-mono font-bold text-gray-400">
                        {String(i + 1).padStart(4, "0")}
                      </TCell>
                      <TCell>{user.firstName}</TCell>
                      <TCell>{user.lastName}</TCell>
                      <TCell className="font-semibold text-gray-800">
                        {user.fullName}
                      </TCell>
                      <TCell>{user.email}</TCell>
                      <TCell>
                        {user.address || (
                          <span className="text-gray-300">—</span>
                        )}
                      </TCell>
                      <TCell>{user.phone}</TCell>
                      <TCell>
                        {user.nidNo || <span className="text-gray-300">—</span>}
                      </TCell>
                      <TCell>
                        {user.whatsapp || (
                          <span className="text-gray-300">—</span>
                        )}
                      </TCell>
                      <TCell>
                        {user.emergencyContact || (
                          <span className="text-gray-300">—</span>
                        )}
                      </TCell>
                      <TCell>
                        {user.emergencyRelationship || (
                          <span className="text-gray-300">—</span>
                        )}
                      </TCell>
                      <TCell>
                        <div className="flex items-center gap-2">
                          {hasBooking && (
                            <button
                              onClick={() => openBookings(user)}
                              className="px-3 py-1 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-[10px] font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Booking Info
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveUser(user.id)}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </TCell>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-400">
            {users.length} user(s) registered
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-lg cursor-pointer">
              Back
            </button>
            <button className="px-4 py-1.5 bg-[#a5d6a7] hover:bg-[#81c784] text-green-900 text-xs font-bold rounded-lg cursor-pointer">
              Add More
            </button>
          </div>
        </div>
      </div>

      {/* Booking Info Panel Modal */}
      {selected && (
        <BookingInfoPanel
          user={selected.user}
          bookings={selected.bookings}
          onClose={() => setSelected(null)}
          onRefresh={load}
        />
      )}
    </div>
  );
};

export default UserInformation;
