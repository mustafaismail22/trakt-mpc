import axios from 'axios';

const defaultOpt = {
    tvdbApiKey: 'A332E70AFAFD015B',
    tmdbApiKey: 'b728f2c577edbd9c1dbccfbb757d8132'
};

class Images {
    constructor(opt = defaultOpt) {
        this.opt = opt;
        this.tmdbApi = axios.create({
            baseURL: 'https://api.themoviedb.org/3',
            params: {
                api_key: this.opt.tmdbApiKey || ''
            }
        });
    }

    findTmdb(imdb) {
        return this.tmdbApi.get(`/find/${imdb}`, { params: { external_source: 'imdb_id' } })
        .then(res => res.data)
        .then(res => {
            let result = undefined;
            let type = undefined;
            Object.keys(res).forEach(key => {
                if ( res[key].length ) {
                    result = res[key].shift()
                    switch (key) {
                        case 'movie_results':
                            type = 'movie'
                            break;
                        case 'person_results':
                            type = 'person'
                            break;
                        case 'tv_results':
                            type = 'show'
                            break;
                        case 'tv_episode_results':
                            type = 'episode'
                            break;
                    }
                }
            })
            return typeof result === 'object' ? { ...result, type } : undefined;
        })
    }

    getTmdbSeason(tv_id, season_number) {
        return this.tmdbApi.get(`/tv/${tv_id}/season/${season_number}/images`).then(res => res.data)
    }

    getTmdb(imdb) {
        return new Promise(( resolve, reject ) => {
            this.findTmdb(imdb).then(res => {
                console.log(res, imdb)
                if (!res) {
                    return resolve(this.notFound())
                }

                let background = null;
                let poster = null;
                const callback = _ => resolve({
                    poster,
                    background,
                    type: res.type
                })
                
                if (res.type == 'episode') {
                    background = res.still_path
                    return this.getTmdbSeason(res.show_id, res.season_number).then(season => {
                        if (season.posters.length) {
                            poster = season.posters[0].file_path
                        }
                    }).then(callback, callback)
                } else if (res.type == 'show' || res.type == 'movie') {
                    background = res.backdrop_path;
                    poster = res.poster_path;
                } else if (res.type == 'person') {
                    poster = res.profile_path;
                }

                return callback();
            }).catch((err) => {
                console.log(err)
                return resolve(this.notFound())
            })
        }).then(images => {
            const url = 'https://image.tmdb.org/t/p/';
            const bsize = 'w500'; // or w1280
            const psize = 'w342'; // or w780
            return {
                ...images,
                background: images.background ? `${url}${bsize}${images.background}`: null,
                poster: images.poster ? `${url}${psize}${images.poster}`: null
            };
        });
    }

    get(ids) {
        return this.getTmdb(ids.imdb)
    }

    notFound() {
        return Promise.resolve({
            poster: null,
            background: null,
            type: null
        })
    }
}

export default Images;
