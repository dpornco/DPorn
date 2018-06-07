let config = {
    port: 3000,
    auth: {
        client_id: 'dpornco.app',
        redirect_uri: 'http://localhost:3000/auth/'
    },
    session: {
        secret: 'localsession'
    }
};

module.exports = config;
