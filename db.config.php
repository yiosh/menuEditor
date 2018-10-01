<?php
  // $db_host = "localhost";
  // $db_user = "root";
  // $db_pass = "";
  // $db_name = "banquet_lacavallerizza";

  require_once('../../fl_core/autentication.php');

  $conn = $GLOBALS['connect'];

  /* Check connection */
  if (mysqli_connect_errno()) {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }