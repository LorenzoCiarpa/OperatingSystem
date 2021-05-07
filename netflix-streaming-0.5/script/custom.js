class Time{
    constructor(time){
        var vec = time.split(":");
        this.hours = parseInt(vec[0]);
        this.minutes = parseInt(vec[1]);
        this.seconds = parseInt(vec[2]);
    }
    toSeconds(){
        return this.hours * 3600 + this.minutes * 60 + this.seconds;
    }
}

//START setPage()
function setPage(json, type){

    var preferiti = getPreferiti();
    console.log(preferiti);

    var slider_html = "";
    var slide_html = "<div class='slides'>";
    var img_html = "<img src=";
    var content_html = "<div class='content'>";
    var h2_html = "<h2>";
    var p_html = "</h2><p>";
    var a_html = "</p><a href=";
    var i_play_html = "<i class='fa fa-play' aria-hidden='true'></i>Guarda</a>";
    var i_add_html = "<button type='button' onclick='changePreferenza(this)' name='";
    var end_slide_html = "<i class='fa fa-plus'></i><span>Aggiungi ai preferiti</span></button></div></div>";

    var colon_html = "";
    var colonna_html;

    var container_html = "<div class='container'>";
    var riga_html = "<div class='riga'>"

    if(type == "categoria"){
        var h2_riga_html = "<h2>FILM " + json.film[0].categoria + "</h2>";
    }else if(type == "preferiti"){
        var h2_riga_html = "<h2>LA MIA LISTA</h2>";
    }else if(type == "keep"){
        var h2_riga_html = "<h2>CONTINUA A GUARDARE</h2>";
    }else if(type == "again"){
        var h2_riga_html = "<h2>GUARDA DI NUOVO</h2>";
    }else if(type == "film"){
        var h2_riga_html = "<h2>FILM</h2>";
    }

    var nav_html = "<div class='nav'>";
    var nav_bar_html = "<div class='nav-bar'>";

    riga_html += h2_riga_html + nav_html + nav_bar_html;

    var cast;

    $.each( json.film, function( i, film ) {

            cast = getCast(film.titolo);

            img_html += "'" + film.anteprima + "'>";
            h2_html += film.titolo;
            p_html += film.descrizione + "<br>" + "Attori: " + cast[1] + ", " + cast[2] + ", " + cast[3] +
                        "<br>" + "Regista: " + cast[0];


            a_html += "'vid.html?video=" + film.video + "&titolo=" + film.titolo + "&time=" + film.minutaggio + "'>";

            i_add_html += film.titolo + "'>";

            for(elem of preferiti){
                if(film.titolo == elem){
                    end_slide_html = "<i class='fa fa-check'></i><span>Salvato</span></button></div></div>";
                }
            }


            slider_html += slide_html + img_html + content_html + h2_html + p_html + a_html + i_play_html
                        + i_add_html + end_slide_html;

            if(i==0){
                colonna_html = "<div class='colonna active'>";
            }else{
                colonna_html = "<div class='colonna'>";
            }
            colon_html += colonna_html + img_html + "</div>";

            img_html = "<img src=";
            h2_html = "<h2>";
            p_html = "</h2><p>";
            a_html = "</p><a href=";
            i_add_html = "<button type='button' onclick='changePreferenza(this)' name='";
            end_slide_html = "<i class='fa fa-plus'></i><span>Aggiungi ai preferiti</span></button></div></div>";

        });

        container_html += slider_html + "</div>";
        riga_html += colon_html + "</div></div><div class='prev'> < </div>  <div class='next'> > </div></div>";
        final_html = container_html + riga_html;
        var section = document.getElementById("section");
        section.innerHTML = final_html;
        setSlider();

}//END setPage

//START getCast
function getCast(titolo){
    var cast = [];

    $.ajax({
        url: "php/query.php",
        dataType: 'json',
        async: false,
        data: { command: 'getCast', titolo: titolo },
        success: function(json){
            var nome = json.film[0].nomeregista + " " + json.film[0].cognomeregista;
            cast.push(nome);

            $.each( json.film, function( i, film ) {
                nome = film.nomeattore + " " + film.cognomeattore;
                cast.push(nome);

            });

        }
    });

    // $.getJSON( "php/query.php", { command: 'getCast', titolo: titolo }, function( json ) {
    //     var nome = json.film[0].nomeregista + " " + json.film[0].cognomeregista;
    //     cast.push(nome);
    //
    //     $.each( json.film, function( i, film ) {
    //         nome = film.nomeattore + " " + film.cognomeattore;
    //         cast.push(nome);
    //
    //     });
    //
    // });
    return cast;
}
//END getCast

//START setSlider
function setSlider(){
    const slides = document.querySelectorAll('.slides');
    const dots = document.querySelectorAll('.colonna');
    let slideIndex = 0;
    showSlide();
    function showSlide(n){
        if(slideIndex > slides.length - 1){
            slideIndex = 0;
        }
        if(slideIndex < 0){
            slideIndex = slides.length - 1;
        }
        for(let i=0; i<slides.length; i++){
            slides[i].style.display = "none";
        }
        for(let i=0; i<dots.length; i++){
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex].style.display = "block";
        dots[slideIndex].className += " active";
    }
    dots.forEach((item, index) =>{
        item.addEventListener('click', ()=>{
            showSlide(slideIndex = index);
        })
    });

    const nav = document.querySelector('.nav');
    const prev = document.querySelector('.prev');
    const next = document.querySelector('.next');
    next.addEventListener('click', ()=>{
        nav.scrollLeft += dots[0].offsetWidth;
        showSlide(slideIndex += 1);
        if(slideIndex === 0){
            nav.scrollLeft = 0;
        }
    })
    prev.addEventListener('click', ()=>{
        nav.scrollLeft -= dots[0].offsetWidth;
        showSlide(slideIndex -= 1);
        if(slideIndex === slides.length - 1){
            nav.scrollLeft = nav.scrollWidth;
        }
    })
}//END setSlider

//START addPreferiti
function addPreferiti(titolo){
    $.ajax({
        url: "php/query.php",
        data: { command: 'addPreferiti', titolo: titolo },
        success: function(data){

        }
    });
}//END addPreferiti

//START deletePreferiti
function deletePreferiti(titolo){
    $.ajax({
        url: "php/query.php",
        data: { command: 'deletePreferiti', titolo: titolo },
        success: function(data){
            //getPreferiti();

        }
    });
}//END deletePreferiti

//START getPreferiti
function getPreferiti(){
    var result=[];
    $.ajax({
        url: "php/query.php",
        dataType: 'json',
        async: false,
        data: { command: 'getPreferiti' },
        success: function(json){


            $.each(json.film, function(i, film){
                result.push(film.titolo);
            });

        }
    });
    return result;
}//END getPreferiti


//START setPreferiti
function setPreferiti(){

    $.getJSON( "php/query.php", { command: 'getPreferiti' }, function( json ) {
        setPage(json,"preferiti");
    });
}//END setPreferiti


//START getCategory
function getCategory(categoria){

    $.getJSON( "php/query.php", { command: 'getCategory', categoria: categoria }, function( json ) {
        setPage(json,"categoria");
    });
}//END getCategory

//START getFilm
function getFilm(titolo){

    $.getJSON( "php/query.php", { command: 'getFilm', titolo: titolo }, function( json ) {
        setPage(json,"film");
    });
}//END getFilm

//START getKeepFilm
function getKeepFilm(){

    $.getJSON( "php/query.php", { command: 'getKeepFilm' }, function( json ) {
        setPage(json,"keep");
    });
}//END getKeepFilm

//START getAgainFilm
function getAgainFilm(){

    $.getJSON( "php/query.php", { command: 'getAgainFilm' }, function( json ) {
        setPage(json,"again");
    });
}//END getAgainFilm

//START updateTime
function updateTime(titolo, time){
    $.ajax({
        url: "php/query.php",
        data: { command: 'updateTime', titolo: titolo, time: time },
        success: function(data){

        }
    });
}//END updateTime

//START changePreferenza
function changePreferenza(el){
    var i_html = el.children[0];
    var span = el.children[1];

    if(span.innerHTML == "Salvato"){
        i_html.setAttribute("class","fa fa-plus");
        span.innerHTML = "Aggiungi ai preferiti";
        deletePreferiti(el.name);
    }else{
        i_html.setAttribute("class","fa fa-check");
        span.innerHTML = "Salvato";
        addPreferiti(el.name);
    }

}//END changePreferenza

//START setSearch
function setSearch(el){
    var searchText = el.value;
    console.log(searchText);

    if (searchText != "") {
      $.ajax({
        url: "php/query.php",
        dataType: 'json',
        data: { command: 'setSearch', query: searchText },
        success: function (json) {
            setPage(json,"film");

        }
      });
    } else {
      // $("#show-list").html("");
    }
}//END setSearch



//START getPreferiti
// function getPreferiti(){
//     $.ajax({
//         url: "php/query.php",
//         dataType: 'json',
//         async: false,
//         data: { command: 'get' },
//         success: function(json){
//             console.log(json);
//         }
//     });
// }//END getPreferiti



// function getCategory(categoria){
// var container_html = "<div class='container'>";
// var riga_html = "<div class='riga'>"
// var h2_html = "<h2>FILM " + categoria + "</h2>";
// var nav_html = "<div class='nav'>";
// var nav_bar_html = "<div class='nav-bar'>";
//
// riga_html += h2_html + nav_html + nav_bar_html;
// var res;
//     $.getJSON( "php/query.php", { command: 'getCategory', categoria: categoria }, function( json ) {
//         console.log(json);
//
//         $.each( json.films, function( i, film ) {
//             res = getFilm(film.titolo);
//             console.log(res);
//             container_html += res[0];
//             riga_html += res[1];
//
//             // var user_html =
//             //             "<img " + "id='" + film.titolo + "'" + "src='" + film.anteprima + "'>";
//             //
//             // $("#prova").append( user_html );
//
//
//         });
//         container_html += "</div>";
//         riga_html += "</div></div><div class='prev'> < </div>  <div class='next'> > </div></div>";
//
//     });
//
// }
//END getCategory


//START getPeferiti
// function getPreferiti(){
//     var slider_html = "";
//     var slide_html = "<div class='slides'>";
//     var img_html = "<img src=";
//     var content_html = "<div class='content'>";
//     var h2_html = "<h2>";
//     var p_html = "</h2><p>";
//     var a_html = "</p><a href=";
//     var i_html = "<i class='fa fa-play' aria-hidden='true'></i>Guarda</a></div></div>";
//
//     var colon_html = "";
//     var colonna_html;
//
//     var container_html = "<div class='container'>";
//     var riga_html = "<div class='riga'>"
//     var h2_riga_html = "<h2>LA MIA LISTA</h2>";
//     var nav_html = "<div class='nav'>";
//     var nav_bar_html = "<div class='nav-bar'>";
//
//     riga_html += h2_riga_html + nav_html + nav_bar_html;
//
//     var cast;
//
//
//
//     $.getJSON( "php/query.php", { command: 'getPreferiti' }, function( json ) {
//         $.each( json.film, function( i, film ) {
//             cast = getCast(film.titolo);
//
//             img_html += "'" + film.anteprima + "'>";
//             h2_html += film.titolo;
//             p_html += film.descrizione + "<br>" + "Attori: " + cast[1] + ", " + cast[2] + ", " + cast[3] +
//                         "<br>" + "Regista: " + cast[0];
//
//
//
//             a_html += "'vid.html?titolo=" + film.video + "'>";
//
//             slider_html += slide_html + img_html + content_html + h2_html + p_html + a_html + i_html;
//
//             if(i==0){
//                 colonna_html = "<div class='colonna active'>";
//             }else{
//                 colonna_html = "<div class='colonna'>";
//             }
//             colon_html += colonna_html + img_html + "</div>";
//
//             img_html = "<img src=";
//             h2_html = "<h2>";
//             p_html = "</h2><p>";
//             a_html = "</p><a href=";
//
//         });
//
//         container_html += slider_html + "</div>";
//         riga_html += colon_html + "</div></div><div class='prev'> < </div>  <div class='next'> > </div></div>";
//         final_html = container_html + riga_html;
//         var section = document.getElementById("section");
//         section.innerHTML = final_html;
//         setSlider();
//
//     });
// }
//END getPreferiti

//START getFilm
// function getFilm(categoria){
//     console.log(categoria);
//     var slider_html = "";
//     var slide_html = "<div class='slides'>";
//     var img_html = "<img src=";
//     var content_html = "<div class='content'>";
//     var h2_html = "<h2>";
//     var p_html = "</h2><p>";
//     var a_html = "</p><a href=";
//     var i_html = "<i class='fa fa-play' aria-hidden='true'></i>Guarda</a></div></div>";
//
//     var colon_html = "";
//     var colonna_html;
//
//     var container_html = "<div class='container'>";
//     var riga_html = "<div class='riga'>"
//     var h2_riga_html = "<h2>FILM " + categoria + "</h2>";
//     var nav_html = "<div class='nav'>";
//     var nav_bar_html = "<div class='nav-bar'>";
//
//     riga_html += h2_riga_html + nav_html + nav_bar_html;
//
//     var cast;
//
//
//
//     $.getJSON( "php/query.php", { command: 'getFilm', categoria: categoria }, function( json ) {
//         $.each( json.film, function( i, film ) {
//
//             cast = getCast(film.titolo);
//
//             img_html += "'" + film.anteprima + "'>";
//             h2_html += film.titolo;
//             p_html += film.descrizione + "<br>" + "Attori: " + cast[1] + ", " + cast[2] + ", " + cast[3] +
//                         "<br>" + "Regista: " + cast[0];
//
//
//
//             a_html += "'vid.html?titolo=" + film.video + "'>";
//
//             slider_html += slide_html + img_html + content_html + h2_html + p_html + a_html + i_html;
//
//             if(i==0){
//                 colonna_html = "<div class='colonna active'>";
//             }else{
//                 colonna_html = "<div class='colonna'>";
//             }
//             colon_html += colonna_html + img_html + "</div>";
//
//             img_html = "<img src=";
//             h2_html = "<h2>";
//             p_html = "</h2><p>";
//             a_html = "</p><a href=";
//
//         });
//
//         container_html += slider_html + "</div>";
//         riga_html += colon_html + "</div></div><div class='prev'> < </div>  <div class='next'> > </div></div>";
//         final_html = container_html + riga_html;
//         var section = document.getElementById("section");
//         section.innerHTML = final_html;
//         setSlider();
//
//
//     });
// }
//END getFilm
