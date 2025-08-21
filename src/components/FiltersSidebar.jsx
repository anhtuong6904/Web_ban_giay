import React, { useMemo, useState, useEffect } from 'react';
import './FiltersSidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

export default function FiltersSidebar({ products }) {
  const navigate = useNavigate();
  const location = useLocation();

  const paramsFromUrl = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    const tag = sp.get('tag') || '';
    const gender = sp.get('gender') || '';
    
    // Map tag to gender for navigation sync
    let mappedGender = gender;
    if (tag && !gender) {
      const tagToGender = {
        'men': 'MEN',
        'women': 'WOMEN', 
        'kids': 'KIDS',
        'sports': 'SPORTS'
      };
      mappedGender = tagToGender[tag.toLowerCase()] || '';
    }
    
          return {
        gender: mappedGender,
        brandName: sp.get('brandName') || '',
        categoryName: sp.get('categoryName') || '',
        priceMin: sp.get('priceMin') || '',
        priceMax: sp.get('priceMax') || '',
        discountMin: sp.get('discountMin') || '',
        discountMax: sp.get('discountMax') || '',
        ratingMin: sp.get('ratingMin') || '',
        ratingMax: sp.get('ratingMax') || ''
      };
  }, [location.search]);

  const [state, setState] = useState(paramsFromUrl);
  useEffect(() => setState(paramsFromUrl), [paramsFromUrl]);

  const unique = (arr) => Array.from(new Set(arr.filter(Boolean)));
  const genders = ['MEN', 'WOMEN', 'KIDS', 'SPORTS'];
  const brands = useMemo(() => unique((products || []).map(p => p.Brand || p.brand || '')) , [products]);
  const categories = useMemo(() => unique((products || []).map(p => p.Category || p.category || '')) , [products]);

  const priceRanges = [
    { label: '< 1.000.000 ₫', min: 0, max: 1000000, id: 'under-1m' },
    { label: '1.000.000 - 2.000.000 ₫', min: 1000000, max: 2000000, id: '1m-2m' },
    { label: '2.000.000 - 3.000.000 ₫', min: 2000000, max: 3000000, id: '2m-3m' },
    { label: '3.000.000 - 5.000.000 ₫', min: 3000000, max: 5000000, id: '3m-5m' },
    { label: '> 5.000.000 ₫', min: 5000000, max: '', id: 'over-5m' }
  ];

  // Thêm filter theo discount
  const discountRanges = [
    { label: 'Giảm giá < 10%', min: 0, max: 10, id: 'discount-under-10' },
    { label: 'Giảm giá 10% - 20%', min: 10, max: 20, id: 'discount-10-20' },
    { label: 'Giảm giá 20% - 30%', min: 20, max: 30, id: 'discount-20-30' },
    { label: 'Giảm giá > 30%', min: 30, max: 100, id: 'discount-over-30' }
  ];

  // Thêm filter theo rating
  const ratingRanges = [
    { label: '⭐ 1-2 sao', min: 1, max: 2, id: 'rating-1-2' },
    { label: '⭐⭐ 2-3 sao', min: 2, max: 3, id: 'rating-2-3' },
    { label: '⭐⭐⭐ 3-4 sao', min: 3, max: 4, id: 'rating-3-4' },
    { label: '⭐⭐⭐⭐ 4-5 sao', min: 4, max: 5, id: 'rating-4-5' }
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
    
    // If changing gender, also update tag parameter for navigation sync
    if (key === 'gender') {
      const genderToTag = {
        'MEN': 'men',
        'WOMEN': 'women',
        'KIDS': 'kids', 
        'SPORTS': 'sports'
      };
      const tag = genderToTag[value] || '';
      
      const sp = new URLSearchParams(location.search);
      if (tag) {
        sp.set('tag', tag);
        sp.set('gender', value);
      } else {
        sp.delete('tag');
        sp.delete('gender');
      }
      navigate(`/products?${sp.toString()}`);
    } else {
      apply(next);
    }
  };

  const onPriceChange = (range) => {
    const next = { ...state, priceMin: range.min, priceMax: range.max };
    setState(next);
    apply(next);
  };

  const onDiscountChange = (range) => {
    const next = { ...state, discountMin: range.min, discountMax: range.max };
    setState(next);
    apply(next);
  };

  const onRatingChange = (range) => {
    const next = { ...state, ratingMin: range.min, ratingMax: range.max };
    setState(next);
    apply(next);
  };

  const isPriceActive = (r) => String(state.priceMin) === String(r.min) && String(state.priceMax) === String(r.max);
  const isDiscountActive = (r) => String(state.discountMin) === String(r.min) && String(state.discountMax) === String(r.max);
  const isRatingActive = (r) => String(state.ratingMin) === String(r.min) && String(state.ratingMax) === String(r.max);

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
        <div className="price-filters">
          {priceRanges.map(r => (
            <button 
              key={r.id} 
              className={`price-chip ${isPriceActive(r) ? 'active' : ''}`} 
              onClick={() => onPriceChange(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button className="clear-btn" onClick={() => onPriceChange({min:'',max:''})}>
          <i className="fas fa-times"></i>
          Xóa lọc giá
        </button>
      </div>

      <div className="filter-group">
        <h4>Giảm giá</h4>
        <div className="discount-filters">
          {discountRanges.map(r => (
            <button 
              key={r.id} 
              className={`discount-chip ${isDiscountActive(r) ? 'active' : ''}`} 
              onClick={() => onDiscountChange(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button className="clear-btn" onClick={() => onDiscountChange({min:'',max:''})}>
          <i className="fas fa-times"></i>
          Xóa lọc giảm giá
        </button>
      </div>

      <div className="filter-group">
        <h4>Đánh giá</h4>
        <div className="rating-filters">
          {ratingRanges.map(r => (
            <button 
              key={r.id} 
              className={`rating-chip ${isRatingActive(r) ? 'active' : ''}`} 
              onClick={() => onRatingChange(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button className="clear-btn" onClick={() => onRatingChange({min:'',max:''})}>
          <i className="fas fa-times"></i>
          Xóa lọc đánh giá
        </button>
      </div>

      <div className="filter-group">
        <h4>Thao tác nhanh</h4>
        <button className="quick-filter-btn" onClick={() => {
          // Reset tất cả filter
          const resetState = {
            gender: '',
            brandName: '',
            categoryName: '',
            priceMin: '',
            priceMax: '',
            discountMin: '',
            discountMax: '',
            ratingMin: '',
            ratingMax: ''
          };
          setState(resetState);
          apply(resetState);
        }}>
          <i className="fas fa-refresh"></i>
          Xóa tất cả bộ lọc
        </button>
      </div>
    </aside>
  );
}


