import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addAddress } from "./services/api/profileService";

export default function CheckoutAddress() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    houseNo: '',
    street: '',
    pincode: '',
    city: 'Surat', // Default city for now
    type: 'Home',
    latitude: 21.1702, // Default Surat coordinates
    longitude: 72.8311
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobileNumber || !formData.pincode) {
        alert("Please fill in all required fields");
        return;
    }

    setIsSaving(true);
    try {
        const response = await addAddress(formData);
        if (response.success) {
            navigate("/grocery/checkout");
        } else {
            alert(response.message || "Failed to save address");
        }
    } catch (error) {
        console.error("Error saving address:", error);
        // Fallback for demo if API fails
        // navigate("/grocery/checkout");
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
        <header className="px-4 py-4 bg-white border-b sticky top-0 z-10 flex items-center gap-3">
             <button onClick={() => navigate(-1)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
             </button>
             <h1 className="text-xl font-bold text-neutral-900">Add Delivery Address</h1>
        </header>

        <form onSubmit={handleSave} className="p-4 space-y-5 max-w-md mx-auto mt-4">
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase ml-1 mb-1 block">Full Name</label>
                    <input 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
                        placeholder="e.g. John Doe" 
                        required
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase ml-1 mb-1 block">Mobile Number</label>
                    <input 
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
                        placeholder="10-digit mobile number" 
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase ml-1 mb-1 block">House / Flat No.</label>
                        <input 
                            name="houseNo"
                            value={formData.houseNo}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
                            placeholder="e.g. A-101" 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-neutral-500 uppercase ml-1 mb-1 block">Pincode</label>
                        <input 
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
                            placeholder="6-digit code" 
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-neutral-500 uppercase ml-1 mb-1 block">Street / Area / Landmark</label>
                    <input 
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full p-4 rounded-xl border border-neutral-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" 
                        placeholder="e.g. Near City Park" 
                    />
                </div>
            </div>

            <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-emerald-600 active:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 disabled:opacity-50 transition-all"
                  disabled={isSaving}
                >
                    {isSaving ? (
                        <div className="flex items-center justify-center gap-2">
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                             <span>Saving Address...</span>
                        </div>
                    ) : "Save Address"}
                </button>
            </div>
        </form>
    </div>
  );
}
