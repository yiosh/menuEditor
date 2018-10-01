<?php
require('db.config.php');
  $templateId = $_POST['template_id'];
  $sql = "SELECT * FROM fl_content_template WHERE id='$templateId'";
  $result = mysqli_query($conn, $sql);
  // echo mysqli_num_rows($result);
  if ($result = mysqli_query($conn, $sql)) {
    if (mysqli_num_rows($result)) {
      echo json_encode(mysqli_fetch_assoc($result)); 
    } else {
      echo "No match";
    }
  } else {
    echo "MySQli Error: " . mysqli_error($conn);
  }

  