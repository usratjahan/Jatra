import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const fullName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "N/A";
  const email = user?.email || "N/A";
  const phone = user?.phone || "N/A";
  const address = user?.address || "Not set yet";

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-white sm:mb-8 sm:text-3xl lg:text-5xl">Profile Information</h1>

      {/* Info card — teal glass */}
      <div
        className="rounded-2xl bg-gradient-to-b from-[#2897A4]/[0.41] to-transparent p-4 sm:p-6 lg:p-8 shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.15)]"
        // style={{
        //   background: "rgba(15,57,62,0.7)",
        //   border: "1px solid rgba(255,255,255,0.08)",
        // }}
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-5 p-1 sm:grid-cols-2 sm:gap-y-7 sm:p-3 lg:gap-x-20 lg:p-5">
          {/* Full Name */}
          <div>
            <p className="mb-1 text-sm text-white/60 sm:text-md">Full Name</p>
            <p className="text-lg font-semibold text-white sm:text-xl lg:text-2xl break-words">{fullName}</p>
          </div>

          {/* Address */}
          <div className="sm:row-span-4">
            <p className="text-white/60 text-md mb-1">Address</p>
            <p className="text-lg font-semibold text-white sm:text-xl lg:text-2xl break-words">{address}</p>
          </div>

          {/* Email */}
          <div>
            <p className="mb-1 text-sm text-white/60 sm:text-md">Email Address</p>
            <p className="text-lg font-semibold text-white sm:text-xl lg:text-2xl break-all">{email}</p>
          </div>

          {/* Phone */}
          <div>
            <p className="mb-1 text-sm text-white/60 sm:text-md">Phone Number</p>
            <p className="text-lg font-semibold text-white sm:text-xl lg:text-2xl break-words">{phone}</p>
          </div>
        </div>
      </div>

      {/* Update Profile button */}
      <button
        onClick={() => navigate("/dashboard/profile/edit")}
        className="mt-6 w-full rounded-lg bg-green-500 px-5 py-3 font-bold text-white transition-all duration-200 hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/30 active:scale-95 sm:mt-8 sm:w-auto sm:px-7"
      >
        Update Profile
      </button>
    </div>
  );
};

export default ProfilePage;
