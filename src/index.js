const Trakt = require('trakt.tv');
const config = require('../config.json');
const MPC = require('./MPC');
const mpc = new MPC();

const trakt = new Trakt({
    client_id: config.trakt.client_id,
    plugins: {
        matcher: require('trakt.tv-matcher'),
        images: require('trakt.tv-images')
    }
});

mpc
    .variables()
    .then(v => {
        console.log(v),
        $('#root').html(JSON.stringify(v))
    })
    .then(() => mpc.play())
