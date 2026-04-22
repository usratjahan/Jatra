import React from 'react';

const AdminHeader = ({ onToggleSidebar, onLogout }) => {
	return (
		<header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={onToggleSidebar}
						className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50 lg:hidden"
						aria-label="Open admin menu"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
							<path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
						</svg>
					</button>

					<div>
						<p className="text-sm font-extrabold text-gray-900 sm:text-base">Admin Panel</p>
						<p className="text-xs text-gray-500">Manage dashboard content and operations</p>
					</div>
				</div>

				<button
					type="button"
					onClick={onLogout}
					className="rounded-lg bg-green-500 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green-600"
				>
					Logout
				</button>
			</div>
		</header>
	);
};

export default AdminHeader;
