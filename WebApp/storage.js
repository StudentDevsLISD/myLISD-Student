// storage.js

export const storeData = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };
  
  export const retrieveData = (key) => {
    try {
      const value = localStorage.getItem(key);
      return JSON.parse(value);
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  export const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("An error occurred while removing the item from local storage:", error);
      return false;
    }
  };
  