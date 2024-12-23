import { defineStore } from 'pinia';
import { auth, board, list, card } from '../api';
import { setAuthInHeader } from '../api';

export const useStore = defineStore('main', {
  state: () => ({
    accessToken: null,
    boardList: [],
    board: {
      lists: [],
    },
    card: {},
    isAddBoard: false,
    isShowBoardMenu: false,
    navbarColor: '#026aa7',
    bodyColor: 'rgb(255,255,255)',
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    hasBoardList: (state) => state.boardList.length > 0,
  },

  actions: {
    // Auth Actions
    async LOGIN({ email, password }) {
      const { accessToken } = await auth.login(email, password);
      if (accessToken) {
        this.LOGIN_WITH_TOKEN(accessToken);
      }
    },
    LOGIN_WITH_TOKEN(accessToken) {
      this.accessToken = accessToken;
      localStorage.accessToken = accessToken;
      setAuthInHeader(accessToken);
    },
    LOGOUT() {
      this.accessToken = null;
      delete localStorage.accessToken;
      setAuthInHeader(null);
    },

    // Board Actions
    async FETCH_BOARD_LIST() {
      const data = await board.fetch();
      this.boardList = data.list.map((board) => board);
    },
    async FETCH_BOARD(id) {
      const data = await board.fetch(id);
      this.board = data.item;
    },
    async ADD_BOARD(title) {
      const { item } = await board.create(title);
      return item.id;
    },
    async UPDATE_BOARD({ id, title, bgColor }) {
      await board.update(id, { title, bgColor });
      if (this.board.id === id) {
        await this.FETCH_BOARD(id);
      }
    },
    async DELETE_BOARD(id) {
      await board.destroy(id);
    },

    // List Actions
    async ADD_LIST({ title, boardId, pos }) {
      await list.create({ title, pos, boardId });
      if (this.board.id === boardId) {
        await this.FETCH_BOARD(boardId);
      }
    },
    async UPDATE_LIST({ id, pos, title }) {
      await list.update(id, { pos, title });
      await this.FETCH_BOARD(this.board.id);
    },
    async DELETE_LIST({ id }) {
      await list.destroy(id);
      await this.FETCH_BOARD(this.board.id);
    },

    // Card Actions
    async FETCH_CARD(id) {
      const { item } = await card.fetch(id);
      this.card = item;
    },
    async ADD_CARD({ title, pos, listId }) {
      await card.create({ title, pos, listId });
      await this.FETCH_BOARD(this.board.id);
    },
    async UPDATE_CARD({ id, pos, title, description, listId }) {
      await card.update(id, { pos, title, description, listId });
      await this.FETCH_BOARD(this.board.id);
    },
    async DELETE_CARD(id) {
      await card.destroy(id);
      await this.FETCH_BOARD(this.board.id);
    },

    // UI State Actions
    SET_IS_ADD_BOARD(toggle) {
      this.isAddBoard = toggle;
    },
    SET_IS_SHOW_BOARD_MENU(toggle) {
      this.isShowBoardMenu = toggle;
    },
    SET_THEME(color) {
      this.bodyColor = color || 'rgb(255,255,255)';
      this.navbarColor = color ? 'rgba(0,0,0,.15)' : '#026aa7';
    },
  },
});
