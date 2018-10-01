<?php
  require('db.config.php');
  
    
  $templateName = $_POST['template_name'];
  $templateOrientation = $_POST['template_orientation'];
  $templatePages = $_POST['template_pages'];
  $templateContent = serialize($_POST['template_content']);
  $parentId = $_POST['parent_id'];
  $workflowId = $_POST['workflow_id'];
  // $dataCreazione = $_POST['data_creazione'];
  $operatore = $_POST['operatore'];
  // $editorContent = implode("&&",$_POST['editor_content']);

  $sql = "INSERT INTO fl_content_template (workflow_id, parent_id, template_name, template_orientation, template_pages, template_content, operatore, data_creazione)
  VALUES ('$workflowId', '$parentId', '$templateName', '$templateOrientation', '$templatePages', '$templateContent', '$operatore', (now()))";

  if ($result = mysqli_query($conn, $sql)) {
    $id = mysqli_insert_id($conn);
    $sql = "SELECT * FROM fl_content_template WHERE id='$id'";

    if ($result = mysqli_query($conn, $sql)) {
      $json = mysqli_fetch_array($result,MYSQLI_ASSOC);

      echo json_encode($json);
      echo json_encode(unserialize($json['template_content']));

    } else {
      echo "Errore durante l'aggiunta di $templateName. MySQli Error: " . mysqli_error($conn);
    }

  } else {
    echo "Errore durante l'aggiunta di $templateName. MySQli Error: " . mysqli_error($conn);
  }

  mysqli_close($conn);