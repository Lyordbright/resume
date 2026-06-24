import React, { useContext, useState } from "react";
import { authContext } from "../contexts/AuthContexts";
import { toast } from "sonner";

const baseUrl = import.meta.env.VITE_BASE_URL;

const AccountPage = () => {
  const { user, setUser } = useContext(authContext);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const profileDirty = firstName !== user?.firstName || lastName !== user?.lastName;

  // ── Update profile ──
  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    setSavingProfile(true);
    try {
      const res = await fetch(`${baseUrl}/auth/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Unable to update profile");
        return;
      }
      toast.success("Profile updated");
      if (setUser) setUser((prev) => ({ ...prev, firstName, lastName }));
    } catch {
      toast.error("Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change password ──
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch(`${baseUrl}/auth/change-password`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Unable to change password");
        return;
      }
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Unable to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const res = await fetch(`${baseUrl}/auth/resend-verification`, {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Unable to resend email");
        return;
      }
      toast.success("Verification email sent");
    } catch {
      toast.error("Unable to resend email");
    }
  };

  return (
    <div style={{ maxWidth: "600px", fontFamily: "Inter, system-ui, sans-serif", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
          Account
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Manage your profile and security settings
        </p>
      </div>

      {/* Profile summary card */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.25rem"
      }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: "#2563eb", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", fontWeight: 600, flexShrink: 0
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: "0 0 2px" }}>
            {user?.firstName} {user?.lastName}
          </p>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user?.email}
          </p>
        </div>
        <span style={{
          display: "flex", alignItems: "center", gap: "6px",
          fontSize: "12px", fontWeight: 500, padding: "5px 12px", borderRadius: "20px",
          background: user?.emailVerified ? "#dcfce7" : "#fffbeb",
          color: user?.emailVerified ? "#16a34a" : "#d97706",
          whiteSpace: "nowrap"
        }}>
          <i className={`fa-solid ${user?.emailVerified ? "fa-circle-check" : "fa-triangle-exclamation"}`}></i>
          {user?.emailVerified ? "Verified" : "Unverified"}
        </span>
      </div>

      {/* Unverified banner */}
      {!user?.emailVerified && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
          background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px",
          padding: "0.9rem 1.1rem", flexWrap: "wrap"
        }}>
          <p style={{ fontSize: "13px", color: "#92400e", margin: 0 }}>
            Your email isn't verified yet. Verify it to unlock all features.
          </p>
          <button
            onClick={handleResendVerification}
            style={{
              background: "#d97706", color: "#fff", border: "none",
              borderRadius: "6px", padding: "7px 14px", fontSize: "12.5px",
              fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap"
            }}
          >
            Resend email
          </button>
        </div>
      )}

      {/* Edit profile */}
      <form onSubmit={handleProfileSave} style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem",
        display: "flex", flexDirection: "column", gap: "1rem"
      }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
          Profile information
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>First name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Last name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email</label>
          <input value={user?.email || ""} disabled style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "6px 0 0" }}>
            Email cannot be changed.
          </p>
        </div>

        <button
          type="submit"
          disabled={!profileDirty || savingProfile}
          style={{
            alignSelf: "flex-start",
            background: !profileDirty ? "#e2e8f0" : savingProfile ? "#93c5fd" : "#2563eb",
            color: !profileDirty ? "#94a3b8" : "#fff",
            border: "none", borderRadius: "8px", padding: "10px 22px",
            fontSize: "14px", fontWeight: 500,
            cursor: !profileDirty || savingProfile ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "8px"
          }}
        >
          {savingProfile && <i className="fa-solid fa-spinner fa-spin"></i>}
          Save changes
        </button>
      </form>

      {/* Change password */}
      <form onSubmit={handlePasswordChange} style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "1.5rem",
        display: "flex", flexDirection: "column", gap: "1rem"
      }}>
        <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#0f172a", margin: 0 }}>
          Change password
        </h2>

        <div>
          <label style={labelStyle}>Current password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              style={{ ...inputStyle, paddingRight: "44px" }}
            />
            <span onClick={() => setShowCurrent((p) => !p)} style={eyeStyle}>
              <i className={`fa-solid ${showCurrent ? "fa-eye" : "fa-eye-slash"}`}></i>
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>New password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <span onClick={() => setShowNew((p) => !p)} style={eyeStyle}>
                <i className={`fa-solid ${showNew ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>
          </div>
          <div>
            <label style={labelStyle}>Confirm new password</label>
            <input
              type={showNew ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={changingPassword}
          style={{
            alignSelf: "flex-start",
            background: changingPassword ? "#93c5fd" : "#2563eb",
            color: "#fff", border: "none", borderRadius: "8px", padding: "10px 22px",
            fontSize: "14px", fontWeight: 500,
            cursor: changingPassword ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "8px"
          }}
        >
          {changingPassword && <i className="fa-solid fa-spinner fa-spin"></i>}
          Update password
        </button>
      </form>
    </div>
  );
};

const labelStyle = {
  display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px"
};

const inputStyle = {
  width: "70%", padding: "10px 14px", fontSize: "14px",
  border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none",
  color: "#1e293b", background: "#fff"
};

const eyeStyle = {
  position: "absolute", right: "14px", top: "50%",
  transform: "translateY(-50%)", cursor: "pointer",
  color: "#94a3b8", fontSize: "14px"
};

export default AccountPage;