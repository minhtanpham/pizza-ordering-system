const storage = localStorage || window.localStorage;
const sessionStr = sessionStorage || window.sessionStorage;
const storageAccessToken = 'AccessToken';
const storageRefreshToken = 'RefreshToken';
let accessToken = null;

export const setAccessToken = (tokenString, onlySession) => {
  try {
    if (storage) {
      if (tokenString) {
        if (onlySession) {
          sessionStr.setItem(storageAccessToken, tokenString);
        } else {
          storage.setItem(storageAccessToken, tokenString);
        }
      } else {
        storage.removeItem(storageAccessToken);
        sessionStr.removeItem(storageAccessToken);
      }
      accessToken = tokenString;
    }
  } catch (error) {
    // console.log('services.User.token.setAccessToken() - ', error);
  }
};

export const getAccessToken = () => {
  try {
    if (storage) {
      accessToken = storage.getItem(storageAccessToken);
      return accessToken;
    }
    return null;
  } catch (error) {
    // console.log('services.User.token.getAccessToken() - ', error);
    return error;
  }
};

export function setRefreshToken(refreshToken, onlySession = false) {
  if (storage) {
    if (refreshToken) {
      const infoString = JSON.stringify(refreshToken);
      if (onlySession) {
        sessionStr.setItem(storageRefreshToken, infoString);
      } else {
        storage.setItem(storageRefreshToken, infoString);
      }
    } else {
      storage.removeItem(storageRefreshToken);
      sessionStr.removeItem(storageRefreshToken);
    }
  }
}

export function getRefreshToken() {
  if (storage) {
    const refreshToken = storage.getItem(storageRefreshToken) || {};
    return JSON.parse(refreshToken);
  }
  return null;
}
