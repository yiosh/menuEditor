<?php
 ini_set('display_errors', 1);
 ini_set('display_startup_errors', 1);
 error_reporting(E_ALL);
 
 // Load content to put in editor
 require_once('db.config.php');
 
  $contentId = check($_GET['content_id']);
  $MenuId = check($_GET['menu_id']);

  // $contents = GQS('fl_editors','*'," content_id= '$contentId' ");
  $contents = menuProvider($MenuId);

  echo $contents;