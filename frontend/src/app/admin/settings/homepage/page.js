"use client";

import { useState, useEffect } from 'react';
import { getHomepageSettings, updateHomepageSettings } from '@/api/settings.api';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import { toast } from 'react-hot-toast'; // Assuming toast is available, or use a custom one

export default function HomepageCMS() {
    const { language } = useLanguage();
    const t = translations[language] || translations.EN;

    const [settings, setSettings] = useState({
        hero_title: '',
        hero_desc: '',
        hero_cta: '',
        hero_image: '',
        hero_badge: '',
        hero_rating_text: '',
        hero_discount_text: '',
        weekly_deals_title: '',
        weekly_deals_desc: '',
        value_deals_title: '',
        value_deals_desc: '',
        categories_title: '',
        categories_desc: '',
        featured_title: '',
        featured_desc: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getHomepageSettings();
                // Set defaults from translations if not present in DB
                setSettings({
                    hero_title: data.hero_title || t.hero_title || '',
                    hero_desc: data.hero_desc || t.hero_desc || '',
                    hero_cta: data.hero_cta || t.shop_now || '',
                    hero_image: data.hero_image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
                    hero_badge: data.hero_badge || t.cat_weekly_deals || 'Weekly Deals',
                    hero_rating_text: data.hero_rating_text || '4.9/5.0 Store',
                    hero_discount_text: data.hero_discount_text || 'Up to 45% OFF',
                    weekly_deals_title: data.weekly_deals_title || t.cat_weekly_deals || '',
                    weekly_deals_desc: data.weekly_deals_desc || '⚡ Hot Deals Live',
                    value_deals_title: data.value_deals_title || t.cat_value_deals || '',
                    value_deals_desc: data.value_deals_desc || '💎 Best Value',
                    categories_title: data.categories_title || t.shop_by_category || '',
                    categories_desc: data.categories_desc || 'Explore our variety',
                    featured_title: data.featured_title || t.featured_products || '',
                    featured_desc: data.featured_desc || t.top_rated_items || ''
                });
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateHomepageSettings(settings);
            alert('Homepage content updated successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to update homepage content.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 animate-pulse text-[#003B4A] font-bold">Loading Homepage CMS...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-[#003B4A] tracking-tight">Homepage CMS</h1>
                    <p className="text-slate-500 text-sm font-bold mt-1">Customize your landing page content without touching code.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#003B4A] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#002B36] transition-all disabled:opacity-50"
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8 pb-20">
                {/* Hero Section */}
                <Section title="Hero Banner Section" icon="🚀">
                    <Field label="Hero Title" name="hero_title" value={settings.hero_title} onChange={handleChange} />
                    <Field label="Hero Description" name="hero_desc" value={settings.hero_desc} onChange={handleChange} isTextArea />
                    <Field label="Hero CTA Button" name="hero_cta" value={settings.hero_cta} onChange={handleChange} />
                    <Field label="Hero Image URL" name="hero_image" value={settings.hero_image} onChange={handleChange} />
                    <Field label="Hero Badge Text" name="hero_badge" value={settings.hero_badge} onChange={handleChange} />
                    <Field label="Rating Card Text" name="hero_rating_text" value={settings.hero_rating_text} onChange={handleChange} />
                    <Field label="Discount Card Text" name="hero_discount_text" value={settings.hero_discount_text} onChange={handleChange} />
                </Section>

                {/* Weekly Deals Section */}
                <Section title="Weekly Deals Section" icon="⚡">
                    <Field label="Weekly Deals Title" name="weekly_deals_title" value={settings.weekly_deals_title} onChange={handleChange} />
                    <Field label="Weekly Deals Subtitle" name="weekly_deals_desc" value={settings.weekly_deals_desc} onChange={handleChange} />
                </Section>

                {/* Value Deals Section */}
                <Section title="Value Deals Section" icon="💎">
                    <Field label="Value Deals Title" name="value_deals_title" value={settings.value_deals_title} onChange={handleChange} />
                    <Field label="Value Deals Subtitle" name="value_deals_desc" value={settings.value_deals_desc} onChange={handleChange} />
                </Section>

                {/* Categories Section */}
                <Section title="Categories Section" icon="📁">
                    <Field label="Categories Title" name="categories_title" value={settings.categories_title} onChange={handleChange} />
                    <Field label="Categories Subtitle" name="categories_desc" value={settings.categories_desc} onChange={handleChange} />
                </Section>

                {/* Featured Products Section */}
                <Section title="Featured Products Section" icon="✨">
                    <Field label="Featured Title" name="featured_title" value={settings.featured_title} onChange={handleChange} />
                    <Field label="Featured Subtitle" name="featured_desc" value={settings.featured_desc} onChange={handleChange} />
                </Section>
            </form>
        </div>
    );
}

function Section({ title, icon, children }) {
    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-xl font-black text-[#003B4A]">{title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6">
                {children}
            </div>
        </div>
    );
}

function Field({ label, name, value, onChange, isTextArea = false }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
            {isTextArea ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#003B4A]/10 focus:border-[#003B4A] transition-all outline-none font-medium text-slate-700 min-h-[100px]"
                />
            ) : (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-[#003B4A]/10 focus:border-[#003B4A] transition-all outline-none font-medium text-slate-700"
                />
            )}
        </div>
    );
}
