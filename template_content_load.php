<?php
require('db.config.php');
  $templateId = $_POST['template_id'];
  $sql = "SELECT template_content FROM fl_content_template WHERE id='$templateId'";
  // echo mysqli_num_rows($result);

  if ($result = mysqli_query($conn, $sql)) {
    $json = mysqli_fetch_assoc($result);

    // echo json_encode($json);
    echo json_encode(unserialize($json['template_content']));

  } else {
    echo "Errore durante l'aggiunta di $templateName. MySQli Error: " . mysqli_error($conn);
  }

 