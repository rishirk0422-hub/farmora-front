export const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300";
  
    const baseURL =
      process.env.REACT_APP_SOCKET_URL;

      console.log('====================================');
      console.log(`${baseURL}/${path}`);
      console.log('====================================');
  
    return `${baseURL}/${path}`;
  };