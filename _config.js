module.exports = {
    CNAME: false,                                                               // optional (false) - GitHub pages custom domain
    GOOGLE_ANALYTICS_INIT: (() => process.env.NODE_ENV == 'production')(),      // optional (false) - Google Analytics enabled
    GOOGLE_ANALYTICS_ID: false,                                                 // optional (false) - Google Analytics tracking ID
    DEV_BANNER: (() => process.env.HEROKU)(),                                   // optional (false) - If the development banner should be shown
    DISCORD_LOGIN_PROXY: false,                                                 // optional (false) - Discord login proxy link (example: https://gist.github.com/RedSparr0w/69304dce27cccf2ac4a1fe65f7da1836)
    FEATURE_FLAGS: {                                                            // optional - Toggle feature flags for development
        preloadUnreleasedTowns: (() => process.env.NODE_ENV != 'production')(), // optional (false) - Enable preloading images for unreleased towns
    },
};
