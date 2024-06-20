import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ setEvents, setUsers, onSelectEvent, setSelectedUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const handleSearchChange = async (event) => {
    const term = event.target.value.trim();

    setSearchTerm(term);

    if (term === '') {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`/search?query=${term}`); // Endpoint ajustado para corresponder ao Laravel
      setSuggestions(response.data);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setError('Erro ao buscar sugestões. Por favor, tente novamente mais tarde.');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (selectedItem) => {
    if (selectedItem.type === 'event') {
      onSelectEvent(selectedItem.data);
    } else if (selectedItem.type === 'user') {
      try {
        const response = await axios.get(`/user/${selectedItem.data.id}/agenda`);
        setEvents(response.data); // Assumindo que response.data contém os eventos da agenda do usuário
        console.log('Acessando agenda do usuário com ID:', selectedItem.data.id);

        // Aqui você deve usar setSelectedUser para atualizar o estado selectedUser
        setSelectedUser(selectedItem.data);
      } catch (error) {
        console.error('Erro ao carregar agenda do usuário:', error);
        setError('Erro ao carregar agenda do usuário. Por favor, tente novamente mais tarde.');
      }
    }

    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search events or users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <ul>
        {suggestions.map((item, index) => (
          <li key={index} onClick={() => handleSuggestionClick(item)}>
            {item.type === 'event' ? item.data.title : item.data.name}
          </li>
        ))}
      </ul>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default SearchBar;
