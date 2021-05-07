<?php
    include "connection.php";
    include "query_functions.php";

    $mysqli = dbConnection();

    $command = $_GET['command'];
    //$command = 'getCategory';
    //$command = "getFilm";
    //$command = "getCast";
    //$command = "addPreferiti";
    //$command = "getPreferiti";

    switch($command){

        case 'getFilm':
        echo getFilm($mysqli, $_GET['titolo']);
        //echo getCategory($mysqli, 'azione');
        break;

        case 'getCategory':
        echo getCategory($mysqli, $_GET['categoria']);
        //echo getFilm($mysqli, 'need for speed');
        break;

        case 'getCast':
        echo getCast($mysqli, $_GET['titolo']);
        //echo getCast($mysqli, 'need for speed');
        break;

        case 'addPreferiti':
        echo addPreferiti($mysqli, $_GET['titolo']);
        //echo addPreferiti($mysqli, 'hannibal');
        break;

        case 'getPreferiti':
        echo getPreferiti($mysqli);
        break;

        case 'deletePreferiti':
        echo deletePreferiti($mysqli, $_GET['titolo']);
        break;

        case 'getKeepFilm':
        echo getKeepFilm($mysqli);
        break;

        case 'getAgainFilm':
        echo getAgainFilm($mysqli);
        break;

        case 'updateTime':
        echo updateTime($mysqli, $_GET['titolo'], $_GET['time']);
        break;

        case 'setSearch':
        echo setSearch($mysqli, $_GET['query']);
        break;


        default:
            break;
    }

?>
