import React, { useMemo, useState, useEffect } from 'react';
import './FiltersSidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FiltersSidebar({ products }) {
  const navigate = useNavigate();
  const location = useLocation();

  const paramsFromUrl = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return {
      gender: sp.get('gender') || '',
      brandName: sp.get('brandName') || '',
      categoryName: sp.get('categoryName') || '',
      priceMin: sp.get('priceMin') || '',
      priceMax: sp.get('priceMax') || ''
    };
  }, [location.search]);

  const [state, setState] = useState(paramsFromUrl);
  useEffect(() => setState(paramsFromUrl), [paramsFromUrl]);

  const unique = (arr) => Array.from(new Set(arr.filter(Boolean)));
  const genders = ['MEN', 'WOMEN', 'KIDS', 'UNISEX'];
  const brands = useMemo(() => unique((products || []).map(p => p.Brand || p.brand || '')) , [products]);
  const categories = useMemo(() => unique((products || []).map(p => p.Category || p.category || '')) , [products]);

  const priceRanges = [
    { label: '< 1.000.000 ₫', min: 0, max: 1000000 },
    { label: '1.000.000 - 2.000.000 ₫', min: 1000000, max: 2000000 },
    { label: '2.000.000 - 3.000.000 ₫', min: 2000000, max: 3000000 },
    { label: '> 3.000.000 ₫', min: 3000000, max: '' }
  ];

  const apply = (next) => {
    const sp = new URLSearchParams(location.search);
    Object.entries(next).forEach(([k, v]) => {
      if (v === '' || v == null) sp.delete(k); else sp.set(k, v);
    });
    navigate(`/products?${sp.toString()}`);
  };

  const onChange = (key, value) => {
    const next = { ...state, [key]: value };
    setState(next);
    apply(next);
  };

  const onPriceChange = (range) => {
    const next = { ...state, priceMin: range.min, priceMax: range.max };
    setState(next);
    apply(next);
  };

  const isPriceActive = (r) => String(state.priceMin) === String(r.min) && String(state.priceMax) === String(r.max);

  return (
    <aside className="filters-sidebar">
      <div className="filter-group">
        <h4>Giới tính</h4>
        {genders.map(g => (
          <label key={g} className="filter-item">
            <input
              type="radio"
              name="gender"
              checked={(state.gender || '').toUpperCase() === g}
              onChange={() => onChange('gender', g)}
            />
            <span>{g}</span>
          </label>
        ))}
        <button className="clear-btn" onClick={() => onChange('gender', '')}>Bỏ chọn</button>
      </div>

      <div className="filter-group">
        <h4>Thương hiệu</h4>
        <select value={state.brandName} onChange={(e) => onChange('brandName', e.target.value)}>
          <option value="">Tất cả</option>
          {brands.map(b => (<option key={b} value={b}>{b}</option>))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Danh mục</h4>
        <select value={state.categoryName} onChange={(e) => onChange('categoryName', e.target.value)}>
          <option value="">Tất cả</option>
          {categories.map(c => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Giá</h4>
        {priceRanges.map(r => (
          <button key={r.label} className={`price-chip ${isPriceActive(r) ? 'active' : ''}`} onClick={() => onPriceChange(r)}>
            {r.label}
          </button>
        ))}
        <button className="clear-btn" onClick={() => onPriceChange({min:'',max:''})}>Xóa lọc giá</button>
      </div>
    </aside>
  );
}


