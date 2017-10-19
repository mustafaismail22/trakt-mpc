import './style.scss';
import Trakt from 'trakt.tv';
import config from '../config.json';
import MPC from './MPC';
import Images from './images';

const mpc = new MPC();
const images = new Images({
    tvdbApiKey: 'A332E70AFAFD015B',
    tmdbApiKey: 'b728f2c577edbd9c1dbccfbb757d8132'
});

const trakt = new Trakt({
    client_id: config.trakt.client_id,
    client_secret: config.trakt.client_secret,
    plugins: {
        matcher: require('trakt.tv-matcher')
    }
}, false);

function getImages(data) {
    return images.get({
        ...data[data.type].ids,
        // tvdb: data[data.type].ids.tvdb,
        // imdb: data[data.type].ids.imdb,
        type: data.type 
    })
}

function buildEpisode (data) {
    console.log(data)
    if ( !data.type ) {
        return;
    }
    
    const $header = $('#header');
    const $cover = $header.find('.cover');
    const $showTitle = $header.find('.show-title');
    const $movieTitle = $header.find('.movie-title');
    const $episodeTitle = $header.find('.episode-title');
    const $poster = $('.poster');
    const $overview = $('.overview p');

    if ( data.type == 'movie' ) {
        $movieTitle.show();
        // $showTitle.show();
        $movieTitle.find('.title').text(data.movie.title)
        $movieTitle.find('.year').text(data.movie.year)
        // $showTitle.find('.title').text(data.movie.tagline);
        $overview.text(data.movie.overview)
    } else {
        $showTitle.show();
        $episodeTitle.show();
        $showTitle.find('.title').text(data.show.title)
        $showTitle.find('.season').text(`Season ${data.episode.season}`)
        $episodeTitle.find('.episode').text(`${data.episode.season}x${data.episode.number}`)
        $episodeTitle.find('.title').text(data.episode.title)
        $overview.text(data.episode.overview)
    }

    getImages(data).then(urls => {
        $poster.find('img').attr('src', urls.poster)
        $cover.css('backgroundImage', `url('${urls.background}')`)
    });
}

mpc.variables().then(videodetails => {
    return trakt.matcher.match({
        filename: videodetails.file
    })
}).then(buildEpisode)