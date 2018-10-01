<?php
  require('db.config.php');
  
  $templateId = $_POST['template_id'];
  $templateName = $_POST['template_name'];
  $templateOrientation = $_POST['template_orientation'];
  $templatePages = $_POST['template_pages'];
  $templateContent = serialize($_POST['template_content']);
  $parentId = $_POST['parent_id'];
  $workflowId = $_POST['workflow_id'];
  // $dataCreazione = $_POST['data_creazione'];
  $operatore = $_POST['operatore'];
  // $editorContent = implode("&&",$_POST['editor_content']);

  $sql = "UPDATE fl_content_template SET workflow_id='$workflowId', parent_id='$parentId', template_name='$templateName', template_orientation='$templateOrientation', template_pages='$templatePages', template_content='$templateContent', operatore='$operatore', data_aggiornamento=(now())
  WHERE id='$templateId'";

  if ($result = mysqli_query($conn, $sql)) {
    $sql = "SELECT * FROM fl_content_template WHERE id='$templateId'";

    if ($result = mysqli_query($conn, $sql)) {
      $json = mysqli_fetch_assoc($result);

      echo json_encode($json);

    } else {
      echo "Errore durante l'aggiunta di $templateName. MySQli Error: " . mysqli_error($conn);
    }

  } else {
    echo "Errore durante l'aggiunta di $templateName. MySQli Error: " . mysqli_error($conn);
  }

  mysqli_close($conn);