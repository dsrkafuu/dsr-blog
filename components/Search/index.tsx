'use client';

import './index.scss';
import { useState } from 'react';
import { ISearch } from '@/icons';

export const SEARCH_URL = 'https://www.google.com/search';
export const SEARCH_SITE = 'blog.dsrkafuu.net/post';

const Search = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (!query || typeof query !== 'string' || query.trim() === '') {
      return;
    }
    const url = new URL(SEARCH_URL);
    url.searchParams.append('q', query.trim());
    url.searchParams.append('newwindow', '1');
    url.searchParams.append('as_sitesearch', SEARCH_SITE);
    window.open(url.toString());
  };

  return (
    <div className='card search'>
      <div className='search__input'>
        <input
          type='text'
          id='search-input'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
      </div>
      <label
        className='search__ctrl'
        id='search-btn'
        title='搜索'
        htmlFor='search-input'
        onClick={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <ISearch />
      </label>
    </div>
  );
};

export default Search;
