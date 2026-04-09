// FILE: src/components/eventDetail/tabs/TermsTab.jsx

import React from "react";

const TermsTab = ({ terms = {} }) => {
  const { general = [], cancellationPolicy = {}, liability = "", contact = "" } = terms;

  return (
    <div className="space-y-6 text-sm text-gray-700">

      {/* General terms */}
      {general.length > 0 && (
        <section>
          <h4 className="font-bold text-gray-900 mb-3">General Terms</h4>
          <div className="space-y-2">
            {general.map((point, i) => (
              <p key={i} className="leading-relaxed">{point}</p>
            ))}
          </div>
        </section>
      )}

      {/* Cancellation policy */}
      {cancellationPolicy.title && (
        <section className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-2">{cancellationPolicy.title}</h4>
          {cancellationPolicy.intro && (
            <p className="text-gray-600 mb-3">{cancellationPolicy.intro}</p>
          )}
          <ul className="space-y-2">
            {(cancellationPolicy.points || []).map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-teal-500 font-bold mt-0.5">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Limitation of liability */}
      {liability && (
        <section>
          <h4 className="font-bold text-gray-900 mb-2">Limitation of Liability</h4>
          <p className="leading-relaxed">{liability}</p>
        </section>
      )}

      {/* Contact info */}
      {contact && (
        <section>
          <h4 className="font-bold text-gray-900 mb-2">Contact Information</h4>
          <p className="leading-relaxed">{contact}</p>
        </section>
      )}

    </div>
  );
};

export default TermsTab;