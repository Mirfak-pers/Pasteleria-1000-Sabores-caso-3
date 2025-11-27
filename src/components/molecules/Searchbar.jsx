import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Buscar:', query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <Input
        type="text"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
      />
      <Button variant="secondary" type="submit">
        Buscar
      </Button>
    </form>
  );
};

export default SearchBar;