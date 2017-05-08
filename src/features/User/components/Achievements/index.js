// @flow

import type { AchievementGroups, AchievementCategories, Achievements } from 'flowTypes';

import { Component } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import { createSelector } from 'reselect';
import T from 'i18n-react';

import actions from 'features/Gw2/actions';
import Container from 'common/components/Container';
import Group from './Group';
import Achievement from './Achievement';
import Textbox from 'common/components/Textbox';
import styles from './styles.less';

export const selector = createSelector(
  (state) => (state.users.data[state.users.selected] || []).achievements,
  (state) => state.achievements,
  (state) => state.achievementGroups,
  (state) => state.achievementCategories,
  (userAchievements, achievements, groups, categories) => ({
    userAchievements,
    achievements,
    groups,
    categories,
  })
);

type Props = {
  fetchAchievementGroups: () => void,
  fetchAchievementCategories: () => void,
  fetchAchievements: (Array<number>) => void,
  groups: AchievementGroups,
  categories: AchievementCategories,
  achievements: Achievements,
};

type State = {
  selectedCategory: number,
  selectedGroup: ?string,
};

export default connect(selector, {
  fetchAchievementGroups: actions.fetchAchievementGroups,
  fetchAchievementCategories: actions.fetchAchievementCategories,
  fetchAchievements: actions.fetchAchievements,
})(
class UserAchievements extends Component {
  props: Props;
  state: State = {
    selectedCategory: 1,
    selectedGroup: null,
  };

  componentWillMount () {
    this.props.fetchAchievementGroups('4E6A6CE7-B131-40BB-81A3-235CDBACDAA9');
    this.props.fetchAchievementCategories(1);
  }

  selectCategory (id) {
    const { categories } = this.props;

    this.props.fetchAchievements(categories[id].achievements);
  }

  selectGroup (id) {
    console.log('selecting:', id);
    this.setState({
      selectedGroup: id,
    });
  }

  render () {
    const { groups, achievements, categories } = this.props;
    const { selectedCategory, selectedGroup } = this.state;
    const category = categories[selectedCategory];

    const orderedGroups = map(groups, (value) => (value.id ? value : null))
      .filter(Boolean)
      .sort(({ order: a }, { order: b }) => (a - b));

    console.log(selectedGroup);

    return (
      <Container className={styles.root}>
        <div className={styles.groups}>
          <Textbox
            id="achievements-filter"
            label={`${T.translate('search.name')}...`}
          />

          <ol>
            {orderedGroups.map((group) =>
              <li key={group.id}>
                <Group
                  categoryData={categories}
                  onClick={() => this.selectGroup(group.id)}
                  selected={selectedGroup === group.id}
                  {...group}
                />
              </li>)}
          </ol>
        </div>

        <ol className={styles.achievements}>
          {categories[selectedCategory].achievements.map((id) =>
            <li key={id}>
              <Achievement icon={category.icon} achievement={achievements[id]} current={0} />
            </li>)}
        </ol>
      </Container>
    );
  }
}
);
