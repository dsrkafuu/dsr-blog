'use client';

import './index.scss';
import { type FormEvent, useState } from 'react';

import { ISearch } from '@/icons';

export const SEARCH_URL = 'https://www.google.com/search';
export const SEARCH_SITE = 'blog.dsrkafuu.net/post';

const Search = () => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }
    const url = new URL(SEARCH_URL);
    url.searchParams.append('q', trimmedQuery);
    url.searchParams.append('newwindow', '1');
    url.searchParams.append('as_sitesearch', SEARCH_SITE);
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch();
  };

  return (
    <form className='card search' role='search' onSubmit={handleSubmit}>
      <div className='search__input'>
        <input
          type='search'
          id='search-input'
          name='q'
          aria-label='搜索文章'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <button
        type='submit'
        className='search__ctrl'
        id='search-btn'
        title='搜索文章'
        aria-label='搜索文章'
      >
        <ISearch aria-hidden='true' focusable='false' />
      </button>
    </form>
  );
};

export default Search;
