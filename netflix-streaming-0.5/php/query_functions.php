<?php

//START getFilm
function getFilm($mysqli, $titolo) {

    $query = "SELECT f.categoria, f.titolo, f.video, f.anteprima, f.durata, f.descrizione, f.annopubblicazione, f.minutaggio
              FROM film f
              WHERE f.titolo='$titolo'";

    $json_film = '{ "film" : [';

    $counter = 0;

    if ($result = $mysqli->query($query)) {

        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

            $json_film .= json_encode($row);

            $counter++;

            if($counter != mysqli_num_rows($result)){
                $json_film .= ",";
            }

        }

        $json_film .= "]}";

    }

    return $json_film;

}//END getFilm


//START getCategory
function getCategory($mysqli, $categoria) {

    $query = "SELECT f.categoria, f.titolo, f.video, f.anteprima, f.durata, f.descrizione, f.annopubblicazione, f.minutaggio
              FROM film f
              WHERE f.categoria='$categoria'";

    $json_film = '{ "film" : [';

    $counter = 0;

    if ($result = $mysqli->query($query)) {

        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

            $json_film .= json_encode($row);

            $counter++;

            if($counter != mysqli_num_rows($result)){
                $json_film .= ",";
            }

        }

        $json_film .= "]}";

    }

    return $json_film;

}//END getCategory


//START getCast
function getCast($mysqli, $titolo) {

    $query = "SELECT a.nome as nomeattore,
                     a.cognome as cognomeattore, r.nome as nomeregista, r.cognome as cognomeregista
              FROM film f, attore a, regista r, cast c
              WHERE c.attore_id = a.id and
                    c.film_id = f.id and
                    c.regista_id = r.id and
                    f.titolo='$titolo'";

    $json_film = '{ "film" : [';

    $counter = 0;

    if ($result = $mysqli->query($query)) {

        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

            $json_film .= json_encode($row);

            $counter++;

            if($counter != mysqli_num_rows($result)){
                $json_film .= ",";
            }

        }

        $json_film .= "]}";

    }

    return $json_film;

}//END getCast


//START addPreferiti
function addPreferiti($mysqli, $titolo) {

    $query = "SELECT id
              from film
              where titolo = '$titolo'";

    $result = $mysqli->query($query);

    $row = $result->fetch_array();

    $query = "INSERT INTO preferito (film_id) VALUES ('$row[0]')";
    $result = $mysqli->query($query);
    return $mysqli->insert_id;

}//END addPreferiti

//START getPreferiti
function getPreferiti($mysqli) {

      $query = "SELECT f.titolo, f.anteprima, f.descrizione, f.video, f.durata, f.categoria, f.annopubblicazione, f.minutaggio
              from film f, preferito p
              where f.id = p.film_id";

      $json_film = '{ "film" : [';

      $counter = 0;

      if ($result = $mysqli->query($query)) {

          while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

              $json_film .= json_encode($row);

              $counter++;

              if($counter != mysqli_num_rows($result)){
                  $json_film .= ",";
              }

          }

          $json_film .= "]}";

      }

      return $json_film;

}//END getPreferiti

//START deletePreferiti
function deletePreferiti($mysqli, $titolo) {

    $query = "SELECT id
              from film
              where titolo = '$titolo'";

    $result = $mysqli->query($query);

    $row = $result->fetch_array();

    $query = "DELETE FROM preferito WHERE preferito.film_id = '$row[0]'";
    $result = $mysqli->query($query);
    return $result;

}//END deletePreferiti

//START getKeepFilm
function getKeepFilm($mysqli) {

      $query = "SELECT f.titolo, f.anteprima, f.descrizione, f.video, f.durata, f.categoria, f.annopubblicazione, f.minutaggio
              from film f
              where f.minutaggio != f.durata
              and f.minutaggio !='00:00:00'";

      $json_film = '{ "film" : [';

      $counter = 0;

      if ($result = $mysqli->query($query)) {

          while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

              $json_film .= json_encode($row);

              $counter++;

              if($counter != mysqli_num_rows($result)){
                  $json_film .= ",";
              }

          }

          $json_film .= "]}";

      }

      return $json_film;

}//END getKeepFilm

//START getAgainFilm
function getAgainFilm($mysqli) {

      $query = "SELECT f.titolo, f.anteprima, f.descrizione, f.video, f.durata, f.categoria, f.annopubblicazione, f.minutaggio
              from film f
              where f.minutaggio = f.durata";

      $json_film = '{ "film" : [';

      $counter = 0;

      if ($result = $mysqli->query($query)) {

          while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

              $json_film .= json_encode($row);

              $counter++;

              if($counter != mysqli_num_rows($result)){
                  $json_film .= ",";
              }

          }

          $json_film .= "]}";

      }

      return $json_film;

}//END getAgainFilm

//START updateTime
function updateTime($mysqli, $titolo, $time) {

    $query = "UPDATE film SET minutaggio = '$time' WHERE film.titolo = '$titolo'";

    $result = $mysqli->query($query);
    return $mysqli->insert_id;

}//END updateTime

//START setSearch
function setSearch($mysqli, $query) {

    $query = "SELECT f.titolo, f.anteprima, f.descrizione, f.video, f.durata, f.categoria, f.annopubblicazione, f.minutaggio
              FROM film f
              WHERE f.titolo LIKE '%$query%'";

    $json_film = '{ "film" : [';

    $counter = 0;

    if ($result = $mysqli->query($query)) {

        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {

            $json_film .= json_encode($row);

            $counter++;

            if($counter != mysqli_num_rows($result)){
                $json_film .= ",";
            }

        }

        $json_film .= "]}";

    }

    return $json_film;
}//END setSearch

 ?>
