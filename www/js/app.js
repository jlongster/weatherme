
// The code below uses require.js, a module system for javscript:
// http://requirejs.org/docs/api.html#define

require.config({ 
    baseUrl: 'js/lib',
    paths: {'jquery':
            ['//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
             'jquery']},

});


// When you write javascript in separate files, list them as
// dependencies along with jquery
define("app", function(require) {
    var $ = require('jquery');

    require('bootstrap/tab');

    function fetchForecast(woeid) {
        var query = escape('select item from weather.forecast where woeid="' + woeid + '"');
        var url = ("http://query.yahooapis.com/v1/public/yql?q=" +
                   query +
                   "&format=json&callback=?");

        $.getJSON(url, function(data) {
            var item = data.query.results.channel.item;
            var forecast = item.forecast;

            $('h2.name').text(item.title);

            for(var i=0; i<forecast.length; i++) {
                var el = $('.day' + (i+1));

                el.find('.high span').text(forecast[i].high);
                el.find('.low span').text(forecast[i].low);
            }

            $('.nav-tabs a:first').tab('show');
        });
    }

    fetchForecast(localStorage.placeWoeid || '2480894');

    $('.nav-tabs a').click(function(e) {
        $(this).tab('show');
    });

    $('#settings button.save').click(function(e) {
        var place = $('#settings input[name=place]').val();
        var query = "places.q('" + escape(place) + "')";
        var url = ('http://where.yahooapis.com/v1/' + query +
                   "?appid=Zz.TvXLV34Go6RzyHMnH6scOSn_DdLYdyuJVbd6l2MLvuTAAEFIylCIj7Koo_pth7BHeGmNV5m0zdAkAY_CspQ9eKlJRlmM-&format=json&callback=?");
        
        $.getJSON(url, function(data) {
            if(data.count !== 0) {
                var p = data.places.place[0];
                localStorage.placeWoeid = p.woeid;

                fetchForecast(p.woeid);
            }
        });
    });



});
