import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryChips.css';

function CategoryChips({ showTitle = true, className = '' }) {
	const navigate = useNavigate();

	const chips = [
		{ id: 'shoes', label: 'Shoes', route: '/products?tag=shoes' },
		{ id: 'men', label: 'Men', route: '/products?tag=men' },
		{ id: 'women', label: 'Women', route: '/products?tag=women' },
		{ id: 'kids', label: 'Kids', route: '/products?tag=kids' },
		{ id: 'sports', label: 'Sports', route: '/products?tag=sports' },
		{ id: 'brands', label: 'Brands', route: '/products?tag=brands' }
	];

	return (
		<section className={`chips-section ${className}`}>
			<div className="chips-container">
				{showTitle && <h3 className="chips-title">Quick filters</h3>}
				<div className="chips-row">
					{chips.map((c) => (
						<button
							key={c.id}
							className="chip"
							onClick={() => navigate(c.route)}
						>
							{c.label}
						</button>
					))}
				</div>
			</div>
		</section>
	);
}

export default CategoryChips;


