import React from "react";

const InclusionsTab = ({ inclusions = [] }) => (
	<ul className="space-y-3">
		{inclusions.map((item, idx) => (
			<li key={idx} className="flex items-start gap-3">
				<span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="#16a34a"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
				</span>
				<span className="text-gray-700 text-sm leading-relaxed">{item}</span>
			</li>
		))}
	</ul>
);

export default InclusionsTab;
