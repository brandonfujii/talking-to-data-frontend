import { uploadArticle } from 'api/';

/* Flags */
export const UPLOADING_ARTICLE = 'article/UPLOADING_ARTICLE';
export const ARTICLE_UPLOAD_SUCCESS = 'article/ARTICLE_UPLOAD_SUCCESS';
export const ARTICLE_UPLOAD_FAILURE = 'article/ARTICLE_UPLOAD_FAILURE';

const initialState = {};

/* Reducer */

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOADING_ARTICLE:
      break;
    case ARTICLE_UPLOAD_SUCCESS:
      break;
    case ARTICLE_UPLOAD_FAILURE:
      break;
    default:
      return state;
  }
};

/* Actions */
export const uploadArticleByUser = (userId, text) => {
  console.log('UPLOAD');
  return async dispatch => {
    console.log('in dispatch');
    dispatch({ type: UPLOADING_ARTICLE });
    uploadArticle(userId, text);

    //console.log(response);
  };
};
