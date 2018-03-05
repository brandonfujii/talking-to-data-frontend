import Request from 'api/request';

const uploadArticle = (userId, articleText) => {
  console.log(userId, articleText);
  return Request.post(`/users/${userId}/upload`, {
    body: {
      text: articleText
    }
  });
};

export default uploadArticle;
