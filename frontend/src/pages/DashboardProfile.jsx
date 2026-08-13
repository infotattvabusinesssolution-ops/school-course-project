import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/axios";

export default function DashboardProfile() {
  const { user } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfilePhoto = async () => {
    if (!profilePhoto) return;
    try {
      setIsUploading(true);
      setProfileMsg({ text: "Uploading...", type: "info" });
      const formData = new FormData();
      formData.append("profilePhoto", profilePhoto);
      await api.put("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfileMsg({ text: "Profile photo updated. Please refresh to see changes globally.", type: "success" });
      setProfilePhoto(null);
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || "Failed to update profile photo", type: "error" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setProfileMsg({ text: "New passwords do not match", type: "error" });
      return;
    }
    if (!oldPassword || !newPassword) {
      setProfileMsg({ text: "Please fill all password fields", type: "error" });
      return;
    }
    try {
      setIsUpdatingPassword(true);
      setProfileMsg({ text: "Updating password...", type: "info" });
      await api.put("/users/reset-password", { oldPassword, newPassword });
      setProfileMsg({ text: "Password reset successful", type: "success" });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || "Failed to reset password", type: "error" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-transparent p-4 sm:p-8 space-y-8">
      
      {profileMsg.text && (
        <div className={`p-4 rounded-xl text-sm font-semibold border ${profileMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
          {profileMsg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        
        {/* Profile Photo Update */}
        <div className="flex flex-col items-start text-left space-y-6">
          <div>
            <h3 className="text-xl font-black text-crmisa-darkNavy">Avatar & Details</h3>
            <p className="text-sm text-slate-500 mt-1">Update your profile picture</p>
          </div>
          
          <div className="flex flex-col items-start gap-5">
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden shrink-0">
              <img 
                src={profilePhoto ? URL.createObjectURL(profilePhoto) : (user?.avatar && user.avatar.includes('http') && !user.avatar.includes('user-placeholder.png') ? user.avatar : "https://ui-avatars.com/api/?name=User&background=000&color=fff&size=128")} 
                className="w-full h-full object-cover" 
                alt="Avatar Preview" 
              />
            </div>
            <div className="flex flex-col items-start space-y-4">
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                className="max-w-xs text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-crmisa-navy file:text-white hover:file:bg-crmisa-accentNavy cursor-pointer transition-colors"
              />
              <button 
                onClick={handleUpdateProfilePhoto}
                disabled={!profilePhoto || isUploading}
                className="px-8 py-2.5 bg-crmisa-darkNavy text-white text-sm font-bold rounded-lg disabled:opacity-50 hover:bg-crmisa-accentNavy transition-colors"
              >
                {isUploading ? "Uploading..." : "Save Photo"}
              </button>
            </div>
          </div>
        </div>

        {/* Password Reset */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-crmisa-darkNavy">Security</h3>
            <p className="text-sm text-slate-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
          </div>
          
          <div className="space-y-5 max-w-md w-full">
            <div>
              <label className="block text-sm font-bold text-crmisa-navy mb-1.5">Current Password</label>
              <input 
                type="password" 
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-black focus:border-crmisa-darkNavy outline-none text-sm transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-crmisa-navy mb-1.5">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-black focus:border-crmisa-darkNavy outline-none text-sm transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-crmisa-navy mb-1.5">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-black focus:border-crmisa-darkNavy outline-none text-sm transition-all bg-white"
              />
            </div>
            <button 
              onClick={handleResetPassword}
              disabled={isUpdatingPassword}
              className="px-6 py-3 bg-crmisa-darkNavy text-white text-sm font-bold rounded-lg hover:bg-crmisa-accentNavy transition-colors w-full disabled:opacity-70 mt-2"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
