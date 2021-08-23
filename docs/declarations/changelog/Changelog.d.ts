 declare enum ChangeLogType {
    DEFAULT = 0,
    UPDATE = 1,
    NEW = 2,
    CHANGE = 3,
    FIXED = 4,
    REMOVED = 5,
    EVENT = 6
}
    display: string;
    label: string;
};
declare class Changelog {
    type: ChangelogConfig;
    description: string;
    constructor(type: ChangelogConfig, description: string);
}