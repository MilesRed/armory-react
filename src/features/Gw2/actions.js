import upperFirst from 'lodash/upperFirst';

export const SHOW_TOOLTIP = 'SHOW_TOOLTIP';

const actions = {};
export default actions;

export function generateActions (resourceName, getResource, afterGet) {
  const actionNames = {
    fetching: `FETCHING_${resourceName.toUpperCase()}`,
    result: `FETCH_${resourceName.toUpperCase()}_RESULT`,
  };

  const fetchMethodName = `fetch${upperFirst(resourceName)}`;
  const fetchingMethodName = `fetching${upperFirst(resourceName)}`;
  const fetchResultMethodName = `fetch${upperFirst(resourceName)}Result`;

  actions[fetchResultMethodName] = (data) => ({
    type: actionNames.result,
    payload: data,
  });

  actions[fetchingMethodName] = (fetching) => ({
    type: actionNames.fetching,
    payload: fetching,
  });

  actions[fetchMethodName] = (ids) => (dispatch) => {
    if (!ids) {
      return undefined;
    }

    dispatch(actions[fetchingMethodName](true));

    return getResource(ids)
      .then((response) => {
        dispatch(actions[fetchResultMethodName](response));
        dispatch(actions[fetchingMethodName](false));

        return afterGet ? afterGet(dispatch, response) : response;
      });
  };

  return actionNames;
}

export function showTooltip (show, { type, data } = {}) {
  return {
    type: SHOW_TOOLTIP,
    payload: {
      show,
      type,
      data,
    },
  };
}
