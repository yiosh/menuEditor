<?php
  // $directory = "http://$_SERVER[HTTP_HOST]/";
  $directory = "../../fl_config/".$_GET['host']."/img/";
  $jpgImages = glob($directory . "*.jpg");
  $pngImages = glob($directory . "*.png");

  $imageList = array();
  
  foreach($jpgImages as $imagepng) {
    array_push($imageList, $imagepng);
  }

  foreach($pngImages as $imagejpg) {
    array_push($imageList, $imagejpg);
  }
  echo json_encode($imageList);