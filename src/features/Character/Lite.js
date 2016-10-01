import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import includes from 'lodash/includes';
import get from 'lodash/get';

import qs from 'lib/qs';
import { leftItems, rightItems } from 'lib/gw2/equipment';

import { fetchCharacter, selectCharacter } from './actions';
import { selector } from './characters.reducer';
import styles from './liteStyles.less';

import Tooltip from 'common/components/Tooltip';
import ContentCard from 'common/components/ContentCard';
import Item from './components/Item';
import Portrait from './components/Portrait';

class CharacterLite extends Component {
  static propTypes = {
    character: PropTypes.object,
    dispatch: PropTypes.func,
    items: PropTypes.object,
    skins: PropTypes.object,
    specializations: PropTypes.object,
    traits: PropTypes.object,
    mode: PropTypes.oneOf(['pve', 'pvp', 'wvw']),
    skills: PropTypes.object,
    routeParams: PropTypes.object,
    location: PropTypes.object,
    amulets: PropTypes.object,
  };

  componentWillMount () {
    this.loadCharacter();
  }

  getItems (ids = []) {
    return ids.map((id) => this.props.items[id]);
  }

  loadCharacter () {
    const name = qs('name');

    this.props.dispatch(fetchCharacter(name));
    this.props.dispatch(selectCharacter(name));
  }

  render () {
    const {
      character,
      items,
      skins,
    } = this.props;

    const equipment = get(character, 'equipment', {});
    const profession = get(character, 'profession');
    const safeCharacter = get(this.props, 'character', {});
    const guild = get(character, 'guild');

    return (
      <div className={styles.root}>
        <div className={styles.cover}><Portrait character={character} /></div>

        <a href={`/${safeCharacter.alias}/c/${safeCharacter.name}`} className={styles.header}>
          <ContentCard content={character} />
        </a>

        <a href={`/g/${guild && guild.name}`}>
          <ContentCard type="guilds" content={guild} className={styles.linkItem} />
        </a>

        <div className={styles.equips}>
          {leftItems.map((item) => {
            const equip = equipment[item.key] || {};

            return (
              <Item
                {...item}
                small
                hide={includes(item.hideForClasses, profession)}
                key={item.key}
                upgradeCounts={equip.upgradeCounts}
                upgrades={this.getItems(equip.upgrades)}
                infusions={this.getItems(equip.infusions)}
                item={items[equip.id]}
                skin={skins[equip.skin]}
                stats={equip.stats}
              />
            );
          })}

          {rightItems.map((item) => {
            const equip = equipment[item.key] || {};

            return (
              <Item
                {...item}
                small
                hide={includes(item.hideForClasses, profession)}
                key={item.key}
                upgradeCounts={equip.upgradeCounts}
                upgrades={this.getItems(equip.upgrades)}
                infusions={this.getItems(equip.infusions)}
                item={items[equip.id]}
                skin={skins[equip.skin]}
                stats={equip.stats}
              />
            );
          })}
        </div>

        <a href="https://gw2armory.com" className={styles.siteLink}>
          gw2armory.com
        </a>

        <Tooltip />
      </div>
    );
  }
}

export default connect(selector)(CharacterLite);
