"use client";

import { useState } from 'react';

/**
 * Enterprise Settings Module
 */
export default function AdminSettingsPage() {
    const [settings, setSettings] = useState({
        siteName: 'Baksho',
        supportEmail: 'support@baksho.com',
        freeDelivery: 50,
        taxRate: 19, // DE Standard MwSt
        currency: 'EUR',
        maintenance: false
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900">System Settings</h1>
                <p className="text-slate-500 text-sm font-medium mt-1">Configure global store parameters and business rules</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Store Config */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#003B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        General Configuration
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Store Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                value={settings.siteName}
                                onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Support Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                value={settings.supportEmail}
                                onChange={e => setSettings(s => ({ ...s, supportEmail: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Business Rules */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-[#003B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        Thresholds & Taxes
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Free Delivery (€)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                value={settings.freeDelivery}
                                onChange={e => setSettings(s => ({ ...s, freeDelivery: parseFloat(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Default Tax (%)</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                value={settings.taxRate}
                                onChange={e => setSettings(s => ({ ...s, taxRate: parseFloat(e.target.value) }))}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase mb-2">Currency</label>
                            <select
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
                                value={settings.currency}
                                onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))}
                            >
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                                <option value="BDT">BDT (৳)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Safety */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z" /></svg>
                        Danger Zone
                    </h3>

                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                        <div>
                            <p className="text-sm font-black text-red-900">Maintenance Mode</p>
                            <p className="text-[10px] text-red-700 font-bold uppercase tracking-wider">Site will only be accessible to Admins</p>
                        </div>
                        <button
                            onClick={() => setSettings(s => ({ ...s, maintenance: !s.maintenance }))}
                            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${settings.maintenance ? 'bg-red-600 text-white' : 'bg-white border border-red-200 text-red-600'}`}
                        >
                            {settings.maintenance ? 'DISABLE' : 'ENABLE'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#003B4A] text-white rounded-xl text-sm font-black hover:bg-[#002B36] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    {isSaving ? 'Saving Changes...' : 'Save Global Settings'}
                </button>
            </div>
        </div>
    );
}
