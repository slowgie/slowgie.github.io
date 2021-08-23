import BooleanSetting from '../settings/BooleanSetting';
import NotificationOption from './NotificationOption';
import Sound from '../utilities/Sound';

/**
 * Contains all notification constants for easy access.
 */

const NotificationConstants = {
    NotificationOption,
    NotificationSound: {
        ready_to_hatch: new Sound('ready_to_hatch', 'Egg ready to hatch'),
        empty_queue: new Sound('empty_queue', 'Hatchery queue is empty'),
        shiny_long: new Sound('shiny_long', 'Shiny Pokémon encountered/hatched'),
        new_catch: new Sound('new_catch', 'New Pokémon/shiny captured'),
        achievement: new Sound('achievement', 'New achievement earned'),
        battle_item_timer: new Sound('battle_item_timer', 'Battle item about to wear off'),
        quest_ready_to_complete: new Sound('quest_ready_to_complete', 'Quest is ready to be completed'),
        quest_level_increased: new Sound('quest_level_increased', 'Quest level increased'),
        underground_energy_full: new Sound('underground_energy_full', 'Mining energy reached maximum capacity'),
        ready_to_harvest: new Sound('ready_to_harvest', 'Farm ready to harvest'),
    },
    NotificationSetting: {
        ready_to_hatch: new BooleanSetting('notification.ready_to_hatch', 'Egg ready to hatch', true),
        hatched: new BooleanSetting('notification.hatched', 'Egg hatched', true),
        hatched_shiny: new BooleanSetting('notification.hatched_shiny', 'Egg hatched a shiny', true),
        empty_queue: new BooleanSetting('empty_queue', 'Hatchery queue is empty', true),
        route_item_found: new BooleanSetting('notification.route_item_found', 'Item found during route battle', true),
        dungeon_item_found: new BooleanSetting('notification.dungeon_item_found', 'Item found in dungeon chest', true),
        battle_item_timer: new BooleanSetting('notification.battle_item_timer', 'Battle item about to wear off', true),
        encountered_shiny: new BooleanSetting('notification.encountered_shiny', 'Encountered a shiny Pokémon', true),
        quest_ready_to_complete: new BooleanSetting('notification.quest_ready_to_complete', 'Quest is ready to be completed', true),
        underground_energy_full: new BooleanSetting('notification.underground_energy_full', 'Mining energy reached maximum capacity', true),
        event_start_end: new BooleanSetting('notification.event_start_end', 'Event start/end information', true),
        dropped_item: new BooleanSetting('notification.dropped_item', 'Enemy Pokémon dropped an item', true),
        ready_to_harvest: new BooleanSetting('notification.ready_to_harvest', 'General Farming Notification', true),
        berry_mutated: new BooleanSetting('notification.berry_mutated', 'Berry has mutated', true),
        berry_wither: new BooleanSetting('notification.berry_wither', 'Berry is about to wither', true),
        gym_won: new BooleanSetting('notification.gym_won', 'Gym leader defeated', true),
    },
};

export default NotificationConstants;
