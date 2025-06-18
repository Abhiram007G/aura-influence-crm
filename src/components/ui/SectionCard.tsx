import React from "react";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, className }) => (
  <div className={`bg-white rounded-lg shadow p-6 mb-6 border border-slate-200 ${className || ""}`}>
    {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
    {children}
  </div>
);

export default SectionCard; 