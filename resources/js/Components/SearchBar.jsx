import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const SearchBar = ({ setEvents, setSelectedUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [token, setToken] = useState('');
  const [selectedUserForToken, setSelectedUserForToken] = useState(null);

  useEffect(() => {
    setSuggestions([]);
    setSearchTerm('');
  }, []);

  const handleSearchChange = async (event) => {
    const term = event.target.value.trim();

    setSearchTerm(term);

    if (term === '') {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(`/search?query=${term}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      setError('Erro ao buscar sugestões. Por favor, tente novamente mais tarde.');
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (selectedItem) => {
    if (selectedItem.type === 'event') {
      // Tratar clique em evento aqui se necessário
    } else if (selectedItem.type === 'user') {
      setSelectedUser(selectedItem.data); // Atualiza o estado selectedUser

      if (selectedItem.data.permission_type === 'protected') {
        setSelectedUserForToken(selectedItem.data);

        // Verificar se há token armazenado no localStorage para este usuário
        const storedToken = localStorage.getItem(`agendaAccessToken_${selectedItem.data.id}`);
        if (storedToken && storedToken === selectedItem.data.access_code) {
          // Se o token armazenado for válido, acessar diretamente a agenda
          accessUserAgenda(selectedItem.data.id, storedToken);
        } else {
          // Caso contrário, exibir o modal para inserir o token
          setShowTokenModal(true);
        }
      } else {
        // Acessar agenda normalmente se não for protegida
        accessUserAgenda(selectedItem.data.id);
      }
    }

    setSearchTerm('');
    setSuggestions([]);
  };

  const accessUserAgenda = async (userId, storedToken = null) => {
    try {
      const response = await axios.get(`/user/${userId}/agenda`, {
        params: { token: storedToken }
      });

      if (response.data && response.data.message) {
        console.log('Nenhum evento encontrado:', response.data);
        setEvents([]);
        setError(response.data.message);
      } else {
        console.log('Eventos carregados:', response.data);
        setEvents(response.data);
        setError(null);

        // Armazenar o token no localStorage se não estiver armazenado ou for diferente
        if (selectedUserForToken && (!storedToken || storedToken !== selectedUserForToken.access_code)) {
          localStorage.setItem(`agendaAccessToken_${userId}`, selectedUserForToken.access_code);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar agenda do usuário:', error);
      setError('Erro ao carregar agenda do usuário. Por favor, tente novamente mais tarde.');
    }
  };

  const handleTokenSubmit = async () => {
    setShowTokenModal(false);

    try {
      const response = await axios.get(`/user/${selectedUserForToken.id}/agenda`, {
        params: { token }
      });

      if (response.data && response.data.message) {
        console.log('Nenhum evento encontrado:', response.data);
        setEvents([]);
        setError(response.data.message);
      } else {
        console.log('Eventos carregados:', response.data);
        setEvents(response.data);
        setError(null);

        // Armazenar o token no localStorage
        localStorage.setItem(`agendaAccessToken_${selectedUserForToken.id}`, token);
      }
    } catch (error) {
      console.error('Erro ao carregar agenda do usuário:', error);
      setError('Erro ao carregar agenda do usuário. Por favor, tente novamente mais tarde.');
    }
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

      {/* Modal para inserir token */}
      <Modal show={showTokenModal} onHide={() => setShowTokenModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Inserir Token de Acesso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="tokenInput">
            <Form.Label>Token de Acesso</Form.Label>
            <Form.Control
              type="text"
              placeholder="Insira o token de acesso"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTokenModal(false)}>
            Fechar
          </Button>
          <Button
            variant="primary"
            onClick={handleTokenSubmit}
            disabled={!token || token !== selectedUserForToken.access_code}
          >
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchBar;
