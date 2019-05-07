let config = {
    port: 3000,
    auth: {
        client_id: 'dpornco.app',
        redirect_uri: 'https://dporn.co/auth/'
    },
    session: {
        secret: 'localsession'
    }
};

module.exports = config;
