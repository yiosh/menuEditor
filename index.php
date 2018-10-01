<?php 

session_start();
header('Content-Type: text/html; charset=UTF-8');
ini_set('default_charset', 'utf-8');
$historyBack = 1;


require_once("../../fl_core/core.php"); 

?>

<!DOCTYPE html>
<html lang="en">

<head>
 <!-- Smarthphone -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="icon" href="<?php echo ROOT.$cp_admin.$cp_set; ?>css/lay/a.ico" type="image/x-icon" /> 
<link rel="shortcut icon" href="<?php echo ROOT.$cp_admin.$cp_set; ?>css/lay/a.ico" type="image/x-icon" />
<link rel="apple-touch-icon" href="<?php echo ROOT.$cp_admin.$cp_set; ?>lay/a.png" />




<script src="<?php echo ROOT.$cp_admin.$cp_set; ?>jsc/jquery-1.8.3.js" type="text/javascript"></script>
<script src="<?php echo ROOT.$cp_admin.$cp_set; ?>jsc/jquery-ui.js" type="text/javascript"></script>

  
<script defer src="includes/fontawesome-all.min.js"></script>
<script src="includes/tinymce/tinymce.min.js"></script>
<script src="includes/toastr.min.js"></script>
<script src="js/index.js"></script>
<link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300|Oswald|Oxygen|Roboto|Ubuntu" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Cinzel|Cormorant+Garamond|Libre+Baskerville|Lora|Playfair+Display+SC" rel="stylesheet">
<link rel="stylesheet" href="css/toastr.min.css">
<link rel="stylesheet" href="css/style.css">
<title>Menù Editor 1.0 - Beta </title>

<style type="text/css" media="all">


/* editor-container { line-height: 1.3 !important; } */

</style>

</head>


<body>



<?php include("../../fl_inc/testata_mobile.php"); ?>

  <div id="wrapper">
    <div id="template" style="display:none;">
      <h2>Scegli un modello</h2>
      <ul class="template-list">
        <li id="Hor" class="template-option">Orizzontale</li>
        <li id="Hor2" class="template-option">Orizzontalex2</li>
        <li id="Hor3" class="template-option">Orizzontalex3</li>
      </ul>
      <ul class="template-list">
        <li id="Ver" class="template-option">Verticale</li>
        <li id="Ver2" class="template-option">Verticalex2</li>
      </ul>

    </div>

    <div id="page-form" style="display:none;">
      <form id="page-form-items" action="" method="post" style="display:none;">
        <label for="pageNumber"><h2>Quante pagine vuoi?</h2></label>
        <input type="number" name="" id="pageNumber" value="1">

        <button id="submit" type="button" class="button">Invia</button>
      </form>
    </div>

    <div id="container">
      <div id="header">

      </div>

      <div id="buttons-container">
        <button type="button" id="previous">
          <i id="prev" class="hidden-print fas fa-arrow-circle-left"></i>
        </button>
        <form method="post">
          <div id="root">
            <ul id="editor-container">

            </ul>
          </div>
        </form>

        <button type="button" id="next">
          <i id="nxt" class="hidden-print fas fa-arrow-circle-right"></i>
        </button>

      </div>

      <!-- <div class="footer-container"> -->
        <div id="footer">
        <div class="left-footer">
          <div>
            <input class="input" type="text" value="1/1" name="" id="page-counter" class="hidden-print">
            <label for="page-counter">Pagine</label>
          </div>
          <div>
            <input class="input" type="text" value="5" name="" id="margin-setter" class="hidden-print">
            <label for="margin-setter">Margin</label>
          </div>
        </div>
          <div class="space"></div>
        <div class="right-footer">
          <div class="buttons">
            <button type="button" id="new-page">
              <i class="hidden-print fas fa-plus-circle"></i>
            </button>
            <button type="button" id="print">
              <i class="hidden-print fas fa-print"></i>
            </button>
            <button type="button" id="save">
              <i class="hidden-print fas fa-save"></i>
            </button>
          </div>
        </div>
        </div>
      <!-- </div> -->
    </div>
  </div>
  <div id="print-here"></div>
</body>

</html>