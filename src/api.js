const axios = require('axios');
const { prop } = require('ramda');

const basicJsonHeader = { 'Content-Type': 'application/json' };

const BASE_API_URL = process.env.API_URL || 'https://banana-peel-server.herokuapp.com/api';

const client = axios.create({
  baseURL: BASE_API_URL,
  headers: basicJsonHeader
});

const gameCompleted = async gameData => {
  const response = await client.post('/games', { data: gameData });

  return prop('data', response);
};

const getGameById = async gameId => {
  const response = await client.get(`/games/gameId/${gameId}`);

  return prop('data', response);
};

module.exports = {
  gameCompleted,
  getGameById
};
