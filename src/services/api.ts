import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://ikarosilvapodcastrapi.herokuapp.com/'
})