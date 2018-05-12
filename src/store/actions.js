import * as types from './mutationTypes';
import { http } from '@/utility/http';
import { api } from '@/utility/api';

export const fetchAuth = ({ commit }) => {
  http
    .get(api.auth)
    .then(data => {
      commit(types.SET_AUTH, data.agencyfunctions);
    })
    .catch(() => {
      commit(types.SET_AUTH_ERROR);
    });
};
