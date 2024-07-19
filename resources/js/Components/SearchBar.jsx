import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AccessTokenModal from '../Components/Modais/AcessToken';
import NoAccessModal from '../Components/Modais/NoAcessModal';

const SearchBar = ({ setEvents, setSelectedUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [showAccessTokenModal, setShowAccessTokenModal] = useState(false);
  const [showNoAccessModal, setShowNoAccessModal] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Limpa sugestões e busca quando o componente é montado
    setSuggestions([]);
    setSearchTerm('');
  }, []);

  const handleSearchChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() === '') {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`/search?query=${encodeURIComponent(term)}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setError('Erro ao buscar sugestões. Por favor, tente novamente mais tarde.');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (selectedItem) => {
    if (selectedItem.type === 'user') {
      const user = selectedItem.data;
      setSelectedUserForModal(user);

      if (user.permission_type === 'protected') {
        setShowAccessTokenModal(true);
      } else if (user.permission_type === 'private') {
        setShowNoAccessModal(true);
      } else {
        // Se a agenda não for protegida nem privada, carrega a agenda diretamente e passa o usuário selecionado
        setSelectedUser(user);
        accessUserAgenda(user.id);
      }
    }

    setSearchTerm('');
    setSuggestions([]);
  };

  const accessUserAgenda = async (userId, token = null) => {
    try {
      const response = await axios.get(`/user/${userId}/agenda`, {
        params: { token }
      });

      if (response.data && response.data.error) {
        setError(response.data.error);
        setEvents([]);
      } else {
        setEvents(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('Erro ao carregar agenda do usuário:', error);
      setError('Erro ao carregar agenda do usuário. Por favor, tente novamente mais tarde.');
    }
  };

  const handleTokenSubmit = async () => {
    if (!token || token !== selectedUserForModal.access_code) {
      setError('Token inválido. Por favor, verifique e tente novamente.');
      return;
    }

    setShowAccessTokenModal(false);
    setSelectedUser(selectedUserForModal); // Passa o usuário selecionado somente se o token for válido
    accessUserAgenda(selectedUserForModal.id, token);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar eventos ou usuários..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full px-4 py-2 border-2 border-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white placeholder-white"
      />
      {searchTerm.trim() !== '' && (
        <ul className="absolute w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto z-50">
          {suggestions.length > 0 ? (
            suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              >
                {item.type === 'event' ? item.data.title : item.data.name}
              </li>
            ))
          ) : (
            <li className="px-4 py-2">Nenhum resultado encontrado</li>
          )}
        </ul>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <AccessTokenModal
        isOpen={showAccessTokenModal}
        onClose={() => setShowAccessTokenModal(false)}
        onSubmit={handleTokenSubmit}
        token={token}
        setToken={setToken}
      />

      <NoAccessModal
        isOpen={showNoAccessModal}
        onClose={() => setShowNoAccessModal(false)}
        user={selectedUserForModal}
      />
    </div>
  );
};

export default SearchBar;
