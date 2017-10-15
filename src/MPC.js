class MPC {
    commands = {
        play: {
            name: 'Play',
            method: 'play',
            data: {
                wm_command: 887
            }
        },
        toggle: {
            name: 'Play/Pause',
            method: 'toggle',
            data: {
                wm_command: 889
            }
        },
        pause: {
            name: 'Pause',
            method: 'pause',
            data: {
                wm_command: 888
            }
        },
        stop: {
            name: 'Stop',
            method: 'stop',
            data: {
                wm_command: 890
            }
        },
        goto: {
            name: 'Go to',
            method: 'goto',
            data: {
                wm_command: -1,
                position: '00:00:00'
            }
        },
    }

    constructor(host = 'localhost', port = 13543) {
        this.host = host;
        this.port = port;

        Object.keys(this.commands).forEach(c => {
            this[ this.commands[c].method ] = this.command.bind(this, c)
        })
    }

    request({ url, ...rest }) {
        return $.ajax({
            url: `http://${this.host}:${this.port}${url}`,
            ...rest
        })
    }

    variables() {
        return this.request({
            url: '/variables.html'
        }).then((html) => {
            const variables = {};
            $.each($(html).filter('p'), function() {
                const id = $(this).attr('id');
                const val = $(this).text();
                if (id) {
                    variables[id] = val;
                }
            })
            return variables
        })
    }

    command(commandName, data) {
        return this.request({
            url: '/command.html',
            method: 'POST',
            data: {
                ...this.commands[commandName].data,
                ...data
            }
        }).then(() => this.variables())
    }
};

module.exports = MPC;
