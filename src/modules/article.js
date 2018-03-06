import { uploadArticle } from 'api/';

/* Flags */
export const UPLOADING_ARTICLE = 'article/UPLOADING_ARTICLE';
export const ARTICLE_UPLOAD_SUCCESS = 'article/ARTICLE_UPLOAD_SUCCESS';
export const ARTICLE_UPLOAD_FAILURE = 'article/ARTICLE_UPLOAD_FAILURE';

const initialState = {};

/* Reducer */
export default (state = initialState, action) => {
  switch (action.type) {
    case ARTICLE_UPLOAD_SUCCESS:
      return {
        ...state,
        article: action.article,
        claims: action.claims
      };
      break;
    case ARTICLE_UPLOAD_FAILURE:
      // TODO: handle errors
      return state;
      break;
    default:
      return state;
  }
};

/* Actions */
export const uploadArticleByUser = (userId, text) => {
  return async dispatch => {
    dispatch({ type: UPLOADING_ARTICLE });
    const response = await uploadArticle(userId, text);

    if (response) {
      dispatch({
        type: ARTICLE_UPLOAD_SUCCESS,
        article: response.article,
        claims: response.claims
      });
    } else {
      dispatch({
        type: ARTICLE_UPLOAD_FAILURE
      });
    }
  };
};
