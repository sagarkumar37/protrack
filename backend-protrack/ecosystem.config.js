module.exports = [{
    name: 'quick-api',
    script: 'index.js',
    error_file: 'log/err.log',
    out_file: 'log/out.log',
    log_file: 'log/combined.log',
    time: true,
    instances: 1,
    autorestart: true,
    watch: false,
    log_date_format: "YYYY-MM-DD HH:mm Z",
    // env_uat : {
    //     "env": "uat",
    //   },
    //   env_prod : {
    //     "env": "prod",
    //   }
}];
